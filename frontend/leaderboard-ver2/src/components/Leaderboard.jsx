import React, { useMemo, useState } from 'react'
import Filters from './Filters'
import LeaderboardTable from './LeaderboardTable'
import { sampleData } from '../data/sampleData'

const SORT_FIELDS = { place: 'place', score: 'score', name: 'name', school: 'school' }

export default function Leaderboard() {
  const [data] = useState(sampleData)

  const [search, setSearch] = useState('')
  const [schoolFilter, setSchoolFilter] = useState('')
  const [groupFilter, setGroupFilter] = useState('')
  const [minScore, setMinScore] = useState(0)
  const [maxScore, setMaxScore] = useState(1000)

  const [sortBy, setSortBy] = useState(SORT_FIELDS.score) // по умолчанию сортируем по баллам
  const [sortDir, setSortDir] = useState('desc')          // и по убыванию

  const schools = useMemo(() => [...new Set(data.map(d => d.school))], [data])
  const groups = useMemo(() => [...new Set(data.map(d => d.group))], [data])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()

    // 1️⃣ фильтрация
    let filtered = data.filter(s => {
      if (schoolFilter && s.school !== schoolFilter) return false
      if (groupFilter && s.group !== groupFilter) return false
      if (s.score < minScore || s.score > maxScore) return false
      if (!q) return true
      return (
        s.name.toLowerCase().includes(q) ||
        s.school.toLowerCase().includes(q) ||
        s.group.toLowerCase().includes(q)
      )
    })

    // 2️⃣ сортировка
    filtered.sort((a, b) => {
      if (sortBy === SORT_FIELDS.score) {
        // баллы — всегда по убыванию (desc)
        return sortDir === 'asc' ? a.score - b.score : b.score - a.score
      }
      if (sortBy === SORT_FIELDS.place) {
        return sortDir === 'asc' ? a.place - b.place : b.place - a.place
      }
      const res = a[sortBy].localeCompare(b[sortBy])
      return sortDir === 'asc' ? res : -res
    })

    // 3️⃣ пересчёт мест после сортировки
    return filtered.map((s, i) => ({ ...s, place: i + 1 }))
  }, [data, search, schoolFilter, groupFilter, minScore, maxScore, sortBy, sortDir])

  function toggleSort(field) {
    if (sortBy === field) setSortDir(d => (d === 'asc' ? 'desc' : 'asc'))
    else {
      setSortBy(field)
      // если выбираем сортировку по баллам — начинаем с убывания
      setSortDir(field === SORT_FIELDS.score ? 'desc' : 'asc')
    }
  }

  function resetFilters() {
    setSearch('')
    setSchoolFilter('')
    setGroupFilter('')
    setMinScore(0)
    setMaxScore(1000)
    setSortBy(SORT_FIELDS.score)
    setSortDir('desc')
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <header className="flex items-center justify-between mb-6">
        <h1 className="text-2xl lg:text-3xl font-extrabold text-emerald-700">
          Рейтинг лучших студентов
        </h1>
        <div className="text-sm text-gray-600">Последнее обновление: 02.11.2025</div>
      </header>

      <Filters
        search={search} setSearch={setSearch}
        schoolFilter={schoolFilter} setSchoolFilter={setSchoolFilter}
        groupFilter={groupFilter} setGroupFilter={setGroupFilter}
        minScore={minScore} setMinScore={setMinScore}
        maxScore={maxScore} setMaxScore={setMaxScore}
        schools={schools} groups={groups}
        onReset={resetFilters} shownCount={visible.length}
      />

      <LeaderboardTable
        data={visible}
        toggleSort={toggleSort}
        sortBy={sortBy}
        sortDir={sortDir}
      />

      <div className="mt-4 text-sm text-gray-600">
        <div className="flex gap-4 items-center">
          <div>🔼 — улучшение позиции (по сравнению с предыдущим обновлением)</div>
          <div>🔽 — падение позиции</div>
          <div>➖ — без изменений</div>
        </div>
      </div>
    </div>
  )
}
