(function() {
	let isMuted = localStorage.getItem("muted") === "true";
	const muteBtn = document.getElementById("mute");
	function updateMuteBtn() {
		muteBtn.textContent = "♪";
		if (isMuted) {
			muteBtn.style.textDecoration = "line-through"; // strikethrough effect
		} else {
			muteBtn.style.textDecoration = "none";
		}
	}
	function toggleMute() {
		isMuted = !isMuted;
		localStorage.setItem("muted", isMuted);
		updateMuteBtn();
	}
	// initialize button on load
	updateMuteBtn();
	muteBtn.addEventListener("click", toggleMute);
  // open new page
	function openPage() {
    fetch(chrome.runtime.getURL("home.html"))
			.then(response => response.text())
			.then(html => {
				document.open();
				document.write(html);
				document.close();
			});
	}
  const pauseBtn = document.getElementById("pause");
  pauseBtn.addEventListener("click", () => {
    isPaused = !isPaused;
    pauseBtn.textContent = isPaused ? "Resume" : "Pause";
    const sound = new Audio("assets/Select.mp3");
    sound.currentTime = 0;
		if (!isMuted) sound.play();
  });
  document.getElementById("end").addEventListener("click", () => {
    const sound = new Audio("assets/Select.mp3");
		sound.currentTime = 0;
    if (!isMuted) {
			sound.play();
			sound.onended = () => openPage();
    } else {
			openPage();
    }
  });
  const timerDisplay = document.getElementById("timer");
  let timeLeft = parseInt(localStorage.getItem("selectedTime")) || 10; // default 10 seconds
  let timerInterval;
  let isPaused = false;
  // update timer display
  function updateTimer() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const displayMinutes = minutes < 10 ? "0" + minutes : minutes;
    const displaySeconds = seconds < 10 ? "0" + seconds : seconds;
    timerDisplay.textContent = `${displayMinutes}:${displaySeconds}`;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      // load done.html in the popup
      fetch(chrome.runtime.getURL("done.html"))
        .then(r => r.text())
        .then(html => {
          document.open();
          document.write(html);
          document.close();
        });
    } else if (!isPaused) {
      timeLeft--;
    }
  }
  // start timer
  timerInterval = setInterval(updateTimer, 1000);
  updateTimer();
  // animate image
  const img = document.getElementById("animated");
  const images = ["assets/Baseball1.png", "assets/Baseball2.png"];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % images.length;
    img.src = images[index];
  }, 500);
})();