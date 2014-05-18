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
	var circleBodyDef;

	var actors = [];
	var bodies = [];

	var  	b2Vec2 = Box2D.Common.Math.b2Vec2
        ,	b2BodyDef = Box2D.Dynamics.b2BodyDef
        ,	b2Body = Box2D.Dynamics.b2Body
        ,	b2FixtureDef = Box2D.Dynamics.b2FixtureDef
        ,	b2Fixture = Box2D.Dynamics.b2Fixture
        ,	b2World = Box2D.Dynamics.b2World
        ,	b2MassData = Box2D.Collision.Shapes.b2MassData
        ,	b2PolygonShape = Box2D.Collision.Shapes.b2PolygonShape
        ,	b2CircleShape = Box2D.Collision.Shapes.b2CircleShape
        ,	b2DebugDraw = Box2D.Dynamics.b2DebugDraw
        ;

	var world;
   
   	var body;
         
	this.init = function(cm)
	{
		canvasManager = cm;
		
		// Define the world
		var gravity = new b2Vec2(0, 10);
		var doSleep = true;
			
		world = new b2World(gravity, doSleep);

		var fixDef = new b2FixtureDef;
        fixDef.density = 1.0;
        fixDef.friction = 0.5;
        fixDef.restitution = 0.2;
        
        var bodyDef = new b2BodyDef;
         
        //create ground
        bodyDef.type = b2Body.b2_staticBody;
        bodyDef.position.x = 100;
        bodyDef.position.y = 300;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(30, 0.5);
        world.CreateBody(bodyDef).CreateFixture(fixDef);

        //create some objects
        circleBodyDef = new b2BodyDef;
        var circleFixDef = new b2FixtureDef;

        circleBodyDef.type = b2Body.b2_dynamicBody;               
		circleFixDef.shape = new b2CircleShape(
           	1 //radius
        );
            
        circleBodyDef.position.x =  100;
        circleBodyDef.position.y =  10;
        body = world.CreateBody(circleBodyDef).CreateFixture(circleFixDef);
        this.body = body;
        this.circleBodyDef = circleBodyDef;

         //setup debug draw
         var debugDraw = new b2DebugDraw();
			debugDraw.SetSprite(document.getElementById("mainCanvas").getContext("2d"));
			debugDraw.SetDrawScale(30.0);
			debugDraw.SetFillAlpha(0.3);
			debugDraw.SetLineThickness(1.0);
			debugDraw.SetFlags(b2DebugDraw.e_shapeBit | b2DebugDraw.e_jointBit);
			world.SetDebugDraw(debugDraw);

		this.bodyDef = bodyDef;
		this.world = world;
		//var birdBMP = new createjs.Bitmap("public/images/bird.png");

		circle = new createjs.Shape();
		circle.graphics.beginFill("red").drawCircle(0, 0, 50);
		circle.x = 100;
		circle.y = 100;
		cm.stage.addChild(circle)
		createjs.Ticker.addEventListener("tick", this.run);
	};

	//60 fps
	var timeStep = 1.0/10;
	var iteration = 10;
	var velocitySteps = 10;

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
				world.Step(timeStep, iteration, velocitySteps);
				circle.x = body.m_body.m_xf.position.x;
				circle.y = body.m_body.m_xf.position.y;
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

	this.pause = function()
	{
		this.state = gameState.PAUSED;
	};
}