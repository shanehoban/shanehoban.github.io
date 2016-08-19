	
	var SCORE = 0;
	// key codes
	var LEFT = 37;
	var RIGHT = 39;
	var UP = 38;
	var DOWN = 40;
	var GAME_SIZE = 2000;
	var SNAKE = [];
	var INTERVALS = [];
	var gameSpeed = 100;


//////////////////////////

var downE = jQuery.Event("keydown");
var upE = jQuery.Event("keydown");
var leftE = jQuery.Event("keydown");
var rightE = jQuery.Event("keydown");
	
	downE.which = DOWN;
	upE.which = UP;
	leftE.which = LEFT;
	rightE.which = RIGHT;

//////////////////////////

var game = $('.game');
var fruitID;

function resetGame(){
	game.empty();
	SNAKE = [];
	SCORE = 0;

	for(var i = 0; i<GAME_SIZE; i++){
		game.append('<div id="b' + i + '"></div>');
	}

	var position = Math.floor(Math.random() * (GAME_SIZE - 1) + 1);

	$('#b' + position).addClass('snake');
	$('#b' + (position-1)).addClass('snake');
	$('#b' + (position-2)).addClass('snake-head');

	SNAKE.push(position);
	SNAKE.push((position-1));
	SNAKE.push((position-2));

	removeAnimations()
	generateFruit();
	$('.game-overlay').hide();
	moveSnake();
}

function generateFruit(){
	var fruit = Math.floor(Math.random() * GAME_SIZE) + 1;
	if(fruit > 1950 || game.find('#b' + fruit).hasClass('snake') || game.find('#b' + fruit).hasClass('snake-head')){
		generateFruit();
	} else {
		game.find('#b' + fruit).addClass('fruit');
		fruitID = fruit;
	}
}

function endGame(){
	$('.score-val').addClass('animated hinge');
	for(var i = 0; i < INTERVALS.length; i++){
		clearInterval(INTERVALS[i]);
	}
	$('.game-overlay').fadeIn('fast');
}

function removeAnimations(){
	$('.score-val').removeClass('animated hinge');
	$('.score-val').removeClass('animated bounce');
}

function updateScore(){
	SCORE = SNAKE.length - 3;
	$('.score-val').html(SCORE);
	if(SCORE % 5 === 0 && SCORE !== 0){
		$('.score-val').addClass('animated bounce');
	} else {
		removeAnimations();
	}
}

function moveSnake(){
	var moveDir = 0;

	INTERVALS.push(setInterval(function() {
	  if (moveDir !== 0) {
	  	move(moveDir);
	  }
	}, gameSpeed));

	$(document).keydown(function(e) {
	  if (e.which === RIGHT) {
	    moveDir = 'r';
	  } else if (e.which === LEFT) {
	    moveDir = 'l';
	  } else if (e.which === UP) {
	    moveDir = 'u';
	  } else if (e.which === DOWN) {
	    moveDir = 'd';
	  }
	});

	var move = function(dir){
		var currentLocation = SNAKE[SNAKE.length-1];
		var nextLocation;

		switch(dir) {
			case 'r':
				nextLocation = currentLocation + 1;
				break;
			case 'l':
				nextLocation = currentLocation - 1;
				break;
			case 'u':
				nextLocation = currentLocation - 50;
				break;
			case 'd':
				nextLocation = currentLocation + 50;
				break;
		}

		var fruitEaten = 0;
		//check whether the SNAKE has hit a 'fruit'
		if ($('#b'+nextLocation).hasClass('fruit')){
			fruitEaten = SNAKE[0];
			$('#b'+nextLocation).removeClass('fruit');
			generateFruit();	 //generate a new fruit piece
		}

		//Check whether snake has hit itself
		if ($('#b'+nextLocation).hasClass('snake')){
			
			endGame();
			return;

			for (var i=0;i<=SNAKE.length;i++){
				//remove snake from [i]
				$('#b'+SNAKE[i]).removeClass('snake');
			}
			// kill the snake
			SNAKE = [];
			moveDir = 0;
			SCORE = 0;
		}

		// if snake is going left, the %50 box is the last on the left
		if (nextLocation%50 === 0 && moveDir !== 'l'){
			nextLocation = (nextLocation > currentLocation) ? nextLocation - 50 : nextLocation + 50;
		}
		// ^ from previous comment, covered here
		if ((nextLocation+1)%50 === 0 && moveDir === 'l'){
			nextLocation = (nextLocation > currentLocation) ? nextLocation - 50 : nextLocation + 50;
		}

		// If going over the size of the game, or previous to 0
		if(nextLocation <= 0 || nextLocation >= GAME_SIZE){
			nextLocation = (nextLocation<0) ? GAME_SIZE + nextLocation : nextLocation - GAME_SIZE;
		}

		//u
		for (var i = 0; i < SNAKE.length; i++){
			//remove snake from [i]
			$('#b' + SNAKE[i]).removeClass('snake');
			SNAKE[i]=SNAKE[i+1];
		}

		if (fruitEaten !== 0){
			SNAKE.unshift(fruitEaten);
		}

		for (var i=0; i<SNAKE.length; i++){
			$('#b'+SNAKE[i]).addClass('snake');
		}
		SNAKE[SNAKE.length-1] = nextLocation;
		updateScore();
		$('#b'+nextLocation).addClass('snake-head');
		$('#b'+currentLocation).removeClass('snake-head');	
		
		$('.snake-location').html(nextLocation);
		$('.snake-direction').html(moveDir);
		$('.fruit-location').html(fruitID);

		var leftDetected = $('#b'+ (nextLocation-1)).hasClass('snake') ? true : false;
		var rightDetected = $('#b'+ (nextLocation+1)).hasClass('snake') ? true : false;
		var upDetected = $('#b'+ (nextLocation-50)).hasClass('snake') ? true : false;
		var downDetected = $('#b'+ (nextLocation+50)).hasClass('snake') ? true : false;

		if(leftDetected){console.log('left detected');}
		if(rightDetected){console.log('right detected');}
		if(upDetected){console.log('up detected');}
		if(downDetected){console.log('down detected');}

		if(leftDetected && rightDetected && upDetected && downDetected){
			console.log('self-destructed');
			endGame();
			return;
		}

		if(downDetected && moveDir === 'd'){
			if(!leftDetected && rightDetected){
				console.log('detected down & right, moving left', moveDir);
				$(document).trigger(leftE);
				return;
			}
			if(leftDetected && !rightDetected){
				console.log('detected down & left, moving right', moveDir);
				$(document).trigger(rightE);
				return;
			}

			console.log('left', moveDir);
			$(document).trigger(leftE);
			return;
		}

		if(upDetected && moveDir === 'u'){
			if(!leftDetected && rightDetected){
				console.log('detected up & right, moving left', moveDir);
				$(document).trigger(leftE);
				return;
			}
			if(leftDetected && !rightDetected){
				console.log('detected up & left, moving right', moveDir);
				$(document).trigger(rightE);
				return;
			}

			console.log('left', moveDir);
			$(document).trigger(leftE);
			return;
		}

		if(leftDetected && moveDir === 'l'){
			if(!upDetected && downDetected){
				console.log('detected left & down, moving up', moveDir);
				$(document).trigger(upE);
				return;
			}
			if(upDetected && !downDetected){
				console.log('detected left & up, moving down', moveDir);
				$(document).trigger(downE);
				return;
			}
			
			console.log('down', moveDir);
			$(document).trigger(downE);
			return;
		}

		if(rightDetected && moveDir === 'r'){
			if(!upDetected && downDetected){
				console.log('detected right & down, moving up', moveDir);
				$(document).trigger(upE);
				return;
			}
			if(upDetected && !downDetected){
				console.log('detected right & up, moving down', moveDir);
				$(document).trigger(downE);
				return;
			}
			
			console.log('down', moveDir);
			$(document).trigger(downE);
			return;
		}

		var fruitRow = Math.floor(fruitID/50);
		var snakeRow = Math.floor(nextLocation/50);

		if(fruitRow === snakeRow){
			if(nextLocation%50 > fruitID%50 && !leftDetected){
				console.log('left', moveDir);
				$(document).trigger(leftE);
			} else if(!rightDetected){
				console.log('right', moveDir);
				$(document).trigger(rightE);
			}
			return;
		}

		if(nextLocation > fruitID && moveDir !== 'u' && moveDir !== 'd' && !upDetected){
			console.log('up', moveDir);
			$(document).trigger(upE);
			return;
		} else if(fruitID > nextLocation && moveDir !== 'u' && moveDir !== 'd' && !downDetected){
			console.log('down', moveDir);
			$(document).trigger(downE);
			return;
		}

		if((nextLocation-fruitID)%10 === 0 && moveDir !== 'u' && moveDir !== 'd' && !upDetected){
			console.log('up', moveDir);
			$(document).trigger(upE);
			return;
		}

		if((fruitID-nextLocation)%10 === 0 && moveDir !== 'u' && moveDir !== 'd' && !downDetected){
			console.log('down', moveDir);
			$(document).trigger(downE);
			return;
		}

	};
};

function startGame(){
	$(document).trigger(downE);
}

$('.game-over button').on('click', resetGame);
resetGame();
startGame();