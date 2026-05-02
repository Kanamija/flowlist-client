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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClasses() {
      try {
        const res = await fetch("/api/classes");

        if (!res.ok) {
          throw new Error("Failed to load classes");
        }

        const data = await res.json();

        const sortedClasses = [...data.classes].sort(
          (a: ClassEvent, b: ClassEvent) =>
            new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime(),
        );

        setClasses(sortedClasses);
      } catch {
        setError("Could not load classes");
      } finally {
        setIsLoading(false);
      }
    }
    loadClasses();
  }, []);

  if (isLoading) {
    return <p>Loading classes...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (classes.length === 0) {
    return <p>No upcoming classes.</p>;
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">FlowList</p>
        <h1>Upcoming Classes</h1>
        <p className="intro">
          Browse the studio schedule and find your next class.
        </p>
      </header>
      <section className="class-list" aria-label="Upcoming yoga classes">
        {classes.map((cls) => (
          <article className="class-card" key={cls.id}>
            <div>
              <h2>{cls.name}</h2>
              <p className="instructor">with {cls.instructor}</p>
            </div>

            <p className="class-time">
              {new Date(cls.starts_at).toLocaleString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
                hour: "numeric",
                minute: "2-digit",
              })}
            </p>

            <p className="class-meta">{cls.duration_minutes} min</p>
          </article>
        ))}
      </section>
    </main>
  );
}

export default App;
