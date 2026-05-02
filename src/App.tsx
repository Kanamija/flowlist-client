import { useState, useEffect } from "react";
import "./App.css";

type ClassEvent = {
  id: string;
  name: string;
  description: string | null;
  instructor: string;
  starts_at: string;
  duration_minutes: number;
  max_capacity: number;
  spots_remaining: number;
  is_cancelled: boolean;
};

function App() {
  const [classes, setClasses] = useState<ClassEvent[]>([]);

  useEffect(() => {
    async function loadClasses() {
      const res = await fetch("/api/classes");
      const data = await res.json();
      setClasses(data.classes);
    }
    loadClasses();
  }, []);

  return (
    <div>
      <h1>Upcoming Classes</h1>
      <ul>
        {classes.map((cls) => (
          <li key={cls.id}>
            <strong>{cls.name}</strong> with {cls.instructor}
            <br />
            {new Date(cls.starts_at).toLocaleString()} · {cls.duration_minutes}{" "}
            min
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
