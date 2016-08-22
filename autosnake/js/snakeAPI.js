
    var snakeAPI = (function(){

        var moveDir = 0;

        function moveInDirection(dir){
            console.log('moving ' + moveDir, dir);
            moveE.which = dirs[dir];
            $(document).trigger(moveE);
        }

        function calculateBestMove(nextLocation){
            // Calculate best move
           console.log('calculating best move');

           var bestDirection;
           var decision = SNAKE.slice(SNAKE.indexOf(nextLocation), SNAKE.length);
               decision = decision.reduce(function(a, b){ return a + b }, 0);
               decision = decision/(SNAKE.slice(SNAKE.indexOf(nextLocation), SNAKE.length)).length;
            if(decision < nextLocation){
                moveInDirection('u');
                return;
            } else {
                moveInDirection('d');
                return;
            }
        }

        function move(dir){
            
            var currentLocation = SNAKE[SNAKE.length-1];
            var nextLocation;
            var fruitEaten = 0;

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

            //check whether the SNAKE has hit a 'fruit'
            if ($('#b'+nextLocation).hasClass('fruit')){
                fruitEaten = SNAKE[0];
                $('#b'+nextLocation).removeClass('fruit');
                generateFruit();     //generate a new fruit piece
                SNAKE.unshift(fruitEaten);
            }

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

            for (var i=0; i<SNAKE.length; i++){
                $('#b'+SNAKE[i]).addClass('snake');
            }

            SNAKE[SNAKE.length-1] = nextLocation;
            updateScore();

            $('#b'+nextLocation).addClass('snake-head');
            $('#b'+currentLocation).removeClass('snake-head');
            
            var leftDetected = $('#b'+ (nextLocation-1)).hasClass('snake') ? true : false;
            var rightDetected = $('#b'+ (nextLocation+1)).hasClass('snake') ? true : false;
            var upDetected = $('#b'+ (nextLocation-50)).hasClass('snake') ? true : false;
            var downDetected = $('#b'+ (nextLocation+50)).hasClass('snake') ? true : false;

            // Debug
                $('.snake-location').html(nextLocation);
                $('.snake-direction').html(moveDir);
                $('.fruit-location').html(fruitID);

            if(leftDetected && rightDetected && upDetected && downDetected){
                console.log('self-destructed');
                endGame();
                return;
            }

            if(!!SNAKE.reduce(function(a, b){ return (a === b) ? a : NaN; })){
                console.warn('wtf - going right');
                moveInDirection('r');
                return;
            }

            if(downDetected && moveDir === 'd'){

                if(!leftDetected && rightDetected){
                    console.warn('detected down & right, moving left');
                    moveInDirection('l');
                    return;
                }

                if(leftDetected && !rightDetected){
                    console.warn('detected down & left, moving right');
                    moveInDirection('r');
                    return;
                }

                moveInDirection('r');
                return;
            }

            if(upDetected && moveDir === 'u'){

               if(!leftDetected && rightDetected){
                   console.warn('detected up & right, moving left');
                  moveInDirection('l');
                  return;
               }
               
               if(leftDetected && !rightDetected){
                   console.warn('detected up & left, moving right');
                   moveInDirection('r');
                   return;
               }

               moveInDirection('l');
               return;
            }

            if(leftDetected && moveDir === 'l'){
                if(!upDetected && downDetected){
                    console.log('detected left & down, moving up');
                    moveInDirection('u');
                    return;
                }
                if(upDetected && !downDetected){
                    console.log('detected left & up, moving down');
                    moveInDirection('d');
                    return;
                }
                
               calculateBestMove(nextLocation);
               return;
            }

            if(rightDetected && moveDir === 'r'){
                if(!upDetected && downDetected){
                    console.log('detected right & down, moving up');
                    moveInDirection('u');
                    return;
                }
                if(upDetected && !downDetected){
                    console.log('detected right & up, moving down');
                    moveInDirection('d');
                    return;
                }
                
               calculateBestMove(nextLocation);
               return;
            }

            var fruitRow = Math.floor(fruitID/50);
            var snakeRow = Math.floor(nextLocation/50);

            if(fruitRow === snakeRow){
                if(nextLocation%50 > fruitID%50 && !leftDetected && moveDir !== 'l'){
                    console.log('left');
                    moveInDirection('l');
                    return;
                } else if(!rightDetected && moveDir !== 'r'){
                    console.log('right');
                    moveInDirection('r');
                    return;
                } else {
                    // already moving right
                    return;
                }
            }

            if(nextLocation > fruitID && moveDir !== 'u' && moveDir !== 'd' && !upDetected){
                console.log('up');
                moveInDirection('u');
                return;

            } else if(fruitID > nextLocation && moveDir !== 'u' && moveDir !== 'd' && !downDetected){
                console.log('down');
                moveInDirection('d');
                return;
            }

            if((nextLocation-fruitID)%10 === 0 && moveDir !== 'u' && moveDir !== 'd' && !upDetected){
                console.log('up');
                moveInDirection('u');
                return;
            }

            if((fruitID-nextLocation)%10 === 0 && moveDir !== 'u' && moveDir !== 'd' && !downDetected){
                console.log('down');
                moveInDirection('d');
                return;
            }

        }; // end move


        var initSnake = function(){

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
        }

        return {
            initSnake: initSnake,
            move: moveInDirection
        }

    })();