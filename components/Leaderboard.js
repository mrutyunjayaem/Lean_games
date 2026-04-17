export default function Leaderboard({ teams, mini = false }) {
  const sorted = [...teams].sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));

  return (
    <div className={`leaderboard ${mini ? "mini" : ""}`}>
      <h3>Leaderboard</h3>
      <div className="leaderboard-list">
        {sorted.map((team, i) => (
          <div key={team.id} className={`lb-row ${i === 0 ? "first" : ""}`}>
            <span className="lb-rank">#{i + 1}</span>
            <span className="lb-name">{team.teamName}</span>
            <span className="lb-score">{team.totalScore || 0}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
