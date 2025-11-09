import React from 'react'
import TrendBadge from './TrendBadge'
import { medalForPlace } from '../functions/medal';

export default function CardRow({ s }) {
  const place = s.displayPlace ?? s.place;
  const medal = medalForPlace(place);
  return (
    <div className="lg:hidden bg-white border rounded-xl shadow-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="font-bold text-lg">{place}</div>
          <img src={s.avatar} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="font-medium">{s.name} {medal.medal && <span className="ml-2">{medal.medal}</span>}</div>
            <div className="text-xs text-gray-500">{s.school}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-semibold">{s.score}</div>
          <div className="text-xs text-gray-500">{s.group}</div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-sm"><TrendBadge prevPlace={s.prevPlace} place={place} /></div>
        <div className="w-1/2 bg-gray-200 rounded-full h-2">
          <div style={{ width: `${Math.min(100, (s.score / 300) * 100)}%` }} className="h-2 rounded-full bg-emerald-600" />
        </div>
      </div>
    </div>
  );
}