import { Link } from "react-router-dom";
import "./Lobby.css";

const blocks = [
  { _id: "1", title: "Async case" },
  { _id: "2", title: "Array sum" },
  { _id: "3", title: "Reverse string" },
  { _id: "4", title: "Is prime" },
];

export default function Lobby() {
  return (
    <div className="lobby">
      <header className="hero">
        <h1 className="hero__title">Welcome to Tom&apos;s classroom</h1>
        <p className="hero__subtitle">
          Practice, collaborate, and master JavaScript.
        </p>
      </header>

      <section className="section">
        <h2 className="section__title">Choose code block</h2>

        <div className="grid">
          {blocks.map((b) => (
            <Link
              key={b._id}
              to={`/block/${b._id}`}
              className="card"
              aria-label={`Open ${b.title}`}
            >
              <div className="card__badge">JS</div>
              <h3 className="card__title">{b.title}</h3>
              <p className="card__hint">Click to enter room →</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
