import nosleepJs from "https://cdn.jsdelivr.net/npm/nosleep.js@0.12.0/+esm";

const noSleep = new nosleepJs();
const tmpCanvas = document.createElement("canvas");
const timeoverAudio = new Audio("mp3/warning1.mp3");
const countdownAudio = new Audio("mp3/menu1.mp3");
const alertAudio = new Audio("mp3/decision3.mp3");
const alertSeconds = [
  1000,
  2000,
  3000,
  4000,
  5000,
  6000,
  7000,
  8000,
  9000,
  10000,
  30000,
  60000,
];
const nextAlerts = [60000, 60000];
const timerIntervals = [0, 0];
const startTimes = [0, 0];
const remainingTimes = [0, 0];
const countdowns = [false, false];
let mute = true;

function stopTimer(event) {
  timeoverAudio.pause();
  clearInterval(timerIntervals[0]);
  clearInterval(timerIntervals[1]);
  event.currentTarget.classList.add("d-none");
  const restartButton = document.getElementById("restartButton");
  restartButton.classList.remove("d-none");
  if (document.getElementById("btn0").disabled) {
    restartButton.dataset.id = 1;
  } else {
    restartButton.dataset.id = 0;
  }
}

function restartTimer(event) {
  const button = event.currentTarget;
  timeoverAudio.pause();
  const id = parseInt(button.dataset.id);
  button.classList.add("d-none");
  document.getElementById("stopButton").classList.remove("d-none");
  startTimes[id] = Date.now() + remainingTimes[id];
  timerIntervals[id] = setInterval(() => {
    tick(id);
  }, 50);
}

function startTimer(event) {
  const button = event.currentTarget;
  globalThis.scroll(0, 0);
  document.getElementById("stopButton").classList.remove("d-none");
  document.getElementById("restartButton").classList.add("d-none");
  const id = parseInt(button.getAttribute("id").slice(-1));
  button.setAttribute("disabled", "true");
  let altId;
  if (id == 0) {
    document.getElementById("btn1").removeAttribute("disabled");
    altId = 1;
  } else {
    document.getElementById("btn0").removeAttribute("disabled");
    altId = 0;
  }
  clearInterval(timerIntervals[id]);
  if (countdowns[altId]) {
    const header = document.getElementById(`timerHeader${altId}`);
    const inputs = header.getElementsByTagName("input");
    const countdown = inputs[3].value || 0;
    startTimes[altId] = Date.now() + countdown * 1000;
    const countSecond = (countdown - 1) * 1000;
    const alertSecond = alertSeconds.find((alertSecond) =>
      countSecond < alertSecond
    );
    nextAlerts[altId] = alertSecond;
  } else {
    startTimes[altId] = Date.now() + remainingTimes[altId];
  }
  timerIntervals[altId] = setInterval(() => {
    tick(altId);
  }, 50);
}

function resetTimerBase(id) {
  if (timerIntervals[id]) {
    clearInterval(timerIntervals[id]);
  }
  const header = document.getElementById(`timerHeader${id}`);
  const inputs = header.getElementsByTagName("input");
  const hour = inputs[0].value || 0;
  const min = inputs[1].value || 0;
  const sec = inputs[2].value || 0;
  const countdown = inputs[3].value || 0;
  const minStr = ("00" + min).slice(-2);
  const secStr = ("00" + sec).slice(-2);
  const btn = document.getElementById("btn" + id);
  if (hour == 0 && min == 0 && sec == 0 && countdown != 0) {
    countdowns[id] = true;
    const countdownStr = ("00" + countdown).slice(-2);
    btn.textContent = hour + ":" + minStr + ":" + countdownStr;
  } else {
    countdowns[id] = false;
    btn.textContent = hour + ":" + minStr + ":" + secStr;
  }
  const remainingTime = hour * 3600000 + min * 60000 + sec * 1000;
  remainingTimes[id] = remainingTime;
  alertSeconds.forEach((alertSecond) => {
    if (alertSecond < remainingTime) {
      nextAlerts[id] = alertSecond;
    }
  });
  resizeFontSize(btn);
}

function resetTimer(id) {
  if (id) {
    resetTimerBase(id);
  } else {
    resetTimerBase(0);
    resetTimerBase(1);
  }
}

function tick(id) {
  const btn = document.getElementById("btn" + id);
  let remainingTime = startTimes[id] - Date.now();
  remainingTimes[id] = remainingTime;
  if (remainingTime < 0) { // time over
    const header = document.getElementById(`timerHeader${id}`);
    const inputs = header.getElementsByTagName("input");
    const countdown = inputs[3].value || 0;
    if (0 < countdown) { // countdown mode
      if (!countdowns[id]) {
        countdowns[id] = true;
        remainingTime = countdown * 1000;
        remainingTimes[id] = remainingTime;
        startTimes[id] = Date.now() + remainingTime;
        const countdownStr = ("00" + countdown).slice(-2);
        btn.textContent = "0:00:" + countdownStr;
        if (!mute) {
          countdownAudio.play();
        }
        const alertSecond = alertSeconds.find((alertSecond) =>
          alertSecond < remainingTime
        );
        nextAlerts[id] = alertSecond;
      } else {
        if (remainingTime < -5000) { // 5sec over
          timeoverAudio.pause();
          clearInterval(timerIntervals[id]);
        } else {
          if (!mute) {
            timeoverAudio.loop = true;
            timeoverAudio.play();
          }
        }
        btn.textContent = "0:00:00"; // timeover
      }
    } else {
      if (remainingTime < -5000) { // 5sec over
        timeoverAudio.pause();
        clearInterval(timerIntervals[id]);
      } else {
        if (!mute) {
          timeoverAudio.loop = true;
          timeoverAudio.play();
        }
      }
      btn.textContent = "0:00:00"; // timeover
    }
  } else {
    if (remainingTime < nextAlerts[id]) {
      if (!mute) {
        alertAudio.play();
      }
      const idx = alertSeconds.indexOf(nextAlerts[id]);
      nextAlerts[id] = alertSeconds[idx - 1];
    }
    remainingTime += 1000; // 一般的な表示に合わせる
    const hour = Math.floor(remainingTime / 3600000);
    const min = Math.floor(remainingTime % 3600000 / 60000);
    const sec = Math.floor(remainingTime % 60000 / 1000);
    const minStr = ("00" + min).slice(-2);
    const secStr = ("00" + sec).slice(-2);
    btn.textContent = hour + ":" + minStr + ":" + secStr;
  }
}

function resizeFontSize(node) {
  // https://stackoverflow.com/questions/118241/
  function getTextWidth(text, font) {
    // re-use canvas object for better performance
    // const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
    const context = tmpCanvas.getContext("2d");
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  }
  function getTextRect(text, fontSize, font, lineHeight) {
    const lines = text.split("\n");
    const fontConfig = fontSize + "px " + font;
    let maxWidth = 0;
    for (let i = 0; i < lines.length; i++) {
      const width = getTextWidth(lines[i], fontConfig);
      if (maxWidth < width) {
        maxWidth = width;
      }
    }
    return [maxWidth, fontSize * lines.length * lineHeight];
  }
  function getNodeRect() {
    const width = document.documentElement.clientWidth;
    const height = document.documentElement.clientHeight;
    if (width < height) {
      return [width, height * 0.4];
    } else {
      return [width * 0.45, height];
    }
  }
  function getPaddingRect(style) {
    const width = parseFloat(style.paddingLeft) +
      parseFloat(style.paddingRight);
    const height = parseFloat(style.paddingTop) +
      parseFloat(style.paddingBottom);
    return [width, height];
  }
  const style = getComputedStyle(node);
  const font = style.fontFamily;
  const fontSize = parseFloat(style.fontSize);
  const lineHeight = parseFloat(style.lineHeight) / fontSize;
  const nodeRect = getNodeRect();
  const textRect = getTextRect(node.textContent, fontSize, font, lineHeight);
  const paddingRect = getPaddingRect(style);

  // https://stackoverflow.com/questions/46653569/
  // Safariで正確な算出ができないので誤差ぶんだけ縮小化 (10%)
  const rowFontSize = fontSize * (nodeRect[0] - paddingRect[0]) / textRect[0] *
    0.90;
  const colFontSize = fontSize * (nodeRect[1] - paddingRect[1]) / textRect[1] *
    0.90;
  if (colFontSize < rowFontSize) {
    node.style.fontSize = colFontSize + "px";
  } else {
    node.style.fontSize = rowFontSize + "px";
  }
}

function toggleBGM(event) {
  const button = event.currentTarget;
  if (button.classList.contains("disabled")) {
    button.classList.remove("disabled");
    timeoverAudio.loop = false;
    timeoverAudio.play();
    countdownAudio.play();
    alertAudio.play();
    mute = false;
  } else {
    button.classList.add("disabled");
    timeoverAudio.pause();
    mute = true;
  }
}

noSleep.enable();
const btn0 = document.getElementById("btn0");
const btn1 = document.getElementById("btn1");
resizeFontSize(btn0);
resizeFontSize(btn1);
globalThis.addEventListener("resize", () => {
  resizeFontSize(btn0);
  resizeFontSize(btn1);
});
document.getElementById("toggleBGM").onclick = toggleBGM;
document.getElementById("btn0").onclick = startTimer;
document.getElementById("btn1").onclick = startTimer;
document.getElementById("stopButton").onclick = stopTimer;
document.getElementById("restartButton").onclick = restartTimer;
document.getElementById("resetButton").onclick = () => {
  resetTimer(0);
  resetTimer(1);
};
for (let i = 0; i <= 1; i++) {
  const header = document.getElementById(`timerHeader${i}`);
  [...header.getElementsByTagName("input")].forEach((input) => {
    input.onchange = () => resetTimer(i);
  });
}
