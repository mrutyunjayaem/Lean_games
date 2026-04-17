import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  subscribeToGame,
  subscribeToTeams,
  subscribeToPlayers,
  updateGame,
  startGame,
  advanceRound,
  processRound,
} from "../lib/firebase";

export default function AdminPage() {
  const router = useRouter();
  const { gameId } = router.query;

  const [game, setGame] = useState(null);
  const [teams, setTeams] = useState([]);
  const [players, setPlayers] = useState([]);
  const [processing, setProcessing] = useState(false);
  const [totalRounds, setTotalRounds] = useState(5);

  useEffect(() => {
    if (!gameId) return;

    const unsub1 = subscribeToGame(gameId, setGame);
    const unsub2 = subscribeToTeams(gameId, setTeams);
    const unsub3 = subscribeToPlayers(gameId, setPlayers);

    return () => {
      unsub1();
      unsub2();
      unsub3();
    };
  }, [gameId]);

  if (!game) return <div>Loading...</div>;

  const totalPlayers = players.length;

  async function handleStart() {
    await updateGame(gameId, { totalRounds });
    await startGame(gameId);
  }

  async function handleProcessAndAdvance() {
    setProcessing(true);
    try {
      await processRound(gameId);
      await advanceRound(gameId);
    } catch (e) {
      console.error(e);
    }
    setProcessing(false);
  }

  function handleSetRounds(val) {
    const n = Math.max(1, Math.min(20, parseInt(val) || 5));
    setTotalRounds(n);
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>Admin Panel</h1>

      <p><b>Game Code:</b> {gameId}</p>

      <div style={{ marginBottom: "20px" }}>
        <p><b>Teams:</b> {teams.length}</p>
        <p><b>Players:</b> {totalPlayers}</p>
        <p><b>Status:</b> {game.status}</p>
        <p><b>Round:</b> {game.currentRound} / {game.totalRounds}</p>
      </div>

      {game.status === "lobby" && (
        <div>
          <label>Number of Rounds</label>
          <input
            type="number"
            value={totalRounds}
            onChange={(e) => handleSetRounds(e.target.value)}
          />

          <button
            onClick={handleStart}
            disabled={players.length === 0}
          >
            Start Game
          </button>
        </div>
      )}

      {game.status === "playing" && (
        <div>
          <h3>Round {game.currentRound}</h3>

          <button
            onClick={handleProcessAndAdvance}
            disabled={processing}
          >
            {processing ? "Processing..." : "Next Round"}
          </button>
        </div>
      )}

      <h2>Teams</h2>

      {teams.map((team) => (
        <div key={team.id} style={{
          border: "1px solid black",
          padding: "10px",
          marginBottom: "10px"
        }}>
          <h3>{team.teamName}</h3>
          <p>Players: {team.playerCount || 0} / 4</p>
          <p>Score: {team.totalScore || 0}</p>
        </div>
      ))}

      <h2>Players</h2>

      {players.map((p) => (
        <div key={p.id} style={{
          border: "1px solid gray",
          padding: "5px",
          marginBottom: "5px"
        }}>
          <p><b>{p.name}</b></p>
          <p>Team: {p.teamId}</p>
          <p>Role: {p.role}</p>
        </div>
      ))}
    </div>
  );
}