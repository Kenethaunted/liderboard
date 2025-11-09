import React from 'react'

export default function ProgressBar({ score, max = 300 }) {
  const pct = Math.min(100, Math.max(0, (score / max) * 100));
  return (
    <div className="w-full">
      <div className="text-right font-semibold text-sm text-gray-800">{score}</div>
      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
        <div style={{ width: `${pct}%` }} className="h-2 rounded-full bg-emerald-600" />
      </div>
    </div>
  );
}
