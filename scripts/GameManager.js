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
	var converter = new Converter();

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
	var circle;
   	var circleBody;
   
   	var body;
         
   	this.convertFixture = function(body) {
		var shape = body.GetShape();
		var fixture;

		switch (shape.GetType())
		{
			case 0: //circle
				var circle = new createjs.Shape();
				circle.graphics.beginFill("red").drawCircle(0, 0, converter.gameToCanvas(shape.GetRadius()));
				fixture = circle;
				break;

			case 1: //rect
				var rect = new createjs.Shape();
				var vertices = shape.GetVertices();
				var width = vertices[2].x - vertices[0].x;
				var height = vertices[2].y - vertices[0].y;

				var widthPix = converter.gameToCanvas(width);
				var heightPix = converter.gameToCanvas(height);

				rect.graphics.beginFill("blue").drawRect(-widthPix/2, -heightPix/2, widthPix, heightPix);
				fixture = rect;
				break;

			default:
				break;
		}

		return fixture;
	};

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
        bodyDef.position.x = 1;
        bodyDef.position.y = 10;
        fixDef.shape = new b2PolygonShape;
        fixDef.shape.SetAsBox(5, 0.5);
        var ground = world.CreateBody(bodyDef).CreateFixture(fixDef);

        var groundShape = this.convertFixture(ground);
        var rectActor = new Actor(groundShape, ground);
        console.log(groundShape);
        cm.addChild(groundShape);
        
        actors[1] = rectActor;

        //create some objects
        circleBodyDef = new b2BodyDef;
        var circleFixDef = new b2FixtureDef;

        circleBodyDef.type = b2Body.b2_dynamicBody;               
		circleFixDef.shape = new b2CircleShape(
           	1 //radius
        );
            
        circleBodyDef.position.x =  1;
        circleBodyDef.position.y =  1;

        body = world.CreateBody(circleBodyDef).CreateFixture(circleFixDef);
        //body.SetPositionAndAngle(new b2Vec2(1,1), 0);
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

		/*circle = new createjs.Shape();
		circle.graphics.beginFill("red").drawCircle(0, 0, converter.gameToCanvas(1));
		circle.x = circleBodyDef.position.x;
		circle.y = circleBodyDef.position.y;*/

		var circle = this.convertFixture(body);
		cm.addChild(circle);

		var actor = new Actor(circle, body);
		this.actor = actor;
		actors[0] = actor;

		this.bodyDef = bodyDef;
		this.world = world;
		//var birdBMP = new createjs.Bitmap("public/images/bird.png");

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
				//world.DrawDebugData();
				//circle.x = converter.gameToCanvas(body.m_body.m_xf.position.x);
				//circle.y = converter.gameToCanvas(body.m_body.m_xf.position.y);
				world.ClearForces();

				//update positions of actors
				for (var i = 0; i < actors.length; i++)
				{
					//gets appropriate placement in canvas
					actors[i].update();
				}

				//console.log(circleBody.m_body.m_xf.position.y);
				//console.log(circle);

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