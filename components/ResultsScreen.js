export default function ResultsScreen({ result, round }) {
  if (!result) return null;

  const {
    demand,
    capacities,
    salesEfficiency,
    unitsProduced,
    unitsSold,
    excessUnits,
    unmetDemand,
    roundScore,
    imbalanced,
    bottleneck,
    playerStates,
  } = result;

  return (
    <div className="results-screen">
      <h2>Round {round} Results</h2>

      {/* Supply Chain Visual */}
      <div className="supply-chain-visual">
        {playerStates?.map((p, i) => (
          <div
            key={i}
            className={`chain-node ${
              p.role === bottleneck ? "bottleneck" : ""
            }`}
          >
            <div className={`role-badge role-${p.role.toLowerCase()}`}>
              {p.role}
            </div>
            <div className="chain-player">{p.name}</div>
            <div className="chain-level">Lv.{p.level}</div>
            {p.role !== "Sales" && capacities?.[p.role] && (
              <div className="chain-cap">Cap: {capacities[p.role]}</div>
            )}
            {p.role === "Sales" && (
              <div className="chain-cap">Eff: {(salesEfficiency * 100).toFixed(0)}%</div>
            )}
            {p.role === bottleneck && (
              <div className="bottleneck-tag">BOTTLENECK</div>
            )}
          </div>
        ))}
      </div>

      {imbalanced && (
        <div className="warning-banner">
          Imbalance penalty applied! (10% production loss)
        </div>
      )}

      {/* Metrics */}
      <div className="results-grid">
        <div className="result-item">
          <div className="result-label">Demand</div>
          <div className="result-value">{demand}</div>
        </div>
        <div className="result-item">
          <div className="result-label">Produced</div>
          <div className="result-value">{unitsProduced}</div>
        </div>
        <div className="result-item">
          <div className="result-label">Sold</div>
          <div className="result-value good">{unitsSold}</div>
        </div>
        <div className="result-item">
          <div className="result-label">Excess</div>
          <div className={`result-value ${excessUnits > 0 ? "bad" : ""}`}>
            {excessUnits}
          </div>
        </div>
        <div className="result-item">
          <div className="result-label">Unmet Demand</div>
          <div className={`result-value ${unmetDemand > 0 ? "bad" : ""}`}>
            {unmetDemand}
          </div>
        </div>
        <div className="result-item score">
          <div className="result-label">Round Score</div>
          <div className={`result-value ${roundScore >= 0 ? "good" : "bad"}`}>
            {roundScore >= 0 ? "+" : ""}{roundScore}
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="score-breakdown">
        <h4>Score Breakdown</h4>
        <div className="breakdown-row">
          <span>Units Sold ({unitsSold} x 1)</span>
          <span className="good">+{unitsSold}</span>
        </div>
        <div className="breakdown-row">
          <span>Unmet Demand ({unmetDemand} x 2)</span>
          <span className="bad">-{unmetDemand * 2}</span>
        </div>
        <div className="breakdown-row">
          <span>Excess Units ({excessUnits} x 1)</span>
          <span className="bad">-{excessUnits}</span>
        </div>
        <div className="breakdown-row total">
          <span>Total</span>
          <span>{roundScore >= 0 ? "+" : ""}{roundScore}</span>
        </div>
      </div>
    </div>
  );
}
