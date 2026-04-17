import { useState, useEffect } from "react";
import { createTeam, joinTeam, subscribeToTeams, getGame } from "../lib/firebase";

export default function Lobby({ gameId, playerName, onJoined }) {
  const [teams, setTeams] = useState([]);
  const [newTeamName, setNewTeamName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [gameExists, setGameExists] = useState(null);

  useEffect(() => {
    if (!gameId) return;

    getGame(gameId).then((g) => {
      setGameExists(!!g);
    });

    const unsub = subscribeToTeams(gameId, setTeams);
    return () => unsub();
  }, [gameId]);

  async function handleCreateTeam() {
    if (!newTeamName.trim()) { setError("Enter a team name"); return; }
    setLoading(true);
    setError("");
    try {
      const teamId = await createTeam(gameId, newTeamName);
      const { playerId, role } = await joinTeam(gameId, teamId, playerName);
      onJoined(teamId, playerId, role);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  async function handleJoinTeam(teamId) {
    setLoading(true);
    setError("");
    try {
      const { playerId, role } = await joinTeam(gameId, teamId, playerName);
      onJoined(teamId, playerId, role);
    } catch (e) {
      setError(e.message);
    }
    setLoading(false);
  }

  if (gameExists === false) {
    return (
      <div className="container">
        <div className="card center-card">
          <h2>Game Not Found</h2>
          <p>No game with code <strong>{gameId}</strong> exists.</p>
          <a href="/" className="btn btn-link">Go Back</a>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card center-card">
        <h1>Join a Team</h1>
        <div className="game-code-display">
          Game: <span className="code">{gameId}</span>
        </div>
        <p>Playing as: <strong>{playerName}</strong></p>

        {error && <div className="error">{error}</div>}

        {/* Existing teams */}
        {teams.length > 0 && (
          <div className="teams-join-list">
            <h3>Available Teams</h3>
            {teams.map((team) => (
              <div key={team.id} className="team-join-card">
                <div>
                  <strong>{team.teamName}</strong>
                  <span className="player-count">
                    {team.players.length}/4 players
                  </span>
                </div>
                <div className="team-roles">
                  {team.players.map((p, i) => (
                    <span key={i} className={`role-badge role-${p.role.toLowerCase()}`}>
                      {p.role}: {p.name}
                    </span>
                  ))}
                </div>
                {team.players.length < 4 ? (
                  <button
                    className="btn btn-secondary"
                    onClick={() => handleJoinTeam(team.id)}
                    disabled={loading}
                  >
                    Join
                  </button>
                ) : (
                  <span className="badge badge-yellow">Full</span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Create new team */}
        <div className="create-team-section">
          <h3>Or Create a New Team</h3>
          <div className="form-row">
            <input
              type="text"
              value={newTeamName}
              onChange={(e) => setNewTeamName(e.target.value)}
              placeholder="Team name"
            />
            <button
              className="btn btn-primary"
              onClick={handleCreateTeam}
              disabled={loading}
            >
              Create & Join
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
