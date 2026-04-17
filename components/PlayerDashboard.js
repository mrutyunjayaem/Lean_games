import { getCapacity, getSalesEfficiency, getUpgradeCost, MAX_LEVEL } from "../lib/gameEngine";

export default function PlayerDashboard({ player, demand }) {
  if (!player) return null;

  const isSales = player.role === "Sales";
  const capacity = isSales ? null : getCapacity(player.level);
  const efficiency = isSales ? getSalesEfficiency(player.level) : null;
  const upgradeCost = getUpgradeCost(player.level);
  const canUpgrade = player.level < MAX_LEVEL;

  return (
    <div className="player-dashboard">
      <div className="dashboard-header">
        <span className={`role-badge role-${player.role.toLowerCase()}`}>
          {player.role}
        </span>
        <span className="player-name">{player.name}</span>
      </div>

      <div className="stats-grid">
        <div className="stat-item">
          <div className="stat-label">Level</div>
          <div className="stat-value">{player.level} / {MAX_LEVEL}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">{isSales ? "Efficiency" : "Capacity"}</div>
          <div className="stat-value">
            {isSales ? `${(efficiency * 100).toFixed(0)}%` : capacity}
          </div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Capital</div>
          <div className="stat-value">${player.capital}</div>
        </div>
        <div className="stat-item">
          <div className="stat-label">Demand</div>
          <div className="stat-value">{demand}</div>
        </div>
      </div>

      {canUpgrade && (
        <div className="upgrade-info">
          Next upgrade costs: <strong>${upgradeCost}</strong>
        </div>
      )}
      {!canUpgrade && (
        <div className="upgrade-info max-level">MAX LEVEL</div>
      )}
    </div>
  );
}
