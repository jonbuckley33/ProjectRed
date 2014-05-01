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

	// Box2d vars
	var b2Vec2 = Box2D.Common.Math.b2Vec2;
	var b2BodyDef = Box2D.Dynamics.b2BodyDef;
	var b2Body = Box2D.Dynamics.b2Body;
	var b2FixtureDef = Box2D.Dynamics.b2FixtureDef;
	var b2Fixture = Box2D.Dynamics.b2Fixture;
	var b2World = Box2D.Dynamics.b2World;
	var b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape;
	var b2CircleShape = Box2D.Collision.Shapes.b2CircleShape;
	var b2DebugDraw = Box2D.Dynamics.b2DebugDraw;

	var delayCounter = 0;

	/*var createBird = function(skin) {
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
	}*/



	this.init = function(CM)
	{
		canvasManager = CM;
		canvasManager.snapToPixel = true;
		setup.ticker();
		box2d.setup();
	};

	var setup = (function() {

		var ticker = function() {
			createjs.Ticker.setFPS(30);
			createjs.Ticker.addEventListener("tick", tickHandler);
		}

		return {
			ticker: ticker
		}
	})();

	/*var timeStep = 1.0/60;
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
	}*/

	this.pause = function()
	{
		this.state = gameState.PAUSED;
	};

	var box = (function() {
		var spawn = function(cx, cy, size) {
			boxBmp = new createjs.Bitmap("images/crate.png");
			boxBmp.scaleX = 50/256;
			boxBmp.scaleY = 50/256;
			boxBmp.x = cx;
			boxBmp.y = cy;
			boxBmp.regX = 25;
			boxBmp.regY = 25;
			boxBmp.snapToPixel = true;
			boxBmp.mouseEnabled = false;
			canvasManager.addChild(boxBmp);
			box2d.createRect(boxBmp, size, size);
		}

		return { spawn: spawn }
	})();

	var box2d = (function() {

		var SCALE = 30, STEP = 30, TIMESTEP = 1/STEP;

		var world;
		var prevTime = Date.now();
		var elapsedTime = 0;
		var bodiesToRemove = [];
		var actors = [];
		var bodies = [];

		var gravity = new b2Vec2(0, 10);

		var setup = function() {
			world = new b2World(gravity, true);
			addDebug();
			var floor = new b2FixtureDef;
			floorFixture.density = 1;
			floorFixture.restitution = 1;
			floorFixture.shape = new b2PolygonShape;
			floorFixture.shape.SetAsBox(550 / SCALE, 10 / SCALE);
			var floorBodyDef = new b2BodyDef;
			floorBodyDef.type = b2Body.b2_staticBody;
			floorBodyDef.position.x = -25 / SCALE;
			floorBodyDef.position.y = 509 / SCALE;
			var floor = world.CreateBody(floorBodyDef);
			floor.CreateFixture(floorFixture);
		}

		// box2d debugger - from luxanimals.com tutorial
		var addDebug = function() {
			var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(debugContext);
			debugDraw.SetDrawScale(SCALE);
			debugDraw.SetFillAlpha(0.7);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);
		}

		var actorObject = function(body, skin) {
			this.body = body;
			this.skin = skin;
			this.update = function() {
				this.skin.x = this.body.GetWorldCenter().x * SCALE;
				this.skin.y = this.body.GetWorldCenter().y * SCALE;
				this.skin.rotation = this.body.GetAngle() * (180 / Math.PI);
			}
			actors.push(this);
		}

		var createRect = function(skin, width, height) {
			var rectFixture = new b2FixtureDef;
			rectFixture.density = 1;
			rectFixture.restitution = 0.6;
			rectFixture.shape = new b2PolygonShape;
			rectFixture.shape.SetAsBox(width / SCALE, height / SCALE);
			var rectBodyDef = new b2BodyDef;
			rectBodyDef.type = b2Body.b2_dynamicBody;
			rectBodyDef.position.x = skin.x / SCALE;
			rectBodyDef.position.y = skin.y / SCALE;
			var rect = world.CreateBody(rectBodyDef);
			rect.CreateFixture(rectFixture);

			// assign actor
			var actor = new actorObject(rect, skin);
			rect.SetUserData(actor);  // set the actor as user data of the body so we can use it later: body.GetUserData()
			bodies.push(rect);
		}

		var update = function() {
			world.Step(TIMESTEP, 1);

			for (var i=0, l=actors.length; i<l; i++) {
				actors[i].update();
			}
		}

		return {
			setup: setup,
			createRect: createRect,
			update: update
		}

	})();

	var tickHandler = function() {
		box2d.update();
		canvasManager.update();

		delayCounter++;
		if (delayCounter == 10) {
			delayCounter = 0;
			box.spawn();
		}
	}
}