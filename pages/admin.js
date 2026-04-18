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
      unsub1 && unsub1();
      unsub2 && unsub2();
      unsub3 && unsub3();
    };
  }, [gameId]);

  if (!game) return <div>Loading...</div>;

  async function handleStart() {
    try {
      console.log("Starting game...");

      await updateGame(gameId, { totalRounds });

      await startGame(gameId); // 🔥 critical

    } catch (e) {
      console.error("Start error:", e);
    }
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

      <p><b>Status:</b> {game.status}</p>
      <p><b>Round:</b> {game.currentRound} / {game.totalRounds}</p>

      {game.status === "lobby" && (
        <div>
          <input
            type="number"
            value={totalRounds}
            onChange={(e) => handleSetRounds(e.target.value)}
          />

          <button onClick={handleStart}>
            Start Game
          </button>
        </div>
      )}

      {game.status === "playing" && (
        <div>
          <button onClick={handleProcessAndAdvance}>
            Next Round
          </button>
        </div>
      )}
    </div>
  );
}
