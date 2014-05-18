function TestLevel() {

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


	this.actors = function(world, convertFixture)
	{
		//first there was Earth
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
	    var groundShape = convertFixture(ground);
	    
	    var groundActor = new Actor(groundShape, ground);

	    //then... there was circle
        var circleBodyDef = new b2BodyDef;
        var circleFixDef = new b2FixtureDef;

        circleBodyDef.type = b2Body.b2_dynamicBody;               
		circleFixDef.shape = new b2CircleShape(
           	1 //radius
        );
            
        circleBodyDef.position.x =  1;
        circleBodyDef.position.y =  1;

        var circleBody = world.CreateBody(circleBodyDef).CreateFixture(circleFixDef);
        var circle = convertFixture(circleBody);
		var circleActor = new Actor(circle, circleBody);

		return [groundActor, circleActor];
	}
	
}