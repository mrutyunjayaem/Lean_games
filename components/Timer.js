import { useState, useEffect } from "react";

export default function Timer({ deadline }) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!deadline) return;

    function tick() {
      const remaining = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setSeconds(remaining);
    }

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [deadline]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isLow = seconds <= 15;

  return (
    <div className={`timer ${isLow ? "timer-low" : ""}`}>
      <span className="timer-icon">&#9202;</span>
      <span className="timer-value">
        {minutes}:{secs.toString().padStart(2, "0")}
      </span>
    </div>
  );
}
