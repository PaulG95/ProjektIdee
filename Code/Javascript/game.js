var version = '0.0.1'
var is_playing = false; //Diese Variable ist dafür zuständig den Spielzustand zu überprüfen

init();
function init() {
	
	background_canvas = document.getElementById('background_canvas'); 
	background_ctx = background_canvas.getContext('2d');				
	main_canvas = document.getElementById('main_canvas');
	main_ctx = main_canvas.getContext('2d');
	
	//Animationsruckler für Browser beheben
	
	requestaframe = (function() {
		return window.requestAnimationFrame		||
			window.webkitRequestAnimationFrame	||
			window.mozRequestAnimationFrame		||
			window.oRequestAnimationFrame		||
			window.msRequestAnimationFrame		||
			function (callback) {
				window.setTimeout(callback, 1000 / 60)
			};
	})();
	
	document.addEventListener("keydown", key_down, false);
	document.addEventListener("keyup", key_up, false);
	
	stoepsel = new Stoepsel();
	
	load_media();
}

//In dieser Funktion werden alle medialen Dateien geladen die wir
// für unser Spiel brauchen. Von Bildern, bis hin zu Audio oder 
// Videodateien. 

function load_media() {
	hafenstadt = new Image();
	hafenstadt.src = '../Images/Hafenstadt.png';
	stoepsel_image = new Image();
	stoepsel_image.src = '../Images/Actor1.png';
}

function mouse(e){
		var x = e.pageX - document.getElementById('game_object').offsetLeft;
		var y = e.pageY - document.getElementById('game_object').offsetTop;
		document.getElementById('x').innerHTML = x;
		document.getElementById('y').innerHTML = y;
}

// Diese Funktion beschreibt den Zwerg, eine der Spielfiguren. In ihr
// Werden alle Variablen generiert, die der Charakter benötigt.

function Stoepsel() {
	// drawX und drawY beschreiben die Koordinaten auf dem Canvas
	// auf dem sich Stoepsel befindet
	
	this.drawX = 0;
	this.drawY = 0;
	
	// srcX und srcY beschreiben wo in der Quelldatei angefangen wird
	// Daten auf das Canvas zu übertragen
	
	this.srcX = 32;
	this.srcY = 0;
	
	// width und height beschreiben, wie hoch und breit von srcX und srcY
	// aus gemalt wird. 
	
	this.width = 32;
	this.height = 32;
	
	// Alle Variablen hierdrüber sind dafür da um den Charakter zu malen. 
	// diese verändern sich mit Ausnahme der Position nicht. 
	
	this.hp = 100; //hier wird später der Datenbankeintrag für Leben stehen
	this.mp = 20; // manawert aus Datenban
	this.speed = 3;
	this.is_downkey = false;
	this.is_upkey = false;
	this.is_leftkey = false;
	this.is_rightkey = false;
}

//Diese Funktion generiert ein Bild von Stöpsel.

Stoepsel.prototype.draw = function() {
	stoepsel.check_keys();
	main_ctx.drawImage(stoepsel_image, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
	//Befehl um Stöpsel zu "Malen"
};

//Diese Funktion prüft ob Tasten gedrückt wurden. 

Stoepsel.prototype.check_keys = function() {
	
	// Dieser If-Block ist dafür zuständig, die Position auf den
	// jeweiligen Tastendruck um die Variable "speed" von stoepsel
	// zu ändern
	
	if (this.is_downkey) {
		this.drawY += this.speed;
	} else if (this.is_upkey){
		this.drawY -= this.speed;
	} else if (this.is_rightkey) {
		this.drawX += this.speed;
	} else if (this.is_leftkey) {
		this.drawX -= this.speed;
	}
};

//Diese Funktion ist dafür da um zu erkennen ob Tasten gedrückt 
//werden und dann bestimmte Befehle auszuführen! Sie beschreibt 
//die STEUERUNG.

function key_down(e) { 
	var key_id = e.keyCode || e.which; //einige Browser nutzen zur Erkennung der gedrückten Taste keycode einige which. Um beide Varianten abzudecken, wird der jeweils benötigte Wert in die Variable gespeichert. 
									   //key_id speichert den Wert der gedrückten Taste und führt dann den Befehl in der If Bedingung aus.
	if(key_id == 40) { //Wert 40 steht für Taste nach unten. 
		stoepsel.is_downkey = true;
		e.preventDefault();
	} else if (key_id == 38) { // Wert 38 steht für Pfeiltaste oben
		stoepsel.is_upkey = true;
		e.preventDefault();
	} else if (key_id == 39) { // Pfeiltaste rechts
		stoepsel.is_rightkey = true;
		e.preventDefault();
	} else if (key_id == 37) { // PFeiltaste links
		stoepsel.is_leftkey = true; 
		e.preventDefault();
	}
}

// die obige Funktion soll prüfen ob und welche Taste gedrückt wird.
// Um aber auch feststellen zu können, dass eine Taste losgelassen
// wurde brauchen wir noch eine Funktion dafür (Key_up) die dann
// die Variablenwerte wieder auf false setzt.

function key_up(e) { 
	var key_id = e.keyCode || e.which; //einige Browser nutzen zur Erkennung der gedrückten Taste keycode einige which. Um beide Varianten abzudecken, wird der jeweils benötigte Wert in die Variable gespeichert. 
									   //key_id speichert den Wert der gedrückten Taste und führt dann den Befehl in der If Bedingung aus.
	if(key_id == 40) { //Wert 40 steht für Taste nach unten. 
		stoepsel.is_downkey = false;
		e.preventDefault();
	} else if (key_id == 38) { // Wert 38 steht für Pfeiltaste oben
		stoepsel.is_upkey = false;
		e.preventDefault();
	} else if (key_id == 39) { // Pfeiltaste rechts
		stoepsel.is_rightkey = false;
		e.preventDefault();
	} else if (key_id == 37) { // PFeiltaste links
		stoepsel.is_leftkey = false; 
		e.preventDefault();
	}
}

function loop() {
	
	main_ctx.clearRect(0,0,1440,960);
	
	stoepsel.draw();
	
	if (is_playing) {
		requestaframe(loop);
	}
	
}

function start_loop(){
	is_playing = true;
	loop();
	background_ctx.drawImage(hafenstadt, 0, 0);
}

function stop_loop(){
	is_playing = false;
}
