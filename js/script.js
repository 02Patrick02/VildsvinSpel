// Globala konstanter och variabler
var boardElem;			// Referens till div-element för "spelplanen"
const carImgs = ["car_up.png","car_right.png","car_down.png","car_left.png"];
						// Array med filnamn för bilderna med bilen
var carDir = 1;			// Riktning för bilen, index till carImgs
var carElem;			// Referens till img-element för bilen
const xStep = 5;		// Antal pixlar som bilen ska förflytta sig i x-led
const yStep = 5;		// eller y-led i varje steg
const timerStep = 20;	// Tid i ms mellan varje steg i förflyttningen
var timerRef = null;	// Referens till timern för bilens förflyttning
var startBtn;			// Referens till startknappen
var stopBtn;			// Referens till stoppknappen
/* === Tillägg i uppgiften === */
var pigElem; // Referens till grisen
var pigHit = true;
var pigRef = null; // En timer för hur snabbt grisen ska dyka upp
const pigTimer = 2000; // Hur snabbt grisen ska visas
var hitCounterElem; // Visar hur många grisar som har träffats 
var hitCounter; // Räknare för hur många grisar som träffats
var pigCounterElem; // Visar hur många grisar har lagts till
var pigCounter; //räknare för hur många grisar som visas

// ------------------------------
// Initiera globala variabler och koppla funktion till knapp
function init() {
	// Referenser till element i gränssnittet
		boardElem = document.getElementById("board");
		carElem = document.getElementById("car");
		startBtn = document.getElementById("startBtn");
		stopBtn = document.getElementById("stopBtn");
	// Lägg på händelsehanterare
		document.addEventListener("keydown",checkKey);
			// Känna av om användaren trycker på tangenter för att styra bilen
		startBtn.addEventListener("click",startGame);
		stopBtn.addEventListener("click",stopGame);
	// Aktivera/inaktivera knappar
		startBtn.disabled = false;
		stopBtn.disabled = true;
	/* === Tillägg i uppgiften === */
		pigElem = document.getElementById("pig"); // Referens till grisen
		pigCounterElem = document.getElementById("pigNr"); // Referens till räknare av gris
		hitCounterElem = document.getElementById("hitCounter"); // Referens till räknare av träffad gris

} // End init
window.addEventListener("load",init);
// ------------------------------
// Kontrollera tangenter och styr bilen
function checkKey(e) {
	let k = e.keyCode;
	switch (k) {
		case 37: // Pil vänster
		case 90: // Z
			carDir--; // Bilens riktning 90 grader åt vänster
			if (carDir < 0) carDir = 3;
			carElem.src = "img/" + carImgs[carDir];
			break;
		case 39:  // Pil höger
		case 189: // -
			carDir++; // Bilens riktning 90 grader åt höger
			if (carDir > 3) carDir = 0;
			carElem.src = "img/" + carImgs[carDir];
			break;
	}
} // End checkKey
// ------------------------------
// Initiera spelet och starta bilens rörelse
function startGame() {
	startBtn.disabled = true;
	stopBtn.disabled = false;
	carElem.style.left = "0px";
	carElem.style.top = "0px";
	carDir = 1;
	carElem.src = "img/" + carImgs[carDir];
	moveCar();
	/* === Tillägg i uppgiften === */
	pigCounter = 0;
	pigCounterElem.innerHTML = pigCounter;
	hitCounter = 0;
	hitCounterElem.innerHTML = hitCounter;
	pigRef = setTimeout(randomPigSpawn, pigTimer);
	pigHit = false;
} // End startGame
// ------------------------------
// Stoppa spelet
function stopGame() {
	if (timerRef != null) clearTimeout(timerRef);
	startBtn.disabled = false;
	stopBtn.disabled = true;
	/* === Tillägg i uppgiften === */
	if(pigRef != null) {
		clearTimeout(pigRef);
		pigElem.style.visibility = "hidden";
	}

} // End stopGame
// ------------------------------
// Flytta bilen ett steg framåt i bilens riktning
function moveCar() {
	let xLimit = boardElem.offsetWidth - carElem.offsetWidth;
	let yLimit = boardElem.offsetHeight - carElem.offsetHeight;
	let x = parseInt(carElem.style.left);	// x-koordinat (left) för bilen
	let y = parseInt(carElem.style.top);	// y-koordinat (top) för bilen
	switch (carDir) {
		case 0: // Uppåt
			y -= yStep;
			if (y < 0) y = 0;
			break;
		case 1: // Höger
			x += xStep;
			if (x > xLimit) x = xLimit;
			break;
		case 2: // Nedåt
			y += yStep;
			if (y > yLimit) y = yLimit;
			break;
		case 3: // Vänster
			x -= xStep;
			if (x < 0) x = 0;
			break;
	}
	carElem.style.left = x + "px";
	carElem.style.top = y + "px";
	timerRef = setTimeout(moveCar,timerStep);
	/* === Tillägg i uppgiften === */
	collision();
} // End moveCar
// ------------------------------

/* === Tillägg av nya funktioner i uppgiften === */
function randomPigSpawn(){
	let xLimit = boardElem.offsetWidth;
	let yLimit = boardElem.offsetHeight;
	
	if(pigCounter < 10){
		pigCounter++;
		pigCounterElem.innerHTML = pigCounter;
		pigHit = false;

		let x =  Math.max(xLimit * Math.random() - pigElem.offsetWidth, 0);
		let y =  Math.max(yLimit * Math.random() - pigElem.offsetHeight, 0);

		pigElem.style.top = y + "px";
		pigElem.style.left = x + "px";

		pigElem.src = "img/pig.png";
		pigElem.style.visibility = "visible";
		pigRef = setTimeout(randomPigSpawn, pigTimer);
	}
	else{
		stopGame();
	}

}

function collision(){
	if(pigHit) return;

	let carLeft = parseInt(carElem.style.left);
	let carRight = carLeft + carElem.offsetWidth;
	let carTop = parseInt(carElem.style.top);
	let carBot = carTop + carElem.offsetHeight;
	
	let pigLeft = parseInt(pigElem.style.left);
	let pigRight = pigLeft + pigElem.offsetWidth;
	let pigTop = parseInt(pigElem.style.top);
	let pigBot = pigTop + pigElem.offsetHeight;

	if(carLeft < pigRight && carRight > pigLeft && carTop < pigBot && carBot > pigTop){
		hitCounter++;
		hitCounterElem.innerHTML = hitCounter;
		pigHit = true;
		clearTimeout(pigRef);
		pigElem.src = "img/smack.png";
		pigRef = setTimeout(randomPigSpawn, pigTimer);
	}
}