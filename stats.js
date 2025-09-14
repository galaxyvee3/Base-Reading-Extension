(function() {
	let isMuted = localStorage.getItem("muted") === "true";
	const muteBtn = document.getElementById("mute");
	function updateMuteBtn() {
    muteBtn.textContent = "♪";
		muteBtn.style.textDecoration = isMuted ? "line-through" : "none";
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
  // navigation buttons
  document.getElementById("back").addEventListener("click", () => {
    const sound = new Audio("assets/Select.mp3");
		sound.currentTime = 0;
		if (!isMuted) {
			sound.play();
			sound.onended = () => openPage();
    } else {
			openPage();
    }
  });
  document.getElementById("reset").addEventListener("click", () => {
    const sound = new Audio("assets/Reset.mp3");
		sound.currentTime = 0;
		if (!isMuted) sound.play();
    resetStats();
  });
  document.getElementById("erase").addEventListener("click", () => {
    const sound = new Audio("assets/Erase.m4a");
		sound.currentTime = 0;
		if (!isMuted) sound.play();
    eraseStats();
  });
  // update stats display
  function updateStats() {
    const weekRange = localStorage.getItem("currentWeek") || "N/A";
    const score = parseInt(localStorage.getItem("score")) || 0;
    const baseCount = parseInt(localStorage.getItem("baseCount")) || 0;
    const minutesRead = parseInt(localStorage.getItem("minutes")) || 0;
    const mostRuns = parseInt(localStorage.getItem("mostRuns")) || 0;
    const mostBases = parseInt(localStorage.getItem("mostBases")) || 0;
    const mostMinutes = parseInt(localStorage.getItem("mostMinutes")) || 0;
    const bestWeek = localStorage.getItem("bestWeek") || "N/A";
    document.getElementById("currentWeekDisplay").textContent = "Week: " + weekRange;
    document.getElementById("minutesDisplay").textContent = "Minutes: " + minutesRead;
    document.getElementById("baseDisplay").textContent = "Bases: " + baseCount;
    document.getElementById("scoreDisplay").textContent = "Runs: " + score;
    document.getElementById("mostMinutesDisplay").textContent = "Minutes: " + mostMinutes;
    document.getElementById("mostBasesDisplay").textContent = "Bases: " + mostBases;
    document.getElementById("mostRunsDisplay").textContent = "Runs: " + mostRuns;
    document.getElementById("bestWeekDisplay").textContent = "Best: " + bestWeek;
  }
  function resetStats() {
    const weekRange = localStorage.getItem("currentWeek") || "N/A";
    const minutesRead = parseInt(localStorage.getItem("minutes")) || 0;
    const mostMinutes = parseInt(localStorage.getItem("mostMinutes")) || 0;
    const score = parseInt(localStorage.getItem("score")) || 0;
    const baseCount = parseInt(localStorage.getItem("baseCount")) || 0;
    if (minutesRead > mostMinutes) {
      localStorage.setItem("mostMinutes", minutesRead);
      localStorage.setItem("mostBases", baseCount);
      localStorage.setItem("mostRuns", score);
      localStorage.setItem("bestWeek", weekRange);
    }
    localStorage.setItem("score", 0);
    localStorage.setItem("baseCount", 0);
    localStorage.setItem("minutes", 0);
    updateStats();
  }
  function eraseStats() {
    localStorage.setItem("mostRuns", 0);
    localStorage.setItem("mostBases", 0);
    localStorage.setItem("mostMinutes", 0);
    localStorage.setItem("bestWeek", null);
    updateStats();
  }
  updateStats();
})();