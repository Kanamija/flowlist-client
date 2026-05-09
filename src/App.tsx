import { useState, useEffect, type SubmitEvent } from "react";
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

type User = {
  id: string;
  email: string;
  role: string;
  created_at: string;
  full_name: string | null;
};

function App() {
  const [classes, setClasses] = useState<ClassEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [loginError, setLoginError] = useState("");
  const [showLogin, setShowLogin] = useState(false);

  //useEffect runs automatically in response to something changing
  //loadClasses loads classes when the page first opens
  //loadUser checks if the user is already logged in

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

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setUser(data.user);
        }
      } catch (error) {
        console.error("Failed to fetch /me", error);
      }
    }
    loadUser();
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

  //hander functions run only when the user does something - clicks a button, submits a form, types in a field etc...

  async function handleRegisterSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setRegisterError("");

    console.log("sending:", { email, password, full_name: fullName });

    const res = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, full_name: fullName }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
    } else {
      setRegisterError(data.error);
    }
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    setUser(null);
  }

  async function handleLoginSubmit(e: SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoginError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      setUser(data.user);
    } else {
      setLoginError(data.error);
    }
  }

  return (
    <main className="app-shell">
      <header className="page-header">
        <p className="eyebrow">FlowList</p>
        <h1>Upcoming Classes</h1>
        <p className="intro">Browse our schedule and book your spot.</p>
        {user ? (
          <div>
            <p className="greeting">
              Nice to see you, {user.full_name ?? user.email} 🌿
            </p>
            <button onClick={handleLogout}>Log out</button>
          </div>
        ) : showLogin ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="auth-btn" type="submit">
              Log in
            </button>
            {loginError && <p className="auth-error">{loginError}</p>}
            <p className="auth-toggle">
              Don't have an account?{" "}
              <button
                className="auth-button"
                type="button"
                onClick={() => setShowLogin(false)}
              >
                Register
              </button>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <input
              className="auth-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              className="auth-input"
              type="text"
              placeholder="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <input
              className="auth-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button className="auth-btn" type="submit">
              Register
            </button>
            {registerError && <p className="auth-error">{registerError}</p>}
            <p className="auth-toggle">
              Already have an account?{" "}
              <button
                className="auth-btn"
                type="button"
                onClick={() => setShowLogin(true)}
              >
                Log in
              </button>
            </p>
          </form>
        )}
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
            {user && <button className="book-btn">Book your spot</button>}
          </article>
        ))}
      </section>
      <footer className="page-footer">
        <p>Powered by FlowList</p>
      </footer>
    </main>
  );
}

export default App;
