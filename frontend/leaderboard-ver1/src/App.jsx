// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header/Header";
import { Table } from "./components/Table/Table";
import { Filters } from "./components/Filters/Filters";
import axios from "axios";
import "./App.css";

export default function App() {
  const [students, setStudents] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState(null);

  // Фильтры
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(300);

  useEffect(() => {
    axios
      .get("/students.json")
      .then((response) => {
        const { lastUpdated: rawDate, students: studentList } = response.data;

        const date = new Date(rawDate);
        const formattedDate = date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        setStudents(studentList);
        setLastUpdated(formattedDate);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить рейтинг студентов");
      });
  }, []);

  const schools = useMemo(() => {
    return [...new Set(students.map((s) => s.Школа))];
  }, [students]);

  const groups = useMemo(() => {
    return [...new Set(students.map((s) => s.Группа))];
  }, [students]);

  // Фильтрация + вычисление мест
  const filteredAndRanked = useMemo(() => {
    const query = search.trim().toLowerCase();

    // 1) Сначала применяем фильтры школы/группы и диапазон баллов (но пока не применяем поиск по ФИО)
    const filteredByFilters = students.filter((student) => {
      if (schoolFilter && student.Школа !== schoolFilter) return false;
      if (groupFilter && student.Группа !== groupFilter) return false;
      const score = student["Счет баллов"];
      if (score < minScore || score > maxScore) return false;
      return true;
    });

    // 2) Строим карту мест (placeMap)
    // Если есть фильтр по школе или группе — места считаем относительно filteredByFilters (по убыванию баллов).
    // Если фильтров нет — используем Место из исходных данных (общий рейтинг).
    const placeMap = {};
    if (schoolFilter || groupFilter) {
      // сортируем filteredByFilters по "Счет баллов" (desc) и присваиваем место относительно этой выборки
      const sorted = [...filteredByFilters].sort(
        (a, b) => b["Счет баллов"] - a["Счет баллов"]
      );
      sorted.forEach((st, idx) => {
        // используем ФИО как ключ (предполагается уникальность). При необходимости заменить на id.
        placeMap[st.ФИО] = idx + 1;
      });
    } else {
      // нет фильтра — используем исходные Места (как в students.json)
      students.forEach((st) => {
        // на случай, если в исходных данных Место отсутствует, можно вычислить по "Счет баллов",
        // но по условию у вас есть поле "Место" в JSON — используем его.
        placeMap[st.ФИО] = st.Место != null ? st.Место : null;
      });
    }

    // 3) Применяем поиск по ФИО (он сужает отображаемую выборку).
    let result = filteredByFilters.filter((student) => {
      if (!query) return true;
      return (student.ФИО || "").toLowerCase().includes(query);
    });

    // 4) Упорядочиваем отображаемый результат по месту (чтобы отображался правильный порядок)
    // Если для некоторых студентов placeMap может быть undefined — поместим их в конец.
    result.sort((a, b) => {
      const pa = placeMap[a.ФИО] ?? Number.MAX_SAFE_INTEGER;
      const pb = placeMap[b.ФИО] ?? Number.MAX_SAFE_INTEGER;
      return pa - pb;
    });

    // 5) Возвращаем массив с корректным полем Место (от placeMap)
    return result.map((student) => ({
      ...student,
      Место: placeMap[student.ФИО] ?? student.Место ?? null,
    }));
  }, [students, search, schoolFilter, groupFilter, minScore, maxScore]);

  const resetFilters = () => {
    setSearch("");
    setSchoolFilter("");
    setGroupFilter("");
    setMinScore(0);
    setMaxScore(300);
  };

  return (
    <>
      <Header />
      <div className="app-main">
        <div className="leaderboard-container">
          <div className="leaderboard-header">
            <h1 className="app-title">Рейтинг лучших студентов</h1>
            <div className="text-sm text-gray-600">
              Последнее обновление: <strong>{lastUpdated || "—"}</strong>
            </div>
          </div>

          <Filters
            search={search}
            onSearchChange={setSearch}
            schoolFilter={schoolFilter}
            onSchoolFilterChange={setSchoolFilter}
            groupFilter={groupFilter}
            onGroupFilterChange={setGroupFilter}
            minScore={minScore}
            onMinScoreChange={setMinScore}
            maxScore={maxScore}
            onMaxScoreChange={setMaxScore}
            schools={schools}
            groups={groups}
            onReset={resetFilters}
            visibleCount={filteredAndRanked.length}
          />

          <Table students={filteredAndRanked} error={error} className="mt-6" />
        </div>
      </div>
    </>
  );
}
