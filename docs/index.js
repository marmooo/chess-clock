const noSleep=new NoSleep,tmpCanvas=document.createElement("canvas"),timeoverAudio=new Audio("mp3/warning1.mp3"),countdownAudio=new Audio("mp3/menu1.mp3"),alertAudio=new Audio("mp3/decision3.mp3"),alertSeconds=[1e3,2e3,3e3,4e3,5e3,6e3,7e3,8e3,9e3,1e4,3e4,6e4],nextAlerts=[6e4,6e4],timerIntervals=[0,0],startTimes=[0,0],remainingTimes=[0,0],countdowns=[!1,!1];let mute=!0;function stopTimer(){timeoverAudio.pause(),clearInterval(timerIntervals[0]),clearInterval(timerIntervals[1]),this.classList.add("d-none");const a=document.getElementById("restartButton");a.classList.remove("d-none"),document.getElementById("btn0").disabled?a.dataset.id=1:a.dataset.id=0}function restartTimer(){timeoverAudio.pause();const a=parseInt(this.dataset.id);this.classList.add("d-none"),document.getElementById("stopButton").classList.remove("d-none"),startTimes[a]=Date.now()+remainingTimes[a],timerIntervals[a]=setInterval(()=>{tick(a)},50)}function startTimer(){window.scroll(0,0),document.getElementById("stopButton").classList.remove("d-none"),document.getElementById("restartButton").classList.add("d-none");const b=parseInt(this.getAttribute("id").slice(-1));this.setAttribute("disabled","true");let a;if(b==0?(document.getElementById("btn1").removeAttribute("disabled"),a=1):(document.getElementById("btn0").removeAttribute("disabled"),a=0),clearInterval(timerIntervals[b]),countdowns[a]){const c=document.getElementById("timerHeader"+a),d=c.getElementsByTagName("input"),b=d[3].value||0;startTimes[a]=Date.now()+b*1e3;const e=(b-1)*1e3,f=alertSeconds.find(a=>e<a);nextAlerts[a]=f}else startTimes[a]=Date.now()+remainingTimes[a];timerIntervals[a]=setInterval(()=>{tick(a)},50)}function resetTimerBase(a){timerIntervals[a]&&clearInterval(timerIntervals[a]);const j=document.getElementById("timerHeader"+a),b=j.getElementsByTagName("input"),c=b[0].value||0,d=b[1].value||0,e=b[2].value||0,h=b[3].value||0,g=("00"+d).slice(-2),k=("00"+e).slice(-2),f=document.getElementById("btn"+a);if(c==0&&d==0&&e==0&&h!=0){countdowns[a]=!0;const b=("00"+h).slice(-2);f.textContent=c+":"+g+":"+b}else countdowns[a]=!1,f.textContent=c+":"+g+":"+k;const i=c*36e5+d*6e4+e*1e3;remainingTimes[a]=i,alertSeconds.forEach(b=>{b<i&&(nextAlerts[a]=b)}),resizeFontSize(f)}function resetTimer(a){a?resetTimerBase(a):(resetTimerBase(0),resetTimerBase(1))}function tick(a){const c=document.getElementById("btn"+a);let b=startTimes[a]-Date.now();if(remainingTimes[a]=b,b<0){const e=document.getElementById("timerHeader"+a),f=e.getElementsByTagName("input"),d=f[3].value||0;if(0<d)if(countdowns[a])b<-5e3?(timeoverAudio.pause(),clearInterval(timerIntervals[a])):mute||(timeoverAudio.loop=!0,timeoverAudio.play()),c.textContent="0:00:00";else{countdowns[a]=!0,b=d*1e3,remainingTimes[a]=b,startTimes[a]=Date.now()+b;const e=("00"+d).slice(-2);c.textContent="0:00:"+e,mute||countdownAudio.play();const f=alertSeconds.find(a=>a<b);nextAlerts[a]=f}else b<-5e3?(timeoverAudio.pause(),clearInterval(timerIntervals[a])):mute||(timeoverAudio.loop=!0,timeoverAudio.play()),c.textContent="0:00:00"}else{if(b<nextAlerts[a]){mute||alertAudio.play();const b=alertSeconds.indexOf(nextAlerts[a]);nextAlerts[a]=alertSeconds[b-1]}b+=1e3;const d=Math.floor(b/36e5),e=Math.floor(b%36e5/6e4),f=Math.floor(b%6e4/1e3),g=("00"+e).slice(-2),h=("00"+f).slice(-2);c.textContent=d+":"+g+":"+h}}function resizeFontSize(c){function n(b,c){const a=tmpCanvas.getContext("2d");a.font=c;const d=a.measureText(b);return d.width}function l(g,c,d,e){const b=g.split("\n"),f=c+"px "+d;let a=0;for(let c=0;c<b.length;c++){const d=n(b[c],f);a<d&&(a=d)}return[a,c*b.length*e]}function j(){const a=document.documentElement.clientWidth,b=document.documentElement.clientHeight;return a<b?[a,b*.4]:[a*.45,b]}function k(a){const b=parseFloat(a.paddingLeft)+parseFloat(a.paddingRight),c=parseFloat(a.paddingTop)+parseFloat(a.paddingBottom);return[b,c]}const a=getComputedStyle(c),m=a.fontFamily,b=parseFloat(a.fontSize),i=parseFloat(a.lineHeight)/b,d=j(),e=l(c.textContent,b,m,i),f=k(a),g=b*(d[0]-f[0])/e[0]*.9,h=b*(d[1]-f[1])/e[1]*.9;h<g?c.style.fontSize=h+"px":c.style.fontSize=g+"px"}function toggleBGM(){this.classList.contains("disabled")?(this.classList.remove("disabled"),timeoverAudio.loop=!1,timeoverAudio.play(),countdownAudio.play(),alertAudio.play(),mute=!1):(this.classList.add("disabled"),timeoverAudio.pause(),mute=!0)}noSleep.enable();const btn0=document.getElementById("btn0"),btn1=document.getElementById("btn1");resizeFontSize(btn0),resizeFontSize(btn1),window.addEventListener("resize",()=>{resizeFontSize(btn0),resizeFontSize(btn1)}),document.getElementById("toggleBGM").onclick=toggleBGM,document.getElementById("btn0").onclick=startTimer,document.getElementById("btn1").onclick=startTimer,document.getElementById("stopButton").onclick=stopTimer,document.getElementById("restartButton").onclick=restartTimer,document.getElementById("resetButton").onclick=()=>{resetTimer(0),resetTimer(1)},[...document.getElementById("timerHeader0").getElementsByTagName("input")].forEach(a=>{a.onchange=()=>{resetTimer(0)}}),[...document.getElementById("timerHeader1").getElementsByTagName("input")].forEach(a=>{a.onchange=()=>{resetTimer(1)}})