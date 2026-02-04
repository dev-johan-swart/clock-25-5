import { useState, useEffect, useRef } from "react";
import "./index.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);
  const beepRef = useRef(null);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  const handleBreakChange = (amount) => {
    if (isRunning) return;
    const newLength = breakLength + amount;
    if (newLength >= 1 && newLength <= 60) setBreakLength(newLength);
  };

  const handleSessionChange = (amount) => {
    if (isRunning) return;
    const newLength = sessionLength + amount;
    if (newLength >= 1 && newLength <= 60) {
      setSessionLength(newLength);
      setTimeLeft(newLength * 60);
    }
  };

  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimerLabel("Session");
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  useEffect(() => {
    if (!isRunning) return;

    const timeout = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft((prev) => prev - 1);
      } else {
        beepRef.current.play();

        if (timerLabel === "Session") {
          setTimerLabel("Break");
          setTimeLeft(breakLength * 60);
        } else {
          setTimerLabel("Session");
          setTimeLeft(sessionLength * 60);
        }
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [isRunning, timeLeft, timerLabel, breakLength, sessionLength]);

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>

      <div className="length-controls">
        <div>
          <h2 id="break-label">Break Length</h2>
          <button onClick={() => handleBreakChange(-1)}>-</button>
          <span id="break-length">{breakLength}</span>
          <button onClick={() => handleBreakChange(1)}>+</button>
        </div>

        <div>
          <h2 id="session-label">Session Length</h2>
          <button onClick={() => handleSessionChange(-1)}>-</button>
          <span id="session-length">{sessionLength}</span>
          <button onClick={() => handleSessionChange(1)}>+</button>
        </div>
      </div>

      <div className="timer">
        <h2 id="timer-label">{timerLabel}</h2>
        <div id="time-left">{formatTime(timeLeft)}</div>
      </div>

      <div className="controls">
        <button id="start_stop" onClick={handleStartStop}>
          {isRunning ? "Pause" : "Start"}
        </button>
        <button id="reset" onClick={handleReset}>
          Reset
        </button>
      </div>

      <audio
        id="beep"
        ref={beepRef}
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      />

      <div className="footer">
        <div>Designed and created by</div>
        <em>Dev Johan Swart</em>
      </div>
    </div>
  );
}

export default App;
