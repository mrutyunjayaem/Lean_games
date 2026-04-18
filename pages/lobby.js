import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addPlayerToGame,
  subscribeToGame,
  subscribeToPlayers,
} from "../lib/firebase";

export default function LobbyPage() {
  const router = useRouter();
  const { gameId } = router.query;

  const [playerName, setPlayerName] = useState("");
  const [playerId, setPlayerId] = useState("");
  const [game, setGame] = useState(null);
  const [players, setPlayers] = useState([]);

  // ✅ Add player to game (runs once)
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

    // ✅ ensures no duplicate players
    addPlayerToGame(gameId, name, storedPlayerId);
  }, [gameId]);

  // 🔌 Subscribe to game state
  useEffect(() => {
    if (!gameId) return;

    const unsub = subscribeToGame(gameId, setGame);
    return () => unsub && unsub();
  }, [gameId]);

  // 🔌 Subscribe to players list
  useEffect(() => {
    if (!gameId) return;

    const unsub = subscribeToPlayers(gameId, setPlayers);
    return () => unsub && unsub();
  }, [gameId]);

  // 🚀 Redirect when game starts
  useEffect(() => {
    if (!game || !players.length || !playerId) return;

    // still in lobby → do nothing
    if (game.status === "lobby") return;

    // find current player
    const player = players.find((p) => p.id === playerId);
    const teamId = player?.teamId;

    console.log("GAME:", game);
    console.log("PLAYER:", player);
    console.log("TEAM ID:", teamId);

    // wait until team assigned
    if (!teamId) return;

    // ✅ redirect to game page
    router.push(`/game/${gameId}/${teamId}`);
  }, [game, players, playerId]);

  return (
    <div style={{ padding: "30px" }}>
      <h1>Lobby</h1>

      <p><b>Game Code:</b> {gameId}</p>
      <p><b>Player:</b> {playerName}</p>
      <p><b>ID:</b> {playerId}</p>

      <p>Waiting for host to start the game...</p>

      {/* 🔍 Debug (you can remove later) */}
      <div style={{ marginTop: "20px", background: "#f5f5f5", padding: "10px" }}>
        <h3>Debug</h3>
        <p>Status: {game?.status}</p>
        <p>Players: {players.length}</p>
      </div>
    </div>
  );
}
