
var Game = {
		game: $('.col-game'),
		gravity: 800,
		friction: 100
	};
	Game.width = Game.game.width();
	Game.height = Game.game.height();

	Game.jumpHeight = ((Game.gravity/25) * 1.25);
	Game.moveDist = (100/10);

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

var x = 0;

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

	function moveRight(){
		p.animate({left: "+=" + Game.moveDist}, {duration: Game.moveAni, queue: false}, function(){
		});
		renderDebug("moveRight");
	}

	function moveLeft(){
		p.animate({left: "-=" + Game.moveDist}, {duration: Game.moveAni, queue: false}, function(){
		});
		renderDebug("moveLeft");
	}

	////////// End Movements //////////



	game.keydown(function(){
		x++;
		$( ".debug-key" ).text(event.which);
		switch(event.which){
			case 37:
			 	Player.actions.moveLeft();
			 	break;
		 	case 38:
		 		Player.actions.jump();
		 		break;
			case 39:
			 	Player.actions.moveRight();
			 	break;
			// case 40:
			// 	Player.actions.fall();
			// 	break;
		}
	});

	game.keyup(function(){
		x=0;
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