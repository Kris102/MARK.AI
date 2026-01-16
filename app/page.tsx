'use client'
export const dynamic = 'force-dynamic'
import { useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

export default function Home() {
  const [weight, setWeight] = useState('')
  const [sleep, setSleep] = useState('')
  const [note, setNote] = useState('')
  const [habits, setHabits] = useState({
    CHECKLIST1: false,
    CHECKLIST2: false,
  })

  async function handleSave() {
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
    setHabits({ CHECKLIST1: false, CHECKLIST2: false })
    alert('Saved')
  }

  return (
    <main
  className="min-h-screen flex items-center justify-center p-6 relative"
  style={{
    backgroundImage: "url('/bg.jpeg')",
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  }}
>
     <div className="w-full max-w-md bg-black rounded-3xl p-6 space-y-5 shadow-2xl">
        <h1 className="text-xl font-semibold">MARK.AI V1.1</h1>

        <input
          value={weight}
          onChange={e => setWeight(e.target.value)}
          placeholder="BODY WEIGHT"
          className="w-full border p-3 rounded-xl"
        />

        <button
          onClick={() => setHabits(h => ({ ...h, CHECKLIST1: !h.CHECKLIST1 }))}
          className={`w-full p-3 rounded-xl ${habits.CHECKLIST1 ? 'bg-black text-white' : 'border'}`}
        >
          CHECKLIST1
        </button>

        <button
          onClick={() => setHabits(h => ({ ...h, CHECKLIST2: !h.CHECKLIST2 }))}
          className={`w-full p-3 rounded-xl ${habits.CHECKLIST2 ? 'bg-black text-white' : 'border'}`}
        >
          CHECKLIST2
        </button>

        <input
          value={sleep}
          onChange={e => setSleep(e.target.value)}
          placeholder="Sleep hours"
          className="w-full border p-3 rounded-xl"
        />

        <textarea
          value={note}
          onChange={e => setNote(e.target.value)}
          placeholder="Note"
          className="w-full border p-3 rounded-xl"
        />

        <button
          onClick={handleSave}
         className="w-full bg-white text-black p-4 rounded-xl text-lg font-medium active:scale-[0.98] transition"
        >
          SAVE INPUT
        </button>
      </div>
    </main>
  )
}