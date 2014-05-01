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

	var actors = [];
	var bodies = [];

	var createBird = function(skin) {
		var birdFixture = new b2FixtureDef;
		birdFixture.density = 1;
		birdFixture.restitution = 0.6;
		birdFixture.shape = new b2CircleShape(24 / SCALE);   // half of bird.png width divided by world scale for right size
		var birdBodyDef = new b2BodyDef;
		birdBodyDef.type = b2Body.b2_dynamicBody;
		birdBodyDef.position.x = skin.x / SCALE;  // divide skin x and y by box2d scale to get right position
		birdBodyDef.position.y = skin.y / SCALE;
		var bird = world.CreateBody(birdBodyDef);
		bird.CreateFixture(birdFixture);
		bodies.push(bird);
	}

	this.init = function(canvasManager, world)
	{
		this.canvasManager = canvasManager;
		this.world = world;

		console.log("canvas manager", canvasManager)

		//var birdBMP = new createjs.Bitmap("public/images/bird.png");

		var circle = new createjs.Shape();
	    circle.graphics.beginFill("red").drawCircle(0, 0, 40);
	    //Set position of Shape instance.
	    circle.x = circle.y = 50;

		this.canvasManager.stage.addChild(circle);
		this.canvasManager.stage.update();
		//createBird(birdBMP);

		//var actor = new Actor(circleBody);


		createjs.Ticker.addEventListener("tick", this.run);
	};

	var timeStep = 1.0/60;
	var iteration = 1;

	this.run = function()
	{
		switch (state)
		{
			case gameState.INITIALIZING:
				this.state = gameState.RUNNING;
				break;

			case gameState.RUNNING:
				this.world.Step(this.timeStep, iteration);

				this.canvasManager.stage.update();
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