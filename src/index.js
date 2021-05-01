const noSleep = new NoSleep();
const tmpCanvas = document.createElement('canvas');
const timeoverAudio = new Audio('mp3/warning1.mp3');
const countdownAudio = new Audio('mp3/menu1.mp3');
const alertAudio = new Audio('mp3/decision3.mp3');
const alertSeconds = [1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000, 30000, 60000];
let nextAlerts = [60000, 60000];
let timerIntervals = [0, 0];
let startTimes = [0, 0];
let remainingTimes = [0, 0];
let countdowns = [false, false];
let mute = true;

function stopTimer(obj) {
  timeoverAudio.pause();
  clearInterval(timerIntervals[0]);
  clearInterval(timerIntervals[1]);
  obj.classList.add('d-none');
  var restartButton = document.getElementById('restartButton');
  restartButton.classList.remove('d-none');
}

function restartTimer(obj) {
  timeoverAudio.pause();
  var id = parseInt(obj.dataset.id);
  obj.classList.add('d-none');
  document.getElementById('stopButton').classList.remove('d-none');
  startTimes[id] = Date.now() + remainingTimes[id];
  timerIntervals[id] = setInterval(function() {
    tick(id);
  }, 50);
}

function startTimer(obj) {
  var id = parseInt(obj.getAttribute('id').slice(-1));
  obj.setAttribute('disabled', 'true');
  var altId;
  if (id == 0) {
    document.getElementById('btn1').removeAttribute('disabled');
    altId = 1;
  } else {
    document.getElementById('btn0').removeAttribute('disabled');
    altId = 0;
  }
  clearInterval(timerIntervals[id]);
  if (countdowns[altId]) {
    var header = document.getElementById('timerHeader' + id);
    var inputs = header.getElementsByTagName('input');
    var countdown = inputs[3].value || 0;
    startTimes[altId] = Date.now() + countdown * 1000;
    var countSecond = (countdown - 1) * 1000;
    var alertSecond = alertSeconds.find(alertSecond => countSecond < alertSecond);
    nextAlerts[altId] = alertSecond;
  } else {
    startTimes[altId] = Date.now() + remainingTimes[altId];
  }
  timerIntervals[altId] = setInterval(function() {
    tick(altId);
  }, 50);
}

function resetTimerBase(id) {
  if (timerIntervals[id]) {
    clearInterval(timerIntervals[id]);
  }
  var header = document.getElementById('timerHeader' + id);
  var inputs = header.getElementsByTagName('input');
  var hour = inputs[0].value || 0;
  var min = inputs[1].value || 0;
  var sec = inputs[2].value || 0;
  var countdown = inputs[3].value || 0;
  var minStr = ('00' + min).slice(-2);
  var secStr = ('00' + sec).slice(-2);
  var btn = document.getElementById('btn' + id);
  if (hour == 0 && min == 0 && sec == 0 && countdown != 0) {
    countdowns[id] = true;
    var countdownStr = ('00' + countdown).slice(-2);
    btn.innerText = hour + ':' + minStr + ':' + countdownStr;
  } else {
    countdowns[id] = false;
    btn.innerText = hour + ':' + minStr + ':' + secStr;
  }
  var remainingTime = hour * 3600000 + min * 60000 + sec * 1000;
  remainingTimes[id] = remainingTime;
  alertSeconds.forEach(alertSecond => {
    if (alertSecond < remainingTime) {
      nextAlerts[id] = alertSecond;
    }
  });
  resizeFontSize(btn);
}

function resetTimer(obj) {
  timeoverAudio.pause();
  resetTimerBase(0);
  resetTimerBase(1);
}

function tick(id) {
  var btn = document.getElementById('btn' + id);
  var remainingTime = startTimes[id] - Date.now();
  remainingTimes[id] = remainingTime;
  if (remainingTime < 0) {  // time over
    var header = document.getElementById('timerHeader' + id);
    var inputs = header.getElementsByTagName('input');
    var countdown = inputs[3].value || 0;
    if (0 < countdown) {  // countdown mode
      if (!countdowns[id]) {
        countdowns[id] = true;
        remainingTime = countdown * 1000;
        remainingTimes[id] = remainingTime;
        startTimes[id] = Date.now() + remainingTime;
        var countdownStr = ('00' + countdown).slice(-2);
        btn.innerText = '0:00:' + countdownStr;
        if (!mute) {
          countdownAudio.play();
        }
        var alertSecond = alertSeconds.find(alertSecond => alertSecond < remainingTime);
        nextAlerts[id] = alertSecond;
      } else {
        if (remainingTime < -5000) {  // 5sec over
          timeoverAudio.pause();
          clearInterval(timerIntervals[id]);
        } else {
          if (!mute) {
            timeoverAudio.loop = true;
            timeoverAudio.play();
          }
        }
        btn.innerText = '0:00:00';  // timeover
      }
    } else {
      if (remainingTime < -5000) {  // 5sec over
        timeoverAudio.pause();
        clearInterval(timerIntervals[id]);
      } else {
        if (!mute) {
          timeoverAudio.loop = true;
          timeoverAudio.play();
        }
      }
      btn.innerText = '0:00:00';  // timeover
    }
  } else {
    if (remainingTime < nextAlerts[id]) {
      if (!mute) {
        alertAudio.play();
      }
      var idx = alertSeconds.indexOf(nextAlerts[id]);
      nextAlerts[id] = alertSeconds[idx-1];
    }
    remainingTime += 1000;  // 一般的な表示に合わせる
    var hour = Math.floor(remainingTime / 3600000);
    var min = Math.floor(remainingTime % 3600000 / 60000);
    var sec = Math.floor(remainingTime % 60000 / 1000);
    var minStr = ('00' + min).slice(-2);
    var secStr = ('00' + sec).slice(-2);
    btn.innerText = hour + ':' + minStr + ':' + secStr;
  }
}
function resizeFontSize(node) {
  // https://stackoverflow.com/questions/118241/
  function getTextWidth(text, font) {
      // re-use canvas object for better performance
      // var canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement("canvas"));
      var context = tmpCanvas.getContext("2d");
      context.font = font;
      var metrics = context.measureText(text);
      return metrics.width;
  }
  function getTextRect(text, fontSize, font, lineHeight) {
    var lines = text.split('\n');
    var maxWidth = 0;
    var fontConfig = fontSize + 'px ' + font;
    for (var i=0; i<lines.length; i++) {
      var width = getTextWidth(lines[i], fontConfig);
      if (maxWidth < width) {
        maxWidth = width;
      }
    }
    return [maxWidth, fontSize * lines.length * lineHeight];
  }
  function getNodeRect() {
    var width = document.documentElement.clientWidth;
    var height = document.documentElement.clientHeight;
    if (width < height) {
      return [width, height * 0.4];
    } else {
      return [width * 0.45, height];
    }
  }
  function getPaddingRect(style) {
    var width = parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
    var height = parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);
    return [width, height];
  }
  var style = getComputedStyle(node);
  var font = style.fontFamily;
  var fontSize = parseFloat(style.fontSize);
  var lineHeight = parseFloat(style.lineHeight) / fontSize;
  var nodeRect = getNodeRect();
  var textRect = getTextRect(node.innerText, fontSize, font, lineHeight);
  var paddingRect = getPaddingRect(style);

  // https://stackoverflow.com/questions/46653569/
  // Safariで正確な算出ができないので誤差ぶんだけ縮小化 (10%)
  var rowFontSize = fontSize * (nodeRect[0] - paddingRect[0]) / textRect[0] * 0.90;
  var colFontSize = fontSize * (nodeRect[1] - paddingRect[1]) / textRect[1] * 0.90;
  if (colFontSize < rowFontSize) {
    node.style.fontSize = colFontSize + 'px';
  } else {
    node.style.fontSize = rowFontSize + 'px';
  }
}
function toggleBGM() {
  var button = document.getElementById('bgmButton');
  if (button.classList.contains('disabled')) {
    button.classList.remove('disabled');
    timeoverAudio.loop = false;
    timeoverAudio.play();
    countdownAudio.play();
    alertAudio.play();
    mute = false;
  } else {
    button.classList.add('disabled');
    timeoverAudio.pause();
    mute = true;
  }
}
noSleep.enable();
var btn0 = document.getElementById('btn0');
var btn1 = document.getElementById('btn1');
resizeFontSize(btn0);
resizeFontSize(btn1);
window.addEventListener('resize', function() {
  resizeFontSize(btn0);
  resizeFontSize(btn1);
});
