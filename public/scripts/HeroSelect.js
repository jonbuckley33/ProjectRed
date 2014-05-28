/*
	Function : HeroSelect

	user picks hero from here

	Parameters:
		canvasManager - reference to the canvas manager
		functions - list of callback functions
*/
function HeroSelect(canvasManager, functions) {
	this.show = function() {
		var bodyDef = new b2BodyDef;
		var fixDef = new b2FixtureDef;

		fixDef.shape = new b2PolygonShape;
		fixDef.shape.SetAsBox(.5, .5);

		
		//skin.graphics.beginFill("red").drawRect(-widthPix/2, -heightPix/2,
		//	 widthPix, heightPix);

		//default to placing in top left
    	bodyDef.position.x = 2;
    	bodyDef.position.y = 2;

    	bodyDef.type = b2Body.b2_dynamicBody;

    	var constructHero = function(level) {
    		var skin = new Skin(level.camera);
    		skin.loadRect(1,1,"red");
    		skin.setPosition(0,0);
			skin.setRotation(0);

			//skin.x = Converter.gameToCanvas(0);
    		//skin.y = Converter.gameToCanvas(0);


    		var body = level.world.CreateBody(bodyDef).CreateFixture(fixDef);
			var hero = new Actor(skin, body);
			
			hero.isHero = true;
			hero.classes.push("americanHero");

			return hero;
    	}
    	
		functions.continueFunction(constructHero);
	};

	this.hide = function() {

	};
}