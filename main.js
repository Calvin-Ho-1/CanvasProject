// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 1000;
document.body.appendChild(canvas);

let board = [
	['x','x','x','x','x','x','x',],
	['x','x','x','x','x','x','x',],
	['x','x','x','x','x','x','x',],
	['x','x','x','x','x','x','x',],
	['x','x','x','x','x','x','x',],
	['x','x','x','x','x','x','x',],
	['x','x','x','x','x','x','x',],
	['x','x','x','x','x','x','x',],
	['x','x','x','x','x','x','x',],
];


//!!!!!!!!!!!!!!!!!!!!!!!!!!ADD GAMEOVER SOUND EFFECT (It's still pika)!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var soundEfx;
var soundItemFound = "sounds/pokemonitemfound.mp3"
var soundGameOver = "sounds/pokemonrecovery.mp3";
var soundBump = "sounds/pokemonbump.mp3"

soundEfx = document.getElementById("soundEfx");

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";


// border image L-R
var blReady = false;
var blImage = new Image();
blImage.onload = function () {
	blReady = true;
};
blImage.src = "images/BorderLeft.png";

// border image T-B
var btReady = false;
var btImage = new Image();
btImage.onload = function () {
	btReady = true;
};
btImage.src = "images/BorderTop.png";



// pikachu image
var pikachuReady = false;
var pikachuImage = new Image();
pikachuImage.onload = function () {
	pikachuReady = true;
};
//pikachuImage.src = "images/pikachu.png";

pikachuImage.src = "images/pikachusprites.png";

// ketchup image
var ketchupReady = false;
var ketchupImage = new Image();
ketchupImage.onload = function () {
	ketchupReady = true;
};
//ketchupImage.src = "images/ketchup.png";
ketchupImage.src = "images/ketchup.png";

var pokeballReady = false; 
var pokeballImage = new Image();
pokeballImage.onload = function () {
	pokeballReady = true;
};
pokeballImage.src = "images/pokeball.png"



// Game objects
var pikachu = {
	speed: 256, // movement in pixels per second
	x: 0,
	y: 0
};
var ketchup = {
	x: 0,
	y: 0
};


var pokeball1 = {
	x: 0,
	y: 0
};

var pokeball2 = {
	x: 0,
	y: 0
};

var pokeball3 = {
	x: 0,
	y: 0
};

//variables start here !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
var ketchupsCaught = 0;


//Animations
// My sprite image has 4 rows, 4 columns
let rows = 4; 
let cols = 4;

//second row for left movement (counting index from 0)
let trackLeft = 1;

//third row for the right movement (counting from the index from 0)
let trackRight = 2;

let trackUp = 3; // up

let trackDown = 0; //down

// sprite sheet pixel size 
let spriteSheetWidth = 512;
let spriteSheetHeight = 512;

// width of a frame
let width = spriteSheetWidth / cols;

// height of a frame
let height = spriteSheetHeight / rows; 

let curXFrame = 0; // start on left side
let frameCount = 4;  // 4 frames per row

//x and y coordinates of the overall sprite image to get the single frame  we want
let srcX = 0;  // our image has no borders or other stuff
let srcY = 0;

// Keeps track on which way the character is moving
// Starting the character to look down

let left = false;
let right = false; 
let up = false;
let down = true;


//you CANNOT adjust the walk speed of the character if you don't have this
let counter = 0;


let died = false;

// Handle keyboard controls
var keysDown = {}; // object were we add up to 4 properties when keys go down
                // and then delete them when the key goes up

addEventListener("keydown", function (e) {
	console.log(e.keyCode + " down")
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	console.log(e.keyCode + " up")
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a ketchup
var reset = function () {

	if (died == true){
		soundEfx.src = soundGameOver;
		soundEfx.play();
	}
	// pikachu.x = canvas.width / 2;
	// pikachu.y = canvas.height / 2;

	//Place the ketchup somewhere on the screen randomly
	// ketchup.x = 32 + (Math.random() * (canvas.width - 150));
	// ketchup.y = 32 + (Math.random() * (canvas.height - 148));
	placeItem(pikachu);
	placeItem(ketchup);
	placeItem(pokeball1);
	placeItem(pokeball2);
	placeItem(pokeball3);


	if(ketchupsCaught === 5) {
		alert("Pikachu is happy!");
		soundEfx.src = soundGameOver;
		soundEfx.play();

	}
};

let placeItem = function (character)
{
	let X = 5; 
	let Y = 6;
	let success = false; 
	while (!success){
		X = Math.floor(Math.random()*9);
		Y = Math.floor(Math.random()*9);
		if(board[X][Y] === 'x' ){
			success = true;
		}
	}
	board[X][Y] = 'O';
	character.x = (X*100) + 32; //the "+ 32" is to allow for the border
	character.y = (Y*100) + 32;
}


// Update game objects
var update = function (modifier) {

	//clears last pikachu image position (clearRect) and assumes that pikachu is not moving (the false)
	ctx.clearRect(pikachu.x, pikachu.y, width, height);

	left = false;
	right = false;
	up = false;
	down = false;

	if (38 in keysDown) { // Player holding up
		pikachu.y -= pikachu.speed * modifier;
		if (pikachu.y < ( 0) ) {
			pikachu.y = 0; //reason to make this 0 instead of the 32 pixel border is because of pikachu's image is small (and to not overlap with the "ketchups found" text)	
			//adds a bump sound
			//!!!! This will ONLY play if the player hits the wall by TAPPING IT!!! HOLDING THE MOVE KEY WILL NOT PLAY THE BUMP SOUND! 
			//!!! This works, BUT it WILL pop up that it was interrupted by a new load request (in the console log). This does NOT affect the gameplay or causes any problems with the game.
			soundEfx.src = soundBump;
			soundEfx.play();
		}
		left = false;
		right = false;
		up = true;
		down = false;

	}
	if (40 in keysDown) { // Player holding down
		pikachu.y += pikachu.speed * modifier;
		if (pikachu.y > (1000 - ( 160) )) {
			pikachu.y = 1000 	 -160; //adjusted
			//adds a bump sound
			//!!!! This will ONLY play if the player hits the wall by TAPPING IT!!! HOLDING THE MOVE KEY WILL NOT PLAY THE BUMP SOUND! 
			//!!! This works, BUT it WILL pop up that it was interrupted by a new load request (in the console log). This does NOT affect the gameplay or causes any problems with the game.
			soundEfx.src = soundBump;
			soundEfx.play();
		}
		left = false;
		right = false;
		up = false;
		down = true;
	}
	if (37 in keysDown) { // Player holding left
		pikachu.x -= pikachu.speed * modifier;
		if (pikachu.x < ( 5) ) {
			pikachu.x = 5; //adjusted
			//adds a bump sound
			//!!!! This will ONLY play if the player hits the wall by TAPPING IT!!! HOLDING THE MOVE KEY WILL NOT PLAY THE BUMP SOUND! 
			//!!! This works, BUT it WILL pop up that it was interrupted by a new load request (in the console log). This does NOT affect the gameplay or causes any problems with the game.
			soundEfx.src = soundBump;
			soundEfx.play();
		}
		left = true;
		right = false;
		up = false;
		down = false;
	}
	if (39 in keysDown) { // Player holding right
		pikachu.x += pikachu.speed * modifier;
		if (pikachu.x > ( 1000 - (32 +100 ) ) ) {
			pikachu.x = 1000 - (32 +100 ); //adjusted
			//Adds a bump sound
			//!!!! This will ONLY play if the player hits the wall by TAPPING IT!!! HOLDING THE MOVE KEY WILL NOT PLAY THE BUMP SOUND! 
			//!!! This works, BUT it WILL pop up that it was interrupted by a new load request (in the console log). This does NOT affect the gameplay or causes any problems with the game.
			soundEfx.src = soundBump;
			soundEfx.play();
		}
		left = false;
		right = true;
		up = false;
		down = false;
	}


	// Are they touching?
	//64 w  64 h
	// ketchup 64x64
	if (
		pikachu.x+5 <= (ketchup.x + 20) 
		&& ketchup.x <= (pikachu.x + 80)
		&& pikachu.y <= (ketchup.y + 10)
		&& ketchup.y <= (pikachu.y + 110)
	) {
		//Added this because if the player hits the wall (first), it won't play the hitting wall sound when the player picks up the ketchup
		soundEfx.src = soundItemFound;
		soundEfx.play();
		++ketchupsCaught;
		reset();
	}

	// curXFrame = ++curXFrame % frameCount; //This is what updates the sprite frames 
	//it will count as 0,1,2,0,1,2 and repeats 

	// if counter == *bigger number*, then the animation will be slower
	if (counter == 20){
		curXFrame = ++curXFrame % frameCount;
		counter = 0;
	} else{
		counter++;
	}


	srcX = curXFrame * width; // calculates x cord for pikachusprites

	//if left is true, it picks y dimension of the correct row

	if(left){
		//calculates the srcY
		srcY = trackLeft * height;
	}

	//if right is true, pick y dimension
	if (right){
		srcY = trackRight * height; 
	}

	if (up) {
		srcY = trackUp * height;
	}

	if (down){
		srcY = trackDown * height;
	}

	if (left == false && right == false && up == false && down == false){
		//idle (not moving), so pick a frame most suiting for "not moving"
		//(looks at you)
		srcX = 0 * width; 
		srcY = 0 * height;
	}







	//Pikachu getting caught by a pokeball
	if (
		pikachu.x+5 <= (pokeball1.x + 35) //going left to the pokeball
		&& pokeball1.x <= (pikachu.x + 90) // going right to the pokeball
		&& pikachu.y <= (pokeball1.y + 5) // going up to the pokeball
		&& pokeball1.y <= (pikachu.y + 110) //going down to the pokeball
	
	  ){
		GameOver()
	  }
	  
	  if (
		pikachu.x+5 <= (pokeball2.x + 35)
		&& pokeball2.x <= (pikachu.x + 90)
		&& pikachu.y <= (pokeball2.y + 5) //I chose 5 pixel because that's when pikachu touches (or close to touches) the pokeball
		&& pokeball2.y <= (pikachu.y + 110)
	
	  ){
		GameOver()
	  }
	
	  if (
		pikachu.x+5 <= (pokeball3.x + 35) 
		&& pokeball3.x <= (pikachu.x + 90)
		&& pikachu.y <= (pokeball3.y + 5)
		&& pokeball3.y <= (pikachu.y + 110)
	
	  ){
		GameOver()
	  };

  };
  
  

//   if (
// 	pikachu.x+5 <= (pokeball.x + 40)
// 	&& pokeball.x <= (pikachu.x + 60)
// 	&& pikachu.y <= (pokeball.y + 40)
// 	&& pokeball.y <= (pikachu.y + 60)

//   ){
// 	GameOver()
//   }

let GameOver = function (){
	alert ("Pikachu got caught in a pokeball...")
	died = true; 
	reset();
}

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (btReady) {
		ctx.drawImage(btImage, 0, 0);
		ctx.drawImage(btImage, 0, 1000 - 32);
	}
	
	if (blReady) {
		ctx.drawImage(blImage, 0, 0);
		ctx.drawImage(blImage, 1000-32, 0);
	} 

	if (pokeballReady){
		ctx.drawImage(pokeballImage, pokeball1.x, pokeball1.y);
		ctx.drawImage(pokeballImage, pokeball2.x, pokeball2.y);
		ctx.drawImage(pokeballImage, pokeball3.x, pokeball3.y);
	}

	if (pikachuReady) {
		// ctx.drawImage(pikachuImage, pikachu.x, pikachu.y);
		ctx.drawImage(pikachuImage, srcX, srcY, width, height, pikachu.x, pikachu.y, width, height);
	}



	if (ketchupReady) {
		ctx.drawImage(ketchupImage, ketchup.x, ketchup.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	if (ketchupsCaught === 5) {
		ctx.fillText("Pikachu is happy! ", 32, 32);
	}
	else {
	ctx.fillText("Ketchups found: " + ketchupsCaught, 32, 32);
	}
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	update(delta / 1000);
	render();
	then = now;

	if (ketchupsCaught < 5 && died == false) {
	//  Request to do this again ASAP
	requestAnimationFrame(main);
	}
};

// Cross-browser support for requestAnimationFrame
//var w = window;
//requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var then = Date.now();
reset();
main();