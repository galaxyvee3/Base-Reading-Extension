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
	// play sound
	const sound = new Audio("assets/Start.mp3");
	sound.currentTime = 0;
	if (!isMuted) sound.play();
	function resetStats() {
    const weekRange = localStorage.getItem("currentWeek") || getCurrentWeek();
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
	function getToday() {
		let today = new Date();
		let options = { year: 'numeric', month: 'short', day: 'numeric' };
		return today.toLocaleDateString(undefined, options);
	}
	function getDaysLeft() {
		let today = new Date();
		let day = today.getDay(); // 0 = Sunday, 6 = Saturday
		let daysLeft = 6 - day;   // how many days until Saturday
		if (daysLeft === 0) {
			resetStats();
			document.getElementById("daysLeftDisplay").textContent = "6 Days Left";
		} else if (daysLeft === 1) {
			document.getElementById("daysLeftDisplay").textContent = "Last Day";
		} else {
			document.getElementById("daysLeftDisplay").textContent = getDaysLeft() + " Days Left";
		}	
	}
	function getCurrentWeek() {
		let today = new Date();
		let day = today.getDay();
		if (day === 0) resetStats(); // automatically reset on Sunday
		// find Sunday (start of week)
		let sunday = new Date(today);
		sunday.setDate(today.getDate() - today.getDay());
		// find Saturday (end of week)
		let saturday = new Date(sunday);
		saturday.setDate(sunday.getDate() + 6);
		// formatter for shortened date strings
		let options = { year: "numeric", month: "short", day: "numeric" };
		let start = sunday.toLocaleDateString(undefined, options);
		let end = saturday.toLocaleDateString(undefined, options);
		return `${start} – ${end}`;
	}
	localStorage.setItem("currentWeek", getCurrentWeek());
	document.getElementById("todayDisplay").textContent = getToday();
	getDaysLeft();
	// animate image
	const img = document.getElementById('animated');
	const images = [ "assets/Bat1.png", "assets/Bat2.png"	]; // images to switch
	let index = 0;
	setInterval(() => {
		// switch to next image
		index = (index + 1) % images.length;
		img.src = images[index];
	}, 500); // switch image every 500ms
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
	document.getElementById("start").addEventListener("click", () => {
		const sound = new Audio("assets/Select.mp3");
		sound.currentTime = 0;
		if (!isMuted) {
			sound.play();
			sound.onended = () => openPage();
    } else {
			openPage();
    }
	});
})();