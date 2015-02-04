$(document).ready(function(){

	var Game = {
				game: $('#colGame'),
				gravity: 100
				};
		Game.width = Game.game.width();
		Game.height = Game.game.height();
	var game = Game.game;
	
	
	function renderPlayer(){
		Player.player.css({
			top: Player.location.top,
			bottom: Player.location.bottom,
			left: Player.location.left,
			right: Player.location.right
		});
	}


	/////////// Movements /////////////
	
			var moveLeft = function(){
				$('#debugLastAction').text('moveLeft');
				
				};
				
			var jump = function(){
				$('#debugLastAction').text('jump');
					Player.location.bottom = Player.location.bottom + 20;
					renderPlayer();
				};
				
			var moveRight = function(){
				$('#debugLastAction').text('moveRight');
				
				};
				
			var fall = function(){
				$('#debugLastAction').text('fall');
				
				};
	
	
	////////// End Movements //////////
	
	var Player = {
			player: $('#colPlayer'),
			actions: {
				moveLeft: moveLeft,
				jump: jump,
				moveRight: moveRight,
				fall: fall
				},
		};
		Player.location = {
				top: Player.player.offset().top,
				bottom: Player.player.offset().bottom,
				left: Player.player.offset().left,
				right:  Player.player.offset().right,
		}

	game.keydown(function(){
		$( "#debugKey" ).text(event.which);
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
			case 40:
				Player.actions.fall();
				break;
		}
	});
		
	
	/////////// Debug /////////////////
	
	$('#debugHeight').text(Game.height);
	$('#debugWidth').text(Game.width);
	
	$('#playerTop').text(Player.location.top);
	$('#playerBottom').text(Player.location.bottom);
	$('#playerLeft').text(Player.location.left);
	$('#playerRight').text(Player.location.right);
	
	

});