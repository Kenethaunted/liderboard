export default function Filters({
  search,
  setSearch,
  schoolFilter,
  setSchoolFilter,
  groupFilter,
  setGroupFilter,
  minScore,
  setMinScore,
  maxScore,
  setMaxScore,
  schools,
  groups,
  onReset,
  shownCount,
}) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-5 mb-6 border border-gray-100">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex gap-3 items-center flex-wrap">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по ФИО, школе или группе"
            className="border border-gray-200 rounded-lg px-4 py-2 w-64 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
          />

          <select
            value={schoolFilter}
            onChange={(e) => setSchoolFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Все школы</option>
            {schools.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            value={groupFilter}
            onChange={(e) => setGroupFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Все группы</option>
            {groups.map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <div className="flex items-center gap-2 text-sm">
            <label className="text-gray-600">Баллы:</label>
            <input type="number" className="w-20 border border-gray-200 rounded px-2 py-1" value={minScore} onChange={(e) => setMinScore(Number(e.target.value || 0))} />
            <span className="px-1">—</span>
            <input type="number" className="w-20 border border-gray-200 rounded px-2 py-1" value={maxScore} onChange={(e) => setMaxScore(Number(e.target.value || 1000))} />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={onReset} className="text-sm px-4 py-2 bg-gray-50 border rounded-lg hover:bg-gray-100">Сбросить</button>

          <div className="text-sm text-gray-600">Показано: <span className="font-semibold">{shownCount}</span></div>
        </div>
      </div>
    </div>
  );
}