export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export async function POST(req: Request) {
  console.log('API HIT')

  try {
    const { date, weight, sleep, note, habits } = await req.json()

    // 1️⃣ UPSERT daily log (1 row per date)
    const { error: dailyError } = await supabase
      .from('daily_logs')
      .upsert(
        {
          date,
          weight,
          sleep_hours: sleep,
          note,
        },
        { onConflict: 'date' }
      )

    if (dailyError) throw dailyError

    // 2️⃣ Insert habit logs (append-only)
    if (Array.isArray(habits)) {
      for (const h of habits) {
        const { error: habitError } = await supabase
          .from('habit_logs')
          .insert({
            date,
            habit_name: h.habit_id,
            done: h.completed,
          })

        if (habitError) throw habitError
      }
    }

    console.log('About to write to Google Sheets')

    // 3️⃣ Google Sheets auth
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
      key: process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })

    const sheets = google.sheets({ version: 'v4', auth })

    // 4️⃣ Append to Google Sheet (history log)
    await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID!,
      range: 'A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[
          date,
          weight ?? '',
          sleep ?? '',
          note ?? '',
          new Date().toISOString(),
        ]],
      },
    })

    return NextResponse.json({ success: true })
  } catch (err: any) {
    console.error('API SAVE ERROR FULL:', err)
    return NextResponse.json(
      { error: err.message || 'Save failed' },
      { status: 500 }
    )
  }
}