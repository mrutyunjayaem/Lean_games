import { useState } from "react";
import { submitInvestment } from "../lib/firebase";
import PlayerDashboard from "./PlayerDashboard";
import Timer from "./Timer";
import Leaderboard from "./Leaderboard";

export default function GameScreen({ game, team, teams, playerId }) {
  const [investment, setInvestment] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const player = team.players.find((p) => p.playerId === playerId);
  const demand = game.demandSequence[game.currentRound - 1];

  async function handleSubmit() {
    if (!player || submitted) return;
    await submitInvestment(game.gameId, team.teamId, playerId, investment);
    setSubmitted(true);
  }

  const allInvested = team.players.every((p) => p.invested);
  const isInvested = player?.invested || submitted;

  return (
    <div className="container">
      <div className="game-layout">
        {/* Header */}
        <div className="game-header">
          <div>
            <h2>Round {game.currentRound} / {game.totalRounds}</h2>
            <p>Team: {team.teamName}</p>
          </div>
          <Timer deadline={game.roundDeadline} />
        </div>

        {/* Player Dashboard */}
        <PlayerDashboard player={player} demand={demand} />

        {/* Investment Section */}
        <div className="investment-section">
          <h3>Invest Capital</h3>
          {isInvested ? (
            <div className="submitted-message">
              <span className="check-big">&#10003;</span>
              Investment submitted! Waiting for teammates...
            </div>
          ) : (
            <>
              <div className="slider-group">
                <input
                  type="range"
                  min={0}
                  max={player?.capital || 100}
                  value={investment}
                  onChange={(e) => setInvestment(parseInt(e.target.value))}
                />
                <div className="slider-labels">
                  <span>$0</span>
                  <span className="invest-amount">${investment}</span>
                  <span>${player?.capital || 100}</span>
                </div>
              </div>
              <button className="btn btn-primary full-width" onClick={handleSubmit}>
                Submit Investment (${investment})
              </button>
            </>
          )}
        </div>

        {/* Team Status */}
        <div className="team-status">
          <h3>Team Status</h3>
          <div className="team-members-grid">
            {team.players.map((p, i) => (
              <div
                key={i}
                className={`member-card ${p.invested ? "invested" : ""} ${
                  p.playerId === playerId ? "is-you" : ""
                }`}
              >
                <span className={`role-badge role-${p.role.toLowerCase()}`}>
                  {p.role}
                </span>
                <span className="member-name">{p.name}</span>
                <span className={`status-dot ${p.invested ? "done" : "waiting"}`}>
                  {p.invested ? "Done" : "..."}
                </span>
              </div>
            ))}
          </div>
          {allInvested && (
            <p className="all-done-message">
              All investments submitted! Waiting for admin to process round...
            </p>
          )}
        </div>

        {/* Mini Leaderboard */}
        <Leaderboard teams={teams} mini />
      </div>
    </div>
  );
}
