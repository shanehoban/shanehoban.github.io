var Game = {
		game: $('.col-game'),
		gravity: 800,
		startSpeed: 0.02,
		maxSpeed: 1,
		acceleration: 0.05,
		friction: 1
	};
	Game.width = Game.game.width();
	Game.height = Game.game.height();

	Game.jumpHeight = ((Game.gravity/25) * 1.25); // start @ 40 on
	Game.moveDist = (Game.width/100)*Game.startSpeed; // start move distance @ 0.1

	Game.jumpAni = (Game.gravity * 0.3);
	Game.fallAni = (Game.gravity * 0.3);

var game = Game.game;
	game.focus(); // so don't have to click div

var Player = {
		currentSpeed: 0,
		actions: {
			jump: jump,
			moveRight: moveRight,
			moveLeft: moveLeft,
			},
		isJumping: false,
		isFalling: false,
		isMovingRight: false,
		isMovingLeft: false
	};

var p = $('.col-player');

/////////// Movements /////////////

	function jump(){
		if(!Player.isJumping && !Player.isFalling){
			Player.isJumping = true;
				p.animate({bottom: "+=" + Game.jumpHeight}, Game.jumpAni, function(){
					Player.isJumping = false;
					Player.isFalling = true;
						p.animate({bottom: "-="+ Game.jumpHeight}, Game.fallAni, function(){
							setTimeout(function(){
								Player.isFalling = false;
								}, 100);
						});
				});
			renderDebug("jump");
		}
	}



	/* 
	 *	Alyways work from the left, even if moving right
	 */
	function moveRight(){
		Player.isMovingRight = true;

		if(Player.isMovingRight == true && Player.currentSpeed < Game.maxSpeed){
			Player.currentSpeed += (Player.currentSpeed === 0) ? Game.startSpeed : 0;
			console.log("currentSpeed", Player.currentSpeed);
			Player.currentSpeed = (Player.currentSpeed+(Game.acceleration/Game.friction)) ;
			console.log("Game.moveDist", Game.moveDist);
			Game.moveDist = (Game.width/100) * Player.currentSpeed;
		}

		p.css("left", "+=" + Game.moveDist);
		renderDebug("moveRight");
	}




	/* 
	 *	Alyways work from the left, even if moving right
	 */
	function moveLeft(){
		Player.isMovingRight = true;

		if(Player.isMovingRight == true && Player.currentSpeed < Game.maxSpeed){
			Player.currentSpeed += (Player.currentSpeed === 0) ? Game.startSpeed : 0;
			console.log("currentSpeed", Player.currentSpeed);
			Player.currentSpeed = (Player.currentSpeed+(Game.acceleration/Game.friction)) ;
			console.log("Game.moveDist", Game.moveDist);
			Game.moveDist = (Game.width/100) * Player.currentSpeed;
		}

		p.css("left", "-=" + Game.moveDist);
		renderDebug("moveRight");
	}




////////// End Movements //////////



	var x = 0; // debug
	var map = [];
	game.keydown(function(){
		
		var e = e || event; // to deal with IE
		map[e.keyCode] = e.type == 'keydown';

		if(map[37])
			Player.actions.moveLeft();
		if(map[38])
		 	Player.actions.jump();
		if(map[39])
			Player.actions.moveRight();
		if(map[40])
			Player.actions.fall();
	
		x++; //debug
		$( ".debug-key" ).text(e.keyCode);
	});




	game.keyup(function(){
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
		$('.debug-player-top').text(p.offset().top);
		$('.debug-speed').text(Math.round(Player.currentSpeed*100)/100);
	}
	renderDebug();