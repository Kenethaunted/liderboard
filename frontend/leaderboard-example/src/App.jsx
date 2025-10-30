import { useEffect, useState } from "react";
import { Header } from "./components/Header/Header";
import { Table } from "./components/Table/Table";
import axios from "axios";
import "./App.css";

export default function App() {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/students.json")
      .then((response) => {
        setStudents(response.data);
      })
      .catch((err) => {
        console.error("Ошибка при загрузке данных:", err);
        setError("Не удалось загрузить рейтинг студентов");
      });
  }, []);

  return (
    <>
      <Header />
      <Table students={students} error={error} />
    </>
  );
}
