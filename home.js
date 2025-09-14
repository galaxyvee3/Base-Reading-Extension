(function () {
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
	const sound = new Audio("assets/Select.mp3");
	// track all animation intervals
	let intervalId = null;
	let entryIntervalId = null;
	function stopAnimations() {
		if (intervalId) {
			clearInterval(intervalId);
			intervalId = null;
		}
		if (entryIntervalId) {
			clearInterval(entryIntervalId);
			entryIntervalId = null;
		}
	}
	function stopAllSounds() {
		// pause and reset current sound if needed
		sound.pause();
		sound.currentTime = 0;
	}
	// open new page
	function openPage(page) {
		fetch(chrome.runtime.getURL(page))
			.then(response => response.text())
			.then(html => {
				document.open();
				document.write(html);
				document.close();
			});
	}
	function navigateTo(page) {
		stopAnimations();
		stopAllSounds();
		if (!isMuted) {
			sound.play();
			sound.onended = () => openPage(page);
		} else {
				openPage(page);
		}
	}
	// button handlers
	document.getElementById("back").addEventListener("click", () => navigateTo("index.html"));
	document.getElementById("stats").addEventListener("click", () => navigateTo("stats.html"));
	document.getElementById("timer15").addEventListener("click", () => {
		localStorage.setItem("selectedTime", 900);
		navigateTo("timer.html");
	});
	// animate idle + event background
	let baseCount = parseInt(localStorage.getItem("baseCount")) || 0;
	let index = 0;
	const animations = {
		0: {
			entry: ["url('assets/Home3.png')", "url('assets/Home4.png')", "url('assets/Home5.png')", "url('assets/Home6.png')", "url('assets/Home7.png')", "url('assets/Home8.png')", "url('assets/Home9.png')", "url('assets/Home10.png')", "url('assets/Home11.png')", "url('assets/Home12.png')", "url('assets/Home13.png')", "url('assets/Home14.png')"],
			idle: ["url('assets/Home1.png')", "url('assets/Home2.png')"]
		},
		1: {
			entry: ["url('assets/First3.png')", "url('assets/First4.png')", "url('assets/First5.png')", "url('assets/First6.png')", "url('assets/First7.png')", "url('assets/First8.png')", "url('assets/First9.png')", "url('assets/First10.png')", "url('assets/First11.png')", "url('assets/First12.png')"],
			idle: ["url('assets/First1.png')", "url('assets/First2.png')"]
		},
		2: {
			entry: ["url('assets/Second3.png')", "url('assets/Second4.png')", "url('assets/Second5.png')", "url('assets/Second6.png')", "url('assets/Second7.png')", "url('assets/Second8.png')", "url('assets/Second9.png')", "url('assets/Second10.png')", "url('assets/Second11.png')", "url('assets/Second12.png')"],
			idle: ["url('assets/Second1.png')", "url('assets/Second2.png')"]
		},
		3: {
			entry: ["url('assets/Third3.png')", "url('assets/Third4.png')", "url('assets/Third5.png')", "url('assets/Third6.png')", "url('assets/Third7.png')", "url('assets/Third8.png')", "url('assets/Third9.png')", "url('assets/Third10.png')", "url('assets/Third11.png')", "url('assets/Third12.png')"],
			idle: ["url('assets/Third1.png')", "url('assets/Third2.png')"]
		},
		4: {
			entry: [],
			idle: ["url('assets/Home1.png')", "url('assets/Home2.png')"]
		}
	};
	function updateStats() {
		let minutes = parseInt(localStorage.getItem("minutes")) || 0;
		let baseCount = parseInt(localStorage.getItem("baseCount")) || 0;
		let score = parseInt(localStorage.getItem("score")) || 0;
		document.getElementById("minutesDisplay").textContent = "Minutes: " + minutes;
		document.getElementById("basesDisplay").textContent = "Bases: " + baseCount;
		document.getElementById("scoreDisplay").textContent = "Runs: " + score;
	}
	updateStats();
	// preload all images to avoid white flashes
	function preloadImages(urls) {
		urls.forEach(url => {
			const img = new Image();
			img.src = url.replace(/url\(['"]?|['"]?\)/g, '');
		});
	}
	Object.values(animations).forEach(anim => {
		preloadImages(anim.entry);
		preloadImages(anim.idle);
	});
	const sounds = { 0: "assets/Score.mp3", 1: "assets/Base.mp3", 2: "assets/Base.mp3", 3: "assets/Base.mp3", 4: "assets/Home.mp3" };
	let state = (baseCount === 0) ? animations[4] : animations[baseCount % 4];
	function playAnimation() {
		stopAnimations(); // clear any running animations
		// --- Phase 1: Entry ---
		let frame = 0;
		if (state.entry.length > 0) {
			entryIntervalId = setInterval(() => {
				document.body.style.backgroundImage = state.entry[frame];
				frame++;
				if (frame >= state.entry.length) {
					clearInterval(entryIntervalId);
					entryIntervalId = null;
					// play sound after entry
					let soundFile = sounds[baseCount % 4];
					if (!isMuted) new Audio(soundFile).play();
					// --- Phase 2: Idle ---
					index = 0;
					intervalId = setInterval(() => {
						document.body.style.backgroundImage = state.idle[index];
						index = (index + 1) % state.idle.length;
					}, 500);
				}
			}, 250);
		} else {
			let soundFile = sounds[4];
			if (!isMuted) { new Audio(soundFile).play(); }
			// If no entry animation, start idle immediately
			index = 0;
			intervalId = setInterval(() => {
				document.body.style.backgroundImage = state.idle[index];
				index = (index + 1) % state.idle.length;
			}, 500);
		}
	}
	playAnimation();
})();