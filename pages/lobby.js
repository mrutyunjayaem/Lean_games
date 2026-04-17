import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { addPlayerToGame } from "../lib/firebase";

export default function LobbyPage() {
  const router = useRouter();
  const { gameId } = router.query;

  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    if (!gameId) return;

    const name = localStorage.getItem("playerName");

    // 🔥 Always maintain a fixed player ID
    let storedPlayerId = localStorage.getItem("playerId");

    if (!storedPlayerId) {
      storedPlayerId = Math.random().toString(36).substring(2, 10);
      localStorage.setItem("playerId", storedPlayerId);
    }

    setPlayerName(name);
    setPlayerId(storedPlayerId);

    // 🔥 IMPORTANT: Always write using SAME playerId (no duplicates)
    addPlayerToGame(gameId, name, storedPlayerId);

  }, [gameId]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Lobby</h1>

      <p><b>Game Code:</b> {gameId}</p>
      <p><b>Player:</b> {playerName}</p>
      <p><b>ID:</b> {playerId}</p>

      <p>Waiting for other players...</p>
    </div>
  );
}