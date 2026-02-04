import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [timerLabel, setTimerLabel] = useState("Session");
  const [isRunning, setIsRunning] = useState(false);
  const beepRef = useRef(null);

  // Format seconds -> mm:ss
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // ----- Length handlers -----
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

  // ----- Start/Stop -----
  const handleStartStop = () => {
    setIsRunning((prev) => !prev);
  };

  // ----- Reset -----
  const handleReset = () => {
    setIsRunning(false);
    setTimerLabel("Session");
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    beepRef.current.pause();
    beepRef.current.currentTime = 0;
  };

  // ----- Countdown logic using setTimeout -----
  useEffect(() => {
    let timeout = null;
    if (isRunning && timeLeft > 0) {
      timeout = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (isRunning && timeLeft === 0) {
      // Play beep when time reaches 0
      beepRef.current.play();

      if (timerLabel === "Session") {
        setTimerLabel("Break");
        setTimeLeft(breakLength * 60);
      } else {
        setTimerLabel("Session");
        setTimeLeft(sessionLength * 60);
      }
    }
    return () => clearTimeout(timeout);
  }, [isRunning, timeLeft, timerLabel, breakLength, sessionLength]);

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>

      <div className="length-controls">
        <div className="break-control">
          <h2 id="break-label">Break Length</h2>
          <button id="break-decrement" onClick={() => handleBreakChange(-1)}>
            -
          </button>
          <span id="break-length">{breakLength}</span>
          <button id="break-increment" onClick={() => handleBreakChange(1)}>
            +
          </button>
        </div>

        <div className="session-control">
          <h2 id="session-label">Session Length</h2>
          <button id="session-decrement" onClick={() => handleSessionChange(-1)}>
            -
          </button>
          <span id="session-length">{sessionLength}</span>
          <button id="session-increment" onClick={() => handleSessionChange(1)}>
            +
          </button>
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
        preload="auto"
        src="https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg"
      ></audio>

      {/* Footer text that fades in */}
      <div className="footer">
        <div>Designed and created by</div>
        <em>Dev Johan Swart</em>
      </div>
    </div>
  );
}

export default App;
