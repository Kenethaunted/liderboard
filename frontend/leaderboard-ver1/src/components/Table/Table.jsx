import "./Table.css";

export function Table({ students, error }) {
  return (
    <div className="app-container">
      <title>Лидерборд</title>

      {error && <p className="error">{error}</p>}

      {/* Десктопная таблица */}
      <table className="film-table">
        <thead>
          <tr>
            <th>Место</th>
            <th>ФИО</th>
            <th>Школа</th>
            <th>Группа</th>
            <th>Баллы</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => {
              let rowClass = "";
              if (student.Место === 1) rowClass = "gold-row";
              else if (student.Место === 2) rowClass = "silver-row";
              else if (student.Место === 3) rowClass = "bronze-row";

              return (
                <tr key={student.Место} className={rowClass}>
                  <td>{student.Место}</td>
                  <td>{student.ФИО}</td>
                  <td>{student.Школа}</td>
                  <td>{student.Группа}</td>
                  <td>{student["Счет баллов"]}</td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td className="loading" colSpan="5">
                Загрузка данных...
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
