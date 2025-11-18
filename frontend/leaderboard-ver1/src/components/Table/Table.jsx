import "./Table.css";

const RATING_TYPES = {
  STUDENTS: "students",
  TEAMS: "teams",
  MENTORING: "mentoring",
};

export function Table({ data, ratingType, error }) {
  const getTableHeaders = () => {
    switch (ratingType) {
      case RATING_TYPES.STUDENTS:
        return (
          <>
            <th>Место</th>
            <th>ФИО</th>
            <th>Школа</th>
            <th>Группа</th>
            <th>Баллы</th>
          </>
        );
      case RATING_TYPES.TEAMS:
        return (
          <>
            <th>Место</th>
            <th>Название команды</th>
            <th>Баллы</th>
          </>
        );
      case RATING_TYPES.MENTORING:
        return (
          <>
            <th>Место</th>
            <th>ФИО наставника</th>
            <th>Баллы</th>
          </>
        );
      default:
        return null;
    }
  };

  const getTableRow = (item, index) => {
    let rowClass = "";
    if (item.Место === 1) rowClass = "gold-row";
    else if (item.Место === 2) rowClass = "silver-row";
    else if (item.Место === 3) rowClass = "bronze-row";

    switch (ratingType) {
      case RATING_TYPES.STUDENTS:
        return (
          <tr key={item.ФИО || index} className={rowClass}>
            <td>{item.Место}</td>
            <td>{item.ФИО}</td>
            <td>{item.Школа}</td>
            <td>{item.Группа}</td>
            <td>{item["Счет баллов"]}</td>
          </tr>
        );
      case RATING_TYPES.TEAMS:
        {
          const score = item["Счет баллов"];
          return (
            <tr key={item["Название команды"] || index} className={rowClass}>
              <td>{item.Место}</td>
              <td>{item["Название команды"]}</td>
              <td>{score}</td>
            </tr>
          );
        }
      case RATING_TYPES.MENTORING:
        {
          const score = item["Счет баллов"];
          const formattedScore =
            typeof score === "number" ? score.toFixed(2) : score;
          return (
            <tr key={item["ФИО наставника"] || index} className={rowClass}>
              <td>{item.Место}</td>
              <td>{item["ФИО наставника"]}</td>
              <td>{formattedScore}</td>
            </tr>
          );
        }
      default:
        return null;
    }
  };

  const getColSpan = () => {
    switch (ratingType) {
      case RATING_TYPES.STUDENTS:
        return 5;
      case RATING_TYPES.TEAMS:
        return 3;
      case RATING_TYPES.MENTORING:
        return 3;
      default:
        return 5;
    }
  };

  return (
    <div className="app-container">
      <title>Лидерборд</title>

      {error && <p className="error">{error}</p>}

      {/* Десктопная таблица */}
      <table className="film-table">
        <thead>
          <tr>{getTableHeaders()}</tr>
        </thead>
        <tbody>
          {data && data.length > 0 ? (
            data.map((item, index) => getTableRow(item, index))
          ) : (
            <tr>
              <td className="loading" colSpan={getColSpan()}>
                Загрузка данных...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}