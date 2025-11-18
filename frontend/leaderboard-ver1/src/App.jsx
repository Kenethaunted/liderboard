// src/App.jsx
import { useEffect, useMemo, useState } from "react";
import { Header } from "./components/Header/Header";
import { Table } from "./components/Table/Table";
import { Filters } from "./components/Filters/Filters";
import axios from "axios";
import "./App.css";

const RATING_TYPES = {
  STUDENTS: "students",
  TEAMS: "teams",
  MENTORING: "mentoring",
};

const RATING_TITLES = {
  [RATING_TYPES.STUDENTS]: "Рейтинг лучших студентов",
  [RATING_TYPES.TEAMS]: "Рейтинг лучших команд",
  [RATING_TYPES.MENTORING]: "Рейтинг лучших наставников",
};

export default function App() {
  const [ratingType, setRatingType] = useState(RATING_TYPES.STUDENTS);
  const [students, setStudents] = useState([]);
  const [teams, setTeams] = useState([]);
  const [mentoring, setMentoring] = useState([]);
  const [lastUpdated, setLastUpdated] = useState("");
  const [error, setError] = useState(null);

  // Фильтры
  const [search, setSearch] = useState("");
  const [schoolFilter, setSchoolFilter] = useState("");
  const [groupFilter, setGroupFilter] = useState("");
  const [minScore, setMinScore] = useState(0);
  const [maxScore, setMaxScore] = useState(300);

  // Обновляем maxScore при смене типа рейтинга
  useEffect(() => {
    if (ratingType === RATING_TYPES.MENTORING) {
      setMaxScore(5);
      setMinScore(0);
    } else {
      setMaxScore(300);
      setMinScore(0);
    }
  }, [ratingType]);

  // Загрузка данных для всех рейтингов
  useEffect(() => {
    // Загрузка рейтинга студентов
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
        console.error("Ошибка при загрузке данных студентов:", err);
        setError("Не удалось загрузить рейтинг студентов");
      });

    // Загрузка командного рейтинга
    axios
      .get("/teams.json")
      .then((response) => {
        const { teams: teamList } = response.data;
        setTeams(teamList);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке командного рейтинга:", err);
      });

    // Загрузка наставнического рейтинга
    axios
      .get("/mentoring.json")
      .then((response) => {
        const { teams: mentoringList } = response.data;
        setMentoring(mentoringList);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке наставнического рейтинга:", err);
      });
  }, []);

  const schools = useMemo(() => {
    return [...new Set(students.map((s) => s.Школа))];
  }, [students]);

  const groups = useMemo(() => {
    return [...new Set(students.map((s) => s.Группа))];
  }, [students]);

  // Фильтрация для рейтинга студентов
  const filteredStudents = useMemo(() => {
    if (ratingType !== RATING_TYPES.STUDENTS) return [];

    const query = search.trim().toLowerCase();
    const filteredByFilters = students.filter((student) => {
      if (schoolFilter && student.Школа !== schoolFilter) return false;
      if (groupFilter && student.Группа !== groupFilter) return false;
      const score = student["Счет баллов"];
      if (score < minScore || score > maxScore) return false;
      return true;
    });

    const placeMap = {};
    if (schoolFilter || groupFilter) {
      const sorted = [...filteredByFilters].sort(
        (a, b) => b["Счет баллов"] - a["Счет баллов"]
      );
      sorted.forEach((st, idx) => {
        placeMap[st.ФИО] = idx + 1;
      });
    } else {
      students.forEach((st) => {
        placeMap[st.ФИО] = st.Место != null ? st.Место : null;
      });
    }

    let result = filteredByFilters.filter((student) => {
      if (!query) return true;
      return (student.ФИО || "").toLowerCase().includes(query);
    });

    result.sort((a, b) => {
      const pa = placeMap[a.ФИО] ?? Number.MAX_SAFE_INTEGER;
      const pb = placeMap[b.ФИО] ?? Number.MAX_SAFE_INTEGER;
      return pa - pb;
    });

    return result.map((student) => ({
      ...student,
      Место: placeMap[student.ФИО] ?? student.Место ?? null,
    }));
  }, [students, search, schoolFilter, groupFilter, minScore, maxScore, ratingType]);

  // Фильтрация для командного рейтинга
  const filteredTeams = useMemo(() => {
    if (ratingType !== RATING_TYPES.TEAMS) return [];

    const query = search.trim().toLowerCase();
    let result = teams.filter((team) => {
      const score = team["Счет баллов"];
      if (score < minScore || score > maxScore) return false;
      if (!query) return true;
      return (team["Название команды"] || "").toLowerCase().includes(query);
    });

    result.sort((a, b) => {
      const pa = a.Место ?? Number.MAX_SAFE_INTEGER;
      const pb = b.Место ?? Number.MAX_SAFE_INTEGER;
      return pa - pb;
    });

    return result;
  }, [teams, search, minScore, maxScore, ratingType]);

  // Фильтрация для наставнического рейтинга
  const filteredMentoring = useMemo(() => {
    if (ratingType !== RATING_TYPES.MENTORING) return [];

    const query = search.trim().toLowerCase();
    let result = mentoring.filter((team) => {
      const score = team["Счет баллов"];
      if (score < minScore || score > maxScore) return false;
      if (!query) return true;
      return (team["Название команды"] || "").toLowerCase().includes(query);
    });

    result.sort((a, b) => {
      const pa = a.Место ?? Number.MAX_SAFE_INTEGER;
      const pb = b.Место ?? Number.MAX_SAFE_INTEGER;
      return pa - pb;
    });

    return result;
  }, [mentoring, search, minScore, maxScore, ratingType]);

  // Определяем текущие данные и количество
  const currentData = useMemo(() => {
    switch (ratingType) {
      case RATING_TYPES.STUDENTS:
        return filteredStudents;
      case RATING_TYPES.TEAMS:
        return filteredTeams;
      case RATING_TYPES.MENTORING:
        return filteredMentoring;
      default:
        return [];
    }
  }, [filteredStudents, filteredTeams, filteredMentoring, ratingType]);

  const resetFilters = () => {
    setSearch("");
    setSchoolFilter("");
    setGroupFilter("");
    setMinScore(0);
    // maxScore обновляется автоматически через useEffect при смене ratingType
  };

  const handleRatingTypeChange = (type) => {
    setRatingType(type);
    // Сбрасываем только текстовые фильтры, maxScore обновится через useEffect
    setSearch("");
    setSchoolFilter("");
    setGroupFilter("");
    setMinScore(0);
  };

  return (
    <>
      <Header />
      <div className="app-main">
        <div className="leaderboard-container">
          <div className="leaderboard-header">
            <h1 className="app-title">{RATING_TITLES[ratingType]}</h1>
            <div className="text-sm text-gray-600">
              Последнее обновление: <strong>{lastUpdated || "—"}</strong>
            </div>
          </div>

          <div className="rating-switcher">
            <button
              className={`rating-tab ${ratingType === RATING_TYPES.STUDENTS ? "active" : ""}`}
              onClick={() => handleRatingTypeChange(RATING_TYPES.STUDENTS)}
            >
              Студенты
            </button>
            <button
              className={`rating-tab ${ratingType === RATING_TYPES.TEAMS ? "active" : ""}`}
              onClick={() => handleRatingTypeChange(RATING_TYPES.TEAMS)}
            >
              Командный
            </button>
            <button
              className={`rating-tab ${ratingType === RATING_TYPES.MENTORING ? "active" : ""}`}
              onClick={() => handleRatingTypeChange(RATING_TYPES.MENTORING)}
            >
              Наставнический
            </button>
          </div>

          <Filters
            ratingType={ratingType}
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
            visibleCount={currentData.length}
          />

          <Table
            data={currentData}
            ratingType={ratingType}
            error={error}
            className="mt-6"
          />
        </div>
      </div>
    </>
  );
}
