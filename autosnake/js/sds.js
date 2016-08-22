	
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

var moveE = jQuery.Event("keydown");
var dirs = {
	d: DOWN,
	u: UP,
	l: LEFT,
	r: RIGHT
}

//////////////////////////

var game = $('.game');
var fruitID;

function resetGame(){
	game.empty();
	SNAKE = [];
	SCORE = 0;

	for(var i = 0; i < GAME_SIZE; i++){
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
	snakeAPI.initSnake();
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

function startGame(){
	snakeAPI.move('d');
}

$('.game-over button').on('click', resetGame);
resetGame();
startGame();