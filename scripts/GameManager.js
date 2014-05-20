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

	//protagonist
	var hero;

	//array of actors in game
	var actors = [];

	//actors to delete on next update
	var toDestroyActors = [];

	//framerate
	var timeStep = 1.0/25;
	var iteration = 5;
	var velocitySteps = 2;

	var loaded = 0;
	var loadmask;
	var loadbg;

	//state machine of game
	function run(event)
	{
		switch (state)
		{
			case gameState.INITIALIZING:
				//repaint
				loaded++;

				var percent = loaded/80;

				loadmask.graphics.beginFill("#000000").drawRect(0, 0, percent*125, 30);

				loadmask.cache(0, 0, 125, 30);

				loadingAnim.filters = [
					new createjs.AlphaMaskFilter(loadmask.cacheCanvas)
				];

				loadingAnim.cache(0, 0, 125, 130);

				canvasManager.update();
				break;

			case gameState.RUNNING:
				//kill the old actors
				for (var i = 0; i < toDestroyActors.length; i++) {
					world.DestroyBody(toDestroyActors[i].body);
				}
				toDestroyActors = [];

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
				canvasManager.update();
				break;

			case gameState.PAUSED: 
				//repaint
				canvasManager.update();
				break;

			case gameState.GAME_OVER:
				break;
		};
	}

	var blackRect, logo, loadingAnim;
	function showLoadingScreen(decalName) {
		// fill screen with white rectangle
		blackRect = new createjs.Shape();
		blackRect.graphics.beginFill("white").drawRect(0, 0,
			canvasManager.getCanvasWidth(), canvasManager.getCanvasHeight());
		blackRect.x = blackRect.y = 0;
		canvasManager.stage.addChild(blackRect);

		logo = new createjs.Bitmap("images/" + decalName);
		logo.regX = 100;
		logo.regY = 25;
		logo.x = canvasManager.getCanvasWidth() / 2;
		logo.y = canvasManager.getCanvasHeight() / 2;
		canvasManager.stage.addChild(logo);

		loadbg = new createjs.Bitmap("public/images/load_bg.jpg");

		var loadImg = new Image();
		loadImg.src = "public/images/loadbar.png";

		var loadSheet = new createjs.SpriteSheet({
			images: [loadImg],
			frames: {width: 125, height: 30, regX: 0, regY: 0},
			animations: {
				load: [0, 16, "load"]
			}
		});
		loadingAnim = new createjs.Sprite(loadSheet, "load");

		loadingAnim.x = logo.x - 62;
		loadingAnim.y = logo.y + 35;
		loadingAnim.gotoAndPlay("load");

		loadbg.x = loadingAnim.x;
		loadbg.y = loadingAnim.y;

		canvasManager.stage.addChild(loadbg);
		canvasManager.stage.addChild(loadingAnim);

		loadmask = new createjs.Shape();

		canvasManager.update();
	}

	function hideLoadingScreen() {
		canvasManager.stage.removeChild(logo);
		canvasManager.stage.removeChild(blackRect);
		canvasManager.stage.removeChild(loadingAnim)
		canvasManager.stage.removeChild(loadmask);
		canvasManager.stage.removeChild(loadbg);

		canvasManager.update();
	}

	var testActor;
	function levelLoaded(levelData) {
		//specific ref to actors
		actors = levelData.actors;

		//specific ref to hero
		hero = levelData.hero;

		//ref to world generated in levelData
		world = levelData.world;
		world.SetContactListener(CollisionHandler);

		//cycle through actors and add them to the canvas
		hideLoadingScreen();

		for (var i = 0; i < actors.length; i++) {
			canvasManager.addActor(actors[i]);
		}

		testActor = actors[1];
		debug.log("level loaded...");

		//go!
		state = gameState.RUNNING;

		hideLoadingScreen();
		debug.log("game loop started.");
	}

	this.getWorld = function () {
		return world;
	};

	this.getTestActor = function() {
		return testActor;
	};

	function heroMove(dirX,dirY)
	{
		hero.body.GetBody().ApplyForce(new b2Vec2(dirX*100,dirY*500),hero.body.GetBody().GetWorldCenter());
	}

	this.removeActor = function(actor) {
		//clear the skin from the stage
		canvasManager.removeActor(actor);

		//remove from update list, and push onto destroy list
		var index = actors.indexOf(actor);
		if (index > -1) {
    		actors.splice(index, 1);
		}

		//delete body later
		toDestroyActors.push(actor);
	};

	this.init = function(cm)
	{
		canvasManager = cm;

		showLoadingScreen("projectred.png");

		//start game loop
		createjs.Ticker.addEventListener("tick", run);

		//load the level
		LevelLoader.load("TestLevel.json", levelLoaded, canvasManager);

 		Keyboard.bind(heroMove);

         //setup debug draw
         var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("mainCanvas").getContext("2d"));
			debugDraw.SetDrawScale(30.0);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);

	};

	//toggles game paused, or not
	this.pause = function()
	{
		if (state == gameState.PAUSED) {
			state = gameState.RUNNING;
		} else if (state == gameState.RUNNING) {
			state = gameState.PAUSED;
		}
	};
}