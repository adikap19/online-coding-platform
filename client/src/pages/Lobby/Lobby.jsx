import { useEffect, useState } from "react";
import axios from "axios";
import "./Lobby.css";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Modal from "../../components/Modal";

export default function Lobby() {
  const location = useLocation();
  const navigate = useNavigate();

  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showMentorLeft, setShowMentorLeft] = useState(
    Boolean(location.state?.mentorLeft)
  );

  useEffect(() => {
    if (location.state?.mentorLeft) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, []);

  useEffect(() => {
    const ctrl = new AbortController();
    async function fetchBlocks() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/codeblocks`,
          { signal: ctrl.signal }
        );
        setBlocks(res.data);
      } catch (err) {
        if (err.name !== "CanceledError" && err.name !== "AbortError") {
          setError("Failed to load code blocks. Please try again later.");
          console.error(err);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchBlocks();
    return () => ctrl.abort();
  }, []);

  // Determine subtitle text based on the state
  let subtitle = "Choose a code block to start practicing JS:";
  if (loading) subtitle = "Loading code blocks…";
  if (error) subtitle = error;

  return (
    <div className="lobby">
      <div className="hero">
        <h1 className="hero__title">Welcome to Tom's Classroom</h1>
        <p className="hero__subtitle">{subtitle}</p>
      </div>

      {/* Only render the grid if data loaded successfully */}
      {!loading && !error && (
        <section className="section">
          <h2 className="section__title">Choose Code Block</h2>
          <div className="grid">
            {blocks.map((block) => (
              <Link
                key={block._id}
                to={`/block/${block._id}`}
                className="card"
                aria-label={`Open code block: ${block.title}`}
              >
                <div className="card__badge">JS</div>
                <h3 className="card__title">{block.title}</h3>
                <p className="card__hint">Click to enter this code challenge</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      <Modal
        open={showMentorLeft}
        title="Code Session Ended"
        message={
          <>
            The mentor has left the room -
            <br />
            you’ve been redirected to the lobby
          </>
        }
        confirmText="OK"
        onConfirm={() => setShowMentorLeft(false)}
      />
    </div>
  );
}
