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

	//reference to CanvasManager instance (which contains the EaselJs stage)
	var canvasManager; 

	//reference to b2world (physics world)
	var world;

	//array of actors in game
	var actors = [];

	//framerate
	var timeStep = 1.0/25;
	var iteration = 5;
	var velocitySteps = 2;

	//state machine of game
	function run(event)
	{
		switch (state)
		{
			case gameState.INITIALIZING:
				//repaint
				canvasManager.stage.update();
				break;

			case gameState.RUNNING:
				//step world
				world.Step(event.delta / 1000, iteration, velocitySteps);
				//world.DrawDebugData();
				world.ClearForces();

				//update positions of actors
				for (var i = 0; i < actors.length; i++)
				{
					//gets appropriate placement in canvas
					actors[i].update();
				}

				//repaint
				canvasManager.stage.update();
				break;

			case gameState.PAUSED: 
				break;

			case gameState.GAME_OVER:
				break;
		};
	}

	var blackRect, logo, loadingImage;
	function showLoadingScreen(decalName) {
		blackRect = new createjs.Shape();
		blackRect.graphics.beginFill("white").drawRect(0, 0, canvasManager.getCanvasWidth(), canvasManager.getCanvasHeight());
		blackRect.x = blackRect.y = 0;
		canvasManager.stage.addChild(blackRect);

		logo = new createjs.Bitmap("images/" + decalName);
		logo.x = canvasManager.getCanvasWidth() / 2;
		logo.y = canvasManager.getCanvasHeight() / 2;
		canvasManager.stage.addChild(logo);

		/*loadingImage = new createjs.Bitmap("images/loading.gif");
		loadingImage.x = logo.x + 10;
		loadingImage.y = logo.y + 50;
		canvasManager.stage.addChild(loadingImage);*/

		canvasManager.stage.update();
	}

	function hideLoadingScreen() {
		canvasManager.stage.removeChild(logo);
		canvasManager.stage.removeChild(blackRect);

		canvasManager.stage.update();
	}

	var ball;
	function levelLoaded(levelActors) {
		//hideLoadingScreen();

		actors = levelActors;
		ball = actors[2];

		debug.log("level loaded...");

		//go!
		state = gameState.RUNNING;

		hideLoadingScreen();
		debug.log("game loop started.");
	}

	this.getBall = function() {
		return ball;
	};

	this.init = function(cm)
	{
		canvasManager = cm;
		
		// Define the world
		var gravity = new b2Vec2(0, 10);
		var doSleep = true;
			
		//generate the physics world
		world = new b2World(gravity, doSleep);
		this.world = world;

		showLoadingScreen("projectred.png");

		//start game loop
		createjs.Ticker.addEventListener("tick", run);

		//load the level
		LevelLoader.load("TestLevel.json", levelLoaded, world, canvasManager);
		
         //setup debug draw
         var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("mainCanvas").getContext("2d"));
			debugDraw.SetDrawScale(30.0);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
	};

	this.pause = function()
	{
		this.state = gameState.PAUSED;
	};
}