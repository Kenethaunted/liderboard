import React from "react";
import ProgressBar from "./ProgressBar";
import TrendBadge from "./TrendBadge";
import { medalForPlace } from "../functions/medal";

export default function TableRow({ s }) {
  const place = s.displayPlace ?? s.place;
  const medal = medalForPlace(place);
  const rowBg = medal.bg ? `${medal.bg} bg-opacity-80` : "bg-white";
  const textColor = medal.text || "text-gray-800";

  return (
    <div
      className={`hidden lg:grid grid-cols-12 gap-0 items-center border-b last:border-b-0 hover:bg-gray-50 px-4 py-4 ${rowBg}`}
    >
      <div className="col-span-1 font-semibold text-gray-800 flex items-center gap-2">
        <span
          className={`inline-flex items-center justify-center w-7 h-7 rounded-full bg-white/60 text-sm`}
        >
          {place}
        </span>
        {medal.medal && <span className="text-xl">{medal.medal}</span>}
      </div>

      <div className="col-span-4 flex items-center gap-3">
        <img
          src={s.avatar}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover border"
        />
        <div>
          <div className={`font-medium ${textColor}`}>{s.name}</div>
          <div className="text-xs text-gray-500">
            {s.id % 2 === 0 ? "студент" : "с отличием"}
          </div>
        </div>
      </div>

      <div className="col-span-4 text-sm text-gray-700">{s.school}</div>

      <div className="col-span-1 text-sm font-medium">{s.group}</div>

      <div className="col-span-2 flex items-center justify-between gap-2">
        <div className="flex-1">
          <ProgressBar score={s.score} />
        </div>
        <div className="flex-shrink-0 ml-2">
          <TrendBadge prevPlace={s.prevPlace} place={place} />
        </div>
      </div>
    </div>
  );
}
