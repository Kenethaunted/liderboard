import React from "react";
import TableRow from "./TableRow";
import CardRow from "./CardRow";
import { SORT_FIELDS } from "../functions/sort";

export default function LeaderboardTable({
  data,
  toggleSort,
  sortBy,
  sortDir,
}) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100">
      <div className="hidden lg:grid grid-cols-12 gap-0 items-center bg-emerald-700 text-white text-sm font-semibold px-6 py-4">
        <div className="col-span-1">Место</div>
        <div className="col-span-4">ФИО</div>
        <div className="col-span-4">Школа</div>
        <div className="col-span-1">Группа</div>
        <div
          className="col-span-2 cursor-pointer"
          onClick={() => toggleSort(SORT_FIELDS.score)}
        >
          Баллы{" "}
          {sortBy === SORT_FIELDS.score ? (sortDir === "asc" ? "▲" : "▼") : ""}
        </div>
      </div>

      <div>
        {data.map((s) => (
          <React.Fragment key={s.id}>
            <TableRow s={s} />
          </React.Fragment>
        ))}
      </div>

      <div className="lg:hidden grid gap-3 p-3">
        {data.map((s) => (
          <CardRow s={s} key={s.id} />
        ))}
      </div>
    </div>
  );
}
