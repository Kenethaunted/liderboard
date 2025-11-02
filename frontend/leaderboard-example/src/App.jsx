// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header/Header";
import { Table } from "./components/Table/Table";
import { Filters } from "./components/Filters/Filters";
import axios from "axios";
import "./App.css";

export default function App() {
  const [students, setStudents] = useState([]); // ← будет массивом
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
        const { lastUpdated: rawDate, students: studentList } = response.data; // ← деструктуризация

        const date = new Date(rawDate);
        const formattedDate = date.toLocaleDateString("ru-RU", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        });

        setStudents(studentList); // ← сохраняем только массив
        setLastUpdated(formattedDate);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить рейтинг студентов");
      });
  }, []);

  // Вспомогательные списки
  const schools = useMemo(() => {
    return [...new Set(students.map((s) => s.Школа))];
  }, [students]);

  const groups = useMemo(() => {
    return [...new Set(students.map((s) => s.Группа))];
  }, [students]);

  // Фильтрация
  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students.filter((student) => {
      if (schoolFilter && student.Школа !== schoolFilter) return false;
      if (groupFilter && student.Группа !== groupFilter) return false;
      const score = student["Счет баллов"];
      if (score < minScore || score > maxScore) return false;
      if (query) {
        const matchesName = student.ФИО.toLowerCase().includes(query);
        const matchesSchool = student.Школа.toLowerCase().includes(query);
        const matchesGroup = student.Группа.toLowerCase().includes(query);
        if (!matchesName && !matchesSchool && !matchesGroup) return false;
      }
      return true;
    });
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
        {/* Общий контейнер для всего контента */}
        <div className="leaderboard-container">
          {/* Заголовок + дата */}
          <div className="leaderboard-header">
            <h1 className="app-title">
              Рейтинг лучших студентов
            </h1>
            <div className="text-sm text-gray-600">
              Последнее обновление: <strong>{lastUpdated || "—"}</strong>
            </div>
          </div>

          {/* Фильтры */}
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
            visibleCount={filteredStudents.length}
          />

          {/* Таблица */}
          <Table students={filteredStudents} error={error} />
        </div>
      </div>
    </>
  );
}
