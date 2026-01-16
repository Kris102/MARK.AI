'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'

export default function Home() {
  const [weight, setWeight] = useState('')
  const [sleep, setSleep] = useState('')
  const [note, setNote] = useState('')
  const [habits, setHabits] = useState({
    Workout: false,
    CHECKLIST2: false,
  })

  async function handleSave() {
    // 🔥 Supabase is imported ONLY at runtime
    const { createClient } = await import('@supabase/supabase-js')

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const today = new Date().toISOString().slice(0, 10)

    await supabase.from('daily_logs').insert({
      date: today,
      weight: weight ? Number(weight) : null,
      sleep_hours: sleep ? Number(sleep) : null,
      note,
    })

    await supabase.from('habit_logs').insert(
      Object.entries(habits).map(([habit_name, done]) => ({
        date: today,
        habit_name,
        done,
      }))
    )

    setWeight('')
    setSleep('')
    setNote('')
    setHabits({ Workout: false, CHECKLIST2: false })
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        backgroundImage: "url('/bg.jpeg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="w-full max-w-md bg-black rounded-3xl p-6 space-y-5 shadow-2xl">
        <h1 className="text-xl font-semibold text-white">MARK.AI V1.1</h1>

        <input
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="BODY WEIGHT"
          className="w-full bg-white text-black p-3 rounded-xl"
        />

        <button
          onClick={() => setHabits(h => ({ ...h, Workout: !h.Workout }))}
          className={`w-full p-3 rounded-xl ${
            habits.Workout ? 'bg-white text-black' : 'border border-white text-white'
          }`}
        >
          Workout
        </button>

        <button
          onClick={() => setHabits(h => ({ ...h, CHECKLIST2: !h.CHECKLIST2 }))}
          className={`w-full p-3 rounded-xl ${
            habits.CHECKLIST2 ? 'bg-white text-black' : 'border border-white text-white'
          }`}
        >
          CHECKLIST2
        </button>

        <input
          value={sleep}
          onChange={e => setSleep(e.target.value)}
          placeholder="Sleep hours"
          className="w-full bg-white text-black p-3 rounded-xl"
        />

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Note"
          className="w-full bg-white text-black p-3 rounded-xl"
        />

        <button
          onClick={handleSave}
          className="w-full bg-white text-black p-4 rounded-xl text-lg font-medium"
        >
          SAVE INPUT
        </button>
      </div>
    </main>
  )
}
