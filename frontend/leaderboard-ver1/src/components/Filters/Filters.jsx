import "./Filters.css";

const RATING_TYPES = {
  STUDENTS: "students",
  TEAMS: "teams",
  MENTORING: "mentoring",
};

export function Filters({
  ratingType,
  search,
  onSearchChange,
  schoolFilter,
  onSchoolFilterChange,
  groupFilter,
  onGroupFilterChange,
  minScore,
  onMinScoreChange,
  maxScore,
  onMaxScoreChange,
  schools,
  groups,
  onReset,
  visibleCount,
}) {
  const isStudentsRating = ratingType === RATING_TYPES.STUDENTS;
  const isMentoringRating = ratingType === RATING_TYPES.MENTORING;

  const getSearchPlaceholder = () => {
    if (isStudentsRating) return "Поиск по ФИО";
    return "Поиск по названию команды";
  };

  const getMaxScoreValue = () => {
    if (isMentoringRating) return 5;
    return 300;
  };

  return (
    <div className="filters-container">
      <div className="filters-controls">
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={getSearchPlaceholder()}
          className="filter-input"
        />

        {isStudentsRating && (
          <>
            <select
              value={schoolFilter}
              onChange={(e) => onSchoolFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="">Все школы</option>
              {schools.map((school) => (
                <option key={school} value={school}>
                  {school}
                </option>
              ))}
            </select>

            <select
              value={groupFilter}
              onChange={(e) => onGroupFilterChange(e.target.value)}
              className="filter-select"
            >
              <option value="">Все группы</option>
              {groups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
          </>
        )}

        <div className="score-range">
          <label>Баллы:</label>
          <input
            type="number"
            min="0"
            max={getMaxScoreValue()}
            value={minScore}
            onChange={(e) => onMinScoreChange(Number(e.target.value) || 0)}
            className="score-input"
          />
          <span>–</span>
          <input
            type="number"
            min="0"
            max={getMaxScoreValue()}
            value={maxScore}
            onChange={(e) =>
              onMaxScoreChange(Number(e.target.value) || getMaxScoreValue())
            }
            className="score-input"
          />
        </div>

        <button onClick={onReset} className="reset-button">
          Сбросить
        </button>
      </div>

      <div className="filters-summary">
        Показано: <strong>{visibleCount}</strong>
      </div>
    </div>
  );
}