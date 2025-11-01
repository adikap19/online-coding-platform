import { useState, useMemo } from "react";

/** Right-side collapsible hints. Each hint reveals on click and stays open until unmount. */
export default function HintsPanel({ hints = [] }) {
  const safeHints = useMemo(
    () => (Array.isArray(hints) ? hints.slice(0, 2) : []),
    [hints]
  );
  const [revealed, setRevealed] = useState(safeHints.map(() => false));

  const reveal = (idx) => {
    setRevealed((prev) => {
      const next = [...prev];
      next[idx] = true;
      return next;
    });
  };

  if (!safeHints.length) {
    return (
      <aside className="hints">
        <h3 className="hints__title">Hints</h3>
        <p className="hints__empty">No hints available for this exercise.</p>
      </aside>
    );
  }

  return (
    <aside className="hints">
      <h3 className="hints__title">Hints</h3>

      {safeHints.map((hint, i) => (
        <div className="hint" key={i}>
          <div className="hint__header">
            <span className="hint__badge">Hint {i + 1}</span>
            {!revealed[i] && (
              <button className="hint__revealBtn" onClick={() => reveal(i)}>
                Reveal
              </button>
            )}
          </div>

          {revealed[i] ? (
            <p className="hint__body">{hint}</p>
          ) : (
            <p className="hint__placeholder">Hidden. Click “Reveal” to show.</p>
          )}
        </div>
      ))}
    </aside>
  );
}
