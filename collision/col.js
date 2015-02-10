var Game = {
		game: $('.col-game'),
		gravity: 1,
		friction: 1,
		startSpeed: 0.02,
		maxSpeed: 0.5,
		acceleration: 0.01,
		deceleration: 0.01,
		reDrawMs: 10
	};
	Game.width = Game.game.width();
	Game.height = Game.game.height();

var game = Game.game;
	game.focus(); // so don't have to click div

var Player = {
		currentSpeed: 0,
		currentJump: 0,
		isJumping: false,
		isFalling: false,
		isMovingRight: false,
		isMovingLeft: false
	};

var p = $('.col-player');


Game.recalc = function(){
	Game.moveDist = (Game.width/100)*Game.startSpeed; // 0.02% (acceleration also comes into play)
	
	Game.maxJumpHeight = (Game.height/100)*(Game.gravity*10);
	Game.jumpAcceleration = ((Game.maxJumpHeight/100)*5)/Game.gravity;
};

/////////// Movements /////////////

	Player.jump = function(){
		Game.recalc();

		if(Player.currentJump >= Game.maxJumpHeight){
			Player.isJumping = false;
			Player.isFalling = true;
			Player.fall();
			return;
		}

		Player.currentJump += Game.jumpAcceleration;
		p.css("bottom", Player.currentJump);

			setTimeout(function(){ 
				Player.jump();
			}, Game.reDrawMs);

		renderDebug("jump");
	};

	Player.fall = function(){
		Game.recalc();

		if(Player.currentJump <= 0){
			Player.isJumping = false;
			Player.isFalling = false;
			return;
		}


		Player.currentJump -= Game.jumpAcceleration;
		p.css("bottom", Player.currentJump);

			setTimeout(function(){ 
				Player.fall();
			}, Game.reDrawMs);

		renderDebug("jump");
	};


	/* 
	 *	Alyways work from the left, even if moving right
	 */
	Player.moveRight = function(){
		Game.recalc();

		if(Player.isMovingRight){
			Player.currentSpeed += (Player.currentSpeed === 0) ? Game.startSpeed : 0;
			Player.currentSpeed = (Player.currentSpeed+(Game.acceleration/Game.friction)) ;
			Player.currentSpeed = (Player.currentSpeed >= Game.maxSpeed) ? Game.maxSpeed : Player.currentSpeed;
			Game.moveDist = (Game.width/100) * Player.currentSpeed;
			p.css("left", "+=" + Game.moveDist);
				setTimeout(function(){ 
					Player.moveRight(); 
				}, Game.reDrawMs);
		}
		renderDebug("moveRight");
	};


	Player.moveLeft = function(){
		Game.recalc();

		if(Player.isMovingLeft){
			Player.currentSpeed += (Player.currentSpeed === 0) ? Game.startSpeed : 0;
			Player.currentSpeed = (Player.currentSpeed+(Game.acceleration/Game.friction)) ;
			Player.currentSpeed = (Player.currentSpeed >= Game.maxSpeed) ? Game.maxSpeed : Player.currentSpeed;
			Game.moveDist = (Game.width/100) * Player.currentSpeed;
			p.css("left", "-=" + Game.moveDist);
				setTimeout(function(){
					Player.moveLeft(); 
				}, Game.reDrawMs);
		}
		renderDebug("moveLeft");
	};



////////// End Movements //////////



	// Left: 37, Jump: 38, Right: 39, Down: 40
	var x = 0; // debug
	var map = [];
	game.keydown(function(){
		Game.recalc();

		var e = e || event; // to deal with IE
		map[e.keyCode] = e.type == 'keydown';

			// if both are pressed, cancel the incoming movement
		if(map[37] && Player.isMovingLeft) map[39] = false;
		if(map[39] && Player.isMovingRight) map[37] = false;

		if(map[37] && !Player.isMovingLeft){
			Player.isMovingLeft = true;
			Player.moveLeft();
		}
		if(map[38] && !Player.isJumping && !Player.isFalling){
			Player.isJumping = true;
		 	Player.jump();
		}
		if(map[39] && !Player.isMovingRight){
			Player.isMovingRight = true;
			Player.moveRight();
		}
		if(map[40]){
			Player.fall();
		}
	
		x++; //debug
		$( ".debug-key" ).text(e.keyCode);
	});



	
	// Left: 37, Jump: 38, Right: 39, Down: 40
	game.keyup(function(){
		Game.recalc();

		var e = e || event; // to deal with IE
			map[e.keyCode] = e.type == 'keydown';

		if(!map[37]){
			Player.isMovingLeft = false;
			Player.currentSpeed = 0;
		}
		if(!map[39]){
			Player.isMovingRight = false;
			Player.currentSpeed = 0;
		}
		
		x = 0; //debug
		renderDebug();
	});



	/////////// Debug /////////////////

	function renderDebug(action){

		$('.debug-height').text(Game.height);
		$('.debug-width').text(Game.width);
		$('.debug-button-down-count').text(x);
		$('.debug-last-action').text(action);
		$('.debug-speed').text(Math.round(Player.currentSpeed*100)/100);
		$('.debug-player-current-jump').text(Player.currentJump);


		$('.debug-player-top').text(p.position().top);
		$('.debug-player-left').text(p.position().left);
	}
	renderDebug();