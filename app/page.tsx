'use client'
export const dynamic = 'force-dynamic'

import { useState } from 'react'

type Habit = {
  habit_id: string
  habit_name: string
  frequency_type: string
  frequency_value: number | null
  done: boolean
}

export default function Home() {
  const [weight, setWeight] = useState('')
  const [sleep, setSleep] = useState('')
  const [note, setNote] = useState('')

  const [habits, setHabits] = useState<Habit[]>([])
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const [lastWeight, setLastWeight] = useState<number | null>(null)

  async function handleSave() {
    if (saving) return

    setSaving(true)
    setSaved(false)

    try {
      const today = new Date().toISOString().slice(0, 10)

      const res = await fetch('/api/save-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: today,
          weight: weight ? Number(weight) : null,
          sleep: sleep ? Number(sleep) : null,
          note,
          habits: habits.map(h => ({
            habit_id: h.habit_id,
            completed: h.done,
          })),
        }),
      })

      if (!res.ok) {
        let message = 'Save failed'
        try {
          const err = await res.json()
          message = err.error || message
        } catch {}
        throw new Error(message)
      }

      if (weight) setLastWeight(Number(weight))

      setSaved(true)
      setTimeout(() => setSaved(false), 1500)

      setWeight('')
      setSleep('')
      setNote('')
      setHabits(hs => hs.map(h => ({ ...h, done: false })))
    } catch (err) {
      console.error('SAVE ERROR', err)
      alert('Save failed — check console')
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

          {habits.length > 0 && (
            <div className="grid grid-cols-2 gap-3">
              {habits.map(habit => (
                <button
                  key={habit.habit_id}
                  onClick={() =>
                    setHabits(hs =>
                      hs.map(h =>
                        h.habit_id === habit.habit_id
                          ? { ...h, done: !h.done }
                          : h
                      )
                    )
                  }
                  className={`p-3 rounded-xl text-sm ${
                    habit.done
                      ? 'bg-white text-black'
                      : 'border border-white/40'
                  }`}
                >
                  {habit.habit_name}
                </button>
              ))}
            </div>
          )}

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
          {saving ? 'SAVING…' : 'SAVE INPUT'}
        </button>

        {saved && (
          <p className="text-green-400 text-sm text-center">
            Saved ✓
          </p>
        )}

        <div className="bg-white/10 rounded-xl p-3 text-sm text-white/60">
          Consistency graph coming here →
        </div>

      </div>
    </main>
  )
}