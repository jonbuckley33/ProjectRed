function GameManager()
{
	//enum representing all of the game states
	var gameState = {
		INITIALIZING : {value : 0, name : "Initializing", code: "I"},
		RUNNING : {value : 1, name : "Running", code : "R"},
		PAUSED : {value : 2, name : "Paused", code : "P"},
		GAME_OVER : {value : 3, name : "Game Over", code : "G"}
	};

	//set the state initially to INITIALIZING
	var state = gameState.INITIALIZING;
	var canvasManager; 
	var world;
	var circle;

	var actors = [];
	var bodies = [];

	this.init = function(cm)
	{
		canvasManager = cm;
		
		// Define the world
		var gravity = new b2Vec2(0, -10);
		var doSleep = true;
			
		world = new b2World(gravity, doSleep);

		//var birdBMP = new createjs.Bitmap("public/images/bird.png");

		createjs.Ticker.addEventListener("tick", this.run);
	};

	//60 fps
	var timeStep = 1.0/60;
	var iteration = 1;

	//state machine of game
	this.run = function()
	{
		switch (state)
		{
			case gameState.INITIALIZING:
				state = gameState.RUNNING;
				break;

			case gameState.RUNNING:
				//step world
				world.Step(this.timeStep, iteration);

				//update positions of actors
				for (var i = 0; i < actors.length; i++)
				{
					//gets appropriate placement in canvas
					actors[i].update();
				}

				//repain
				canvasManager.stage.update();
				break;

			case gameState.PAUSED: 
				break;

			case gameState.GAME_OVER:
				break;
		};
	}

	this.pause = function()
	{
		this.state = gameState.PAUSED;
	};
}