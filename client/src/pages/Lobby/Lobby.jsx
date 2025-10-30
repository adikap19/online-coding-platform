import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Lobby.css";

export default function Lobby() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchBlocks() {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE}/api/codeblocks`
        );
        setBlocks(res.data);
      } catch (err) {
        setError("Failed to load code blocks. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchBlocks();
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
              <div
                key={block._id}
                className="card"
                onClick={() => navigate(`/block/${block._id}`)}
              >
                <div className="card__badge">JS</div>
                <h3 className="card__title">{block.title}</h3>
                <p className="card__hint">Click to enter this code challenge</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
