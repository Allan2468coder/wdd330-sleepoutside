const countdown = document.getElementById("countdown");
const durationInput = document.getElementById("duration");
const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");
const statusMessage = document.getElementById("status");
const progressTrack = document.querySelector(".progress-track");
const progress = document.getElementById("progress");

let remainingSeconds = Number(durationInput.value);
let totalDuration = remainingSeconds;
let endTime = 0;
let intervalId;
let timeoutId;
let state = "idle";

function updateDisplay(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secondsPart = seconds % 60;
  countdown.textContent = `${String(minutes).padStart(2, "0")}:${String(secondsPart).padStart(2, "0")}`;
  countdown.setAttribute(
    "aria-label",
    `${minutes} minutes and ${secondsPart} seconds remaining`,
  );
  progressTrack.setAttribute("aria-valuenow", String(seconds));
  progress.style.width = `${(seconds / totalDuration) * 100}%`;
}

function updateControls() {
  startButton.disabled = state === "running" || state === "paused";
  startButton.textContent = state === "finished" ? "Start again" : "Start";
  pauseButton.disabled = state !== "running" && state !== "paused";
  pauseButton.textContent = state === "paused" ? "Resume" : "Pause";
  durationInput.disabled = state === "running";
}

function finishCountdown() {
  clearInterval(intervalId);
  intervalId = undefined;
  timeoutId = undefined;
  remainingSeconds = 0;
  state = "finished";
  updateDisplay(remainingSeconds);
  statusMessage.textContent = "Time's up!";
  updateControls();
}

function startCountdown() {
  if (!durationInput.reportValidity()) return;

  if (state !== "paused") {
    totalDuration = Number(durationInput.value);
    remainingSeconds = totalDuration;
    progressTrack.setAttribute("aria-valuemax", String(totalDuration));
  }

  state = "running";
  statusMessage.textContent = "Countdown running";
  endTime = Date.now() + remainingSeconds * 1000;

  const updateRemainingTime = () => {
    remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    updateDisplay(remainingSeconds);
  };

  updateRemainingTime();
  intervalId = setInterval(updateRemainingTime, 1000);
  timeoutId = setTimeout(finishCountdown, remainingSeconds * 1000);
  updateControls();
}

function pauseCountdown() {
  if (state === "running") {
    remainingSeconds = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
    clearInterval(intervalId);
    clearTimeout(timeoutId);
    intervalId = undefined;
    timeoutId = undefined;
    state = "paused";
    updateDisplay(remainingSeconds);
    statusMessage.textContent = "Paused";
  } else if (state === "paused") {
    startCountdown();
    return;
  }

  updateControls();
}

function resetCountdown() {
  clearInterval(intervalId);
  clearTimeout(timeoutId);
  intervalId = undefined;
  timeoutId = undefined;
  state = "idle";
  totalDuration = Number(durationInput.value) || 10;
  remainingSeconds = totalDuration;
  progressTrack.setAttribute("aria-valuemax", String(totalDuration));
  updateDisplay(remainingSeconds);
  statusMessage.textContent = "Ready when you are";
  updateControls();
}

durationInput.addEventListener("input", () => {
  if (!durationInput.validity.valid) return;
  totalDuration = Number(durationInput.value);
  remainingSeconds = totalDuration;
  progressTrack.setAttribute("aria-valuemax", String(totalDuration));
  updateDisplay(remainingSeconds);
  statusMessage.textContent = "Ready when you are";
  state = "idle";
  updateControls();
});

startButton.addEventListener("click", startCountdown);
pauseButton.addEventListener("click", pauseCountdown);
resetButton.addEventListener("click", resetCountdown);
updateDisplay(remainingSeconds);
updateControls();
