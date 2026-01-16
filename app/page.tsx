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
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [lastWeight, setLastWeight] = useState<number | null>(null)

  async function handleSave() {
    console.log('SAVE CLICKED')
    setSaving(true)
    setSaved(false)

  
    try {
      const { createClient } = await import('@supabase/supabase-js')

      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )

      const today = new Date().toISOString().slice(0, 10)

      const res1 = await supabase.from('daily_logs').insert({
        date: today,
        weight: weight ? Number(weight) : null,
        sleep_hours: sleep ? Number(sleep) : null,
        note,
      })

      const res2 = await supabase.from('habit_logs').insert(
        Object.entries(habits).map(([habit_name, done]) => ({
          date: today,
          habit_name,
          done,
        }))
      )
if (weight) {
  setLastWeight(Number(weight))
}
      console.log('DAILY LOG RESULT', res1)
      console.log('HABIT LOG RESULT', res2)

      setWeight('')
      setSleep('')
      setNote('')
      setHabits({ Workout: false, CHECKLIST2: false })
      setSaved(true)
setTimeout(() => setSaved(false), 1500)
    } catch (err) {
      console.error('SAVE ERROR', err)
    } finally {
      setSaving(false)
    }
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
     <div className="w-full max-w-md bg-black/75 backdrop-blur-md rounded-3xl p-6 space-y-6 shadow-2xl text-white">

  {/* HEADER */}
  <div className="space-y-1">
    <h1 className="text-2xl font-semibold">MARK.AI</h1>
    <p className="text-sm text-white/60">
      {new Date().toDateString()}
    </p>
  </div>

  {/* TODAY SNAPSHOT */}
  <div className="grid grid-cols-2 gap-3">
    <div className="bg-white/10 rounded-xl p-3">
      <p className="text-xs text-white/60">BODY WEIGHT</p>
      <p className="text-lg font-medium">
  {lastWeight !== null ? `${lastWeight} kg` : '—'}
</p>
    </div>
    <div className="bg-white/10 rounded-xl p-3">
      <p className="text-xs text-white/60">Last Workout</p>
      <p className="text-lg font-medium">Upper</p>
    </div>
  </div>

  {/* INPUT */}
  
  <div className="space-y-3">
    <input
      value={weight}
      onChange={e => setWeight(e.target.value)}
      placeholder="Body Weight"
      className="w-full bg-white text-black p-3 rounded-xl"
    />

    <div className="grid grid-cols-2 gap-3">
      {Object.keys(habits).map(habit => (
        <button
          key={habit}
          onClick={() =>
            setHabits(h => ({ ...h, [habit]: !h[habit as keyof typeof h] }))
          }
          className={`p-3 rounded-xl text-sm ${
            habits[habit as keyof typeof habits]
              ? 'bg-white text-black'
              : 'border border-white/40'
          }`}
        >
          {habit}
        </button>
      ))}
    </div>

    <input
      value={sleep}
      onChange={e => setSleep(e.target.value)}
      placeholder="Sleep (hrs)"
      className="w-full bg-white text-black p-3 rounded-xl"
    />

    <textarea
      value={note}
      onChange={e => setNote(e.target.value)}
      placeholder="Quick note"
      className="w-full bg-white text-black p-3 rounded-xl"
      rows={2}
    />
  </div>

  {/* ACTION */}
 <button
  type="button"
  onClick={handleSave}
  disabled={saving}
  className="
    w-full
    border border-white
    bg-black
    text-white
    p-4
    rounded-xl
    text-lg
    font-medium
    transition
    active:scale-[0.97]
    disabled:opacity-50
  "
>
  {saving ? 'SAVING' : 'SAVE INPUT'}
</button>
{saved && (
  <p className="text-green-400 text-sm text-center animate-fade">
    Saved ✓
  </p>
)}
  {/* CONSISTENCY PREVIEW (placeholder) */}
  <div className="bg-white/10 rounded-xl p-3 text-sm text-white/60">
    Consistency graph coming here →
  </div>

</div>
    </main>
  )
}

