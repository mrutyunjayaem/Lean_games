import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { addPlayerToGame, subscribeToGame } from "../lib/firebase";

export default function LobbyPage() {
  const router = useRouter();
  const { gameId } = router.query;

  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [game, setGame] = useState(null);

  // ✅ Add player to game
  useEffect(() => {
    if (!gameId) return;

    const name = localStorage.getItem("playerName");

    let storedPlayerId = localStorage.getItem("playerId");

    if (!storedPlayerId) {
      storedPlayerId = Math.random().toString(36).substring(2, 10);
      localStorage.setItem("playerId", storedPlayerId);
    }

    setPlayerName(name);
    setPlayerId(storedPlayerId);

    addPlayerToGame(gameId, name, storedPlayerId);
  }, [gameId]);

  // 🔥 NEW: Listen to game state
  useEffect(() => {
    if (!gameId) return;

    const unsubscribe = subscribeToGame(gameId, (gameData) => {
      setGame(gameData);
    });

    return () => unsubscribe && unsubscribe();
  }, [gameId]);

  // 🔥 NEW: Redirect when game starts
  useEffect(() => {
    if (!game) return;

    // ⚠️ depends on how you mark game start
    if (game.phase === "LOBBY") return;

    // 👉 Assign team (simple logic for now)
    const teamId = game.teamAssignments?.[playerId];

    if (!teamId) return;

    console.log("Redirecting to game:", gameId, teamId);

    router.push(`/game/${gameId}/${teamId}`);
  }, [game, playerId]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Lobby</h1>

      <p><b>Game Code:</b> {gameId}</p>
      <p><b>Player:</b> {playerName}</p>
      <p><b>ID:</b> {playerId}</p>

      <p>Waiting for host to start the game...</p>
    </div>
  );
}
