import { useState } from "react";
import { useRouter } from "next/router";
import { createGameSession } from "../lib/firebase";

export default function Home() {
  const router = useRouter();

  const [screen, setScreen] = useState("home");
  const [playerName, setPlayerName] = useState("");
  const [gameId, setGameId] = useState("");
  const [error, setError] = useState("");

  // ✅ Create Game (Host)
  async function handleCreateGame() {
    setError("");

    if (!playerName.trim()) {
      setError("Enter your name");
      return;
    }

    try {
      const id = await createGameSession(playerName);

      // Store data
      localStorage.setItem("playerName", playerName.trim());
      localStorage.setItem("gameId", id);
      localStorage.setItem("isHost", "true");

      // ✅ Correct (no change needed here)
      router.push(`/admin?gameId=${id}`);
    } catch (e) {
      console.error(e);
      setError("Failed to create game");
    }
  }

  // ✅ Join Game (Player)
  function handleJoinGame() {
    setError("");

    if (!playerName.trim() || !gameId.trim()) {
      setError("Enter name and game code");
      return;
    }

    const formattedGameId = gameId.trim().toUpperCase();

    // Store data
    localStorage.setItem("playerName", playerName.trim());
    localStorage.setItem("gameId", formattedGameId);

    // ✅ Correct (DO NOT change this)
    router.push(`/lobby?gameId=${formattedGameId}`);
  }

  return (
    <div style={{ padding: "30px", maxWidth: "400px", margin: "auto" }}>
      <h1>Supply Chain Game</h1>

      <input
        type="text"
        placeholder="Your name"
        value={playerName}
        onChange={(e) => setPlayerName(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      {error && <p style={{ color: "red" }}>{error}</p>}

      {screen === "home" && (
        <>
          <button onClick={() => setScreen("create")}>Host Game</button>

          <button
            onClick={() => setScreen("join")}
            style={{ marginLeft: "10px" }}
          >
            Join Game
          </button>
        </>
      )}

      {screen === "create" && (
        <>
          <button onClick={handleCreateGame}>
            Create Game Room
          </button>

          <button onClick={() => setScreen("home")}>
            Back
          </button>
        </>
      )}

      {screen === "join" && (
        <>
          <input
            type="text"
            placeholder="Game Code"
            value={gameId}
            onChange={(e) =>
              setGameId(e.target.value.toUpperCase())
            }
            style={{
              width: "100%",
              padding: "10px",
              marginTop: "10px",
            }}
          />

          <button
            onClick={handleJoinGame}
            style={{ marginTop: "10px" }}
          >
            Join Game
          </button>

          <button onClick={() => setScreen("home")}>
            Back
          </button>
        </>
      )}
    </div>
  );
}
