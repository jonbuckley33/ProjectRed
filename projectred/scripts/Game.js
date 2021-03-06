/*
	Class : Game

	Instance of a "Game". Includes a hero, opponent, level, etc.

	Parameters:
		gameData
			.canvasManager - a reference to a canvasManager
			.heroMaker - a function that makes the hero
			.opponent - the opponent of the hero
			.level- the level
			.gameCompleted - callback for when game is over
			.camera - the camera for the game
			.assetQueue - the pipeline for content
*/
function Game(gameData)
{
	//get parameters
	var canvasManager = gameData.canvasManager;
	var world = gameData.level.world;
	var level = gameData.level;
	var opponent = gameData.opponent;
	var gameCompleted = gameData.gameCompleted;
	var assetQueue = gameData.assetQueue;
	
	//self reference
	var self = this;

	//enum of game states
	var GameStates = {
		INITIALIZING : 0,
		RUNNING : 1,
		PAUSED : 2,
		WON : 3,
		LOST : 4
	};

	var state = GameStates.INITIALIZING;

	//collision manager
	var collisionHandler;

	//hero controller
	var heroController;

	//array of actors in game
	var actors = [];
	//actors.push(opponent);

	//actors to delete on next update
	var toDestroyActors = [];

	//framerate
	var timeStep = 1.0/25;
	var iteration = 5;
	var velocitySteps = 2;

	var parallaxBackground;

	//camera instance
	var camera = new Camera(
		new b2Vec2(12, 6), 
		{width : 24, height: 12},
		level.bounds,
		{width : canvasManager.getCanvasWidth(),
		 height : canvasManager.getCanvasHeight()});
	level.camera = camera;

	var hero;

	this.getHero = function() {
		return hero;
	};

	function spawnHero(start) {
		hero = gameData.heroMaker(world, canvasManager, level.animations, 
			camera, assetQueue);

		//puts hero above spawn
		var startPos = start.body.GetBody().GetPosition();
		var heroPos = new b2Vec2(startPos.x, startPos.y - 3);
		hero.body.GetBody().SetPosition(heroPos);

		//update hero's skin and push onto array
		hero.update(camera);
		actors.push(hero);
	}

	function run(event) {
		switch (state) {
			case GameStates.INITIALIZING:
				sounds = new Sounds();
				//create and add background
				parallaxBackground = new ParallaxBackground(
					new createjs.Bitmap(assetQueue.getResult("background")), 
					camera);
				canvasManager.stage.addChild(parallaxBackground.img);
				parallaxBackground.update(camera);

				//make start and end
				var makeStartEnd = level.startEnd;
				var start = makeStartEnd.start(world, canvasManager, 
					level.animations, camera, assetQueue);
				var end = makeStartEnd.end(world, canvasManager, 
					level.animations, camera, assetQueue);
				end.classes.push("end");

				actors.push(start);
				actors.push(end);

				spawnHero(start);

				//finish making actors
				for (var i = 0; i < level.actors.length; i++) {
					var makeActor = level.actors[i];
					var actor = makeActor(world, canvasManager, 
						level.animations, camera, assetQueue);

					//push to stack
					actors.push(actor);
				}

				//construct collision handler
				collisionHandler = new CollisionHandler(self);
				world.SetContactListener(collisionHandler);

				heroController = new HeroControl(hero);

				//binds keys to movement functions
				Keyboard.bind({
					heroMove : heroController.heroMove,
					heroStop : heroController.heroStop
				}, camera);

				//add actors to stage
				for (var i = 0; i < actors.length; i++) {
					canvasManager.addActor(actors[i]);
				}

				state = GameStates.RUNNING;
				break;

			case GameStates.RUNNING:
				//follow hero
				camera.follow(hero);

				//update bg
				parallaxBackground.update(camera);

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
					actors[i].update(camera);
				}
				break;

			case GameStates.PAUSED:
				break;

			case GameStates.WON:
				gameCompleted();
				break;

			case GameStates.LOST:
				gameCompleted();
				break;
		}

		//repaint
		canvasManager.update();
	}

	this.start = function() {
		//start game loop
		createjs.Ticker.addEventListener("tick", run);
	};

	function pause() {
		state = GameStates.PAUSED;
	}

	this.pause = function() {
		pause();
	};

}

