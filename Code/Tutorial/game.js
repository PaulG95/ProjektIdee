var version = '0.0.1';
var is_playing = false; //Variable zum Starten

init();
function init() {
	
	background_canvas = document.getElementById('background_canvas');
	background_ctx = background_canvas.getContext('2d');
	main_canvas = document.getElementById('main_canvas');
	main_ctx = main_canvas.getContext('2d');
	
	document.addEventListener("keydown", key_down, false);
	document.addEventListener("keyup", key_up, false);
	
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
	
	player = new Player();
	enemies = new Array();
	bullets = new Array();
	
	load_media();
}

//Medien (Bilder usw.) laden

function load_media() {
	bg_sprite = new Image();
	bg_sprite.src = 'Images/bg_sprite.png';
	main_sprite = new Image();
	main_sprite.src = 'Images/main_sprite.png';
	bul_sprite = new Image();
	bul_sprite.src = 'Images/bul_sprite.png';
	expl_sprite = new Image();
	expl_sprite.src = 'Images/expl_sprite.png';
	gun_sprite = new Image();
	gun_sprite.src = 'Images/gun_sprite.png';
}

function mouse(e) {
	var x = e.pageX - document.getElementById('game_object').offsetLeft;
	var y = e.pageY - document.getElementById('game_object').offsetTop;
	document.getElementById('x').innerHTML = x;
	document.getElementById('y').innerHTML = y;
}

var r_y = 0;
var r_x = 0;

function Player() {
	
	this.life = 100;
	this.drawX = 650; 
	this.drawY = 360;
	this.speed = 3;
	this.srcX = 32;
	this.srcY = 0;
	this.width = 32;
	this.height = 32;
	this.is_downkey = false;
	this.is_upkey = false;
	this.is_leftkey = false;
	this.is_rightkey = false;
	
}  

Player.prototype.draw = function() {
	this.check_keys();
	main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height); 
	main_ctx.drawImage(gun_sprite, 0, 0, 20, 20)
};

Player.prototype.check_keys = function() {
	if (this.is_downkey == true)
		this.drawY += this.speed;
	if (this.is_upkey == true)
		this.drawY -= this.speed;
	if (this.is_leftkey == true)
		this.drawX -= this.speed;
	if (this.is_rightkey == true)
		this.drawX += this.speed;
	if (this.is_space == true)
		this.bullets[bullets.length] = new Bullet(this.drawX + this.width - 5, this.drawY, true);
}

function Enemy() {
	
	this.drawX = Math.round(Math.random()*300); 
	this.drawY = Math.round(Math.random()*300);
	this.speed = 2 + Math.random() * 5;
	this.srcX = 64;
	this.srcY = 96;
	this.width = 32;
	this.height = 32;

}  

Enemy.prototype.draw = function() {
	this.ai();
	main_ctx.drawImage(main_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
};

Enemy.prototype.ai = function() {
	this.drawX += this.speed;
	if (this.drawX > 800) {
		this.drawX = -this.width-1;
	}
	if (Math.round(Math.random()*100) == 50) {
		bullets[bullets.length] = new Bullet(this.drawX, this.drawY);
	} 
};

function Bullet(x, y, is_player) {
	this.drawX = x;
	this.drawY = y;
	this.srcX = 0;
	this.srcY = 0;
	this.width = 20;
	this.height = 20;
	this.speed = 7;
	this.exploded = false;
	this.wait = 0;
	if (is_player)
		this.is_player = true;
	else 
		this.is_player = false;
}

Bullet.prototype.draw = function() {
	
	if (!this.exploded)
	main_ctx.drawImage(bul_sprite, this.srcX, this.srcY, this.width, this.height, this.drawX, this.drawY, this.width, this.height);
	
	if (!this.exploded) {
		if (this.is_player)
			this.drawY -= this.speed;
		else
			this.drawY += this.speed;
	}
	
	if (!this.is_player && this.drawX <= player.drawX + player.width && this.drawX + this.width >= player.drawX && this.drawY <= player.drawY + player.height && this.drawY + this.height >= player.drawY && this.exploded == false) {
		this.exploded = true;
		this.wait = 50;
		player.life -= 10;
	} 
	
	if (this.exploded && this.wait > 0) {
		main_ctx.drawImage(expl_sprite, 0,0, 20, 20, this.drawX, this.drawY, 30, 30);
		this.wait--;
	}
};

function spawn_enemy(n) {
	for (var i = 0; i < n; i++) {
		enemies[enemies.length] = new Enemy();
	}
}

function loop() {
	
	main_ctx.clearRect(0,0,800,600);
	
	player.draw();
	for (var i = 0; i < enemies.length; i++) {
		enemies[i].draw();
	}
	for (var i = 0; i < bullets.length; i++) {
		bullets[i].draw();
	}
	
	main_ctx.fillStyle = "gray";
	main_ctx.font = "50px Arial";
	main_ctx.textBaseline = 'top';
	main_ctx.fillText(player.life, 0, 0);
	
	if (is_playing)
		requestaframe(loop);
}

function start_loop() {
	is_playing = true;
	loop();
	background_ctx.drawImage(bg_sprite, 0, 0);
	spawn_enemy(2);
}

function stop_loop() {
	is_playing = false;
}

function key_down(e) {
	var key_id = e.keyCode || e.which;
	if (key_id == 40) //down key_down <--- zahlenwert steht für bestimmten Wert auf Tastatur, Wert muss gegooglet werden
	{
		player.is_downkey = true;
		e.preventDefault();
	}
	if (key_id == 38) // oben
	{
		player.is_upkey = true;
		e.preventDefault();
	}
	if (key_id == 39) // rechts
	{
		player.is_rightkey = true;
		e.preventDefault();
	}
	if (key_id == 37) // links
	{
		player.is_leftkey = true;
		e.preventDefault();
	}
	if (key_id == 32)
	{
		player.is_space = true;
		e.preventDefault();
	}
}

function key_up(e) {
	var key_id = e.keyCode || e.which;
	if (key_id == 40) //down key_down <--- zahlenwert steht für bestimmten Wert auf Tastatur, Wert muss gegooglet werden
	{
		player.is_downkey = false;
		e.preventDefault();
	}
	if (key_id == 38) // oben
	{
		player.is_upkey = false;
		e.preventDefault();
	}
	if (key_id == 39) // rechts
	{
		player.is_rightkey = false;
		e.preventDefault();
	}
	if (key_id == 37) // links
	{
		player.is_leftkey = false;
		e.preventDefault();
	}
	if (key_id == 32)
	{
		player.is_space = true;
		e.preventDefault();
	}	
}
