var Game = {
		game: $('.col-game'),
		gravity: 800,
		friction: 0,
		maxSpeed: 0.6
	};
	Game.width = Game.game.width();
	Game.height = Game.game.height();

	Game.jumpHeight = ((Game.gravity/25) * 1.25);
	Game.moveDist = (Game.width/100)*0.05; // start move distance

	Game.jumpAni = (Game.gravity * 0.3);
	Game.fallAni = (Game.gravity * 0.3);

var game = Game.game;
	game.focus();
x

var Player = {
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
		p.css("left", "+=" + Game.moveDist);
		renderDebug("moveRight");
	}

	function moveLeft(){
		p.css("left", "-=" + Game.moveDist);
		renderDebug("moveLeft");
	}

	////////// End Movements //////////

	var map = [];
	var x = 0; // debug
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
	//	$('.debug-player-bottom').text(p.offset().top);
	//	$('.debug-player-left').text(p.offset().top);
	//	$('.debug-player-right').text(p.offset().top);
	}
	renderDebug();