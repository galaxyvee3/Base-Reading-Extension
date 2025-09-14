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
  // play initial done sound
  let sound = new Audio("assets/Done.m4a");
  sound.currentTime = 0;
	if (!isMuted) sound.play();
  // animate image
  const img = document.getElementById("animated");
  const images = [ "assets/Baseball1.png", "assets/Baseball3.png", "assets/Baseball4.png", "assets/Baseball5.png" ];
  let index = 0;
  setInterval(() => {
    index = (index + 1) % images.length;
    img.src = images[index];
  }, 250);
  // advance base and update localStorage
  function advanceBase() {
    let score = parseInt(localStorage.getItem("score")) || 0;
    let baseCount = parseInt(localStorage.getItem("baseCount")) || 0;
    let minutesRead = parseInt(localStorage.getItem("minutes")) || 0;
    baseCount++;
    minutesRead += 15;
    if (baseCount % 4 === 0) score++; // add run
    localStorage.setItem("score", score);
    localStorage.setItem("baseCount", baseCount);
    localStorage.setItem("minutes", minutesRead);
  }
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
  // close button behavior
  document.getElementById("close").addEventListener("click", () => {
    advanceBase();
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