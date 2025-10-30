import { Link } from "react-router-dom";
import "./Lobby.css";

const codeBlocks = [
  { _id: "1", title: "Async case" },
  { _id: "2", title: "Array sum" },
  { _id: "3", title: "Reverse string" },
  { _id: "4", title: "Is prime" },
];

export default function Lobby() {
  return (
    <div className="lobby-container">
      <h1>Choose code block</h1>
      <ul>
        {codeBlocks.map((b) => (
          <li key={b._id}>
            <Link to={`/block/${b._id}`}>{b.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
