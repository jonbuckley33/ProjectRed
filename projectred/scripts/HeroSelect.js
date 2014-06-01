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

    	var constructHero = function(world, canvasManager, animations, camera, assetQueue) {
    		var heroDef = {
    			fixed : false,
    			graphics : {
    				type : "animation",
    				animationDef : "hero"
    			},
    			width : 50,
    			height : 50
    		};

    		var hero = LevelLoader.hydrate(heroDef, world, canvasManager, animations,
    			camera, assetQueue);

    		//make hero-y
    		hero.body.GetBody().SetFixedRotation(true);
			hero.isHero = true;
			hero.classes.push("americanHero");

			return hero;
    	}
    	
		functions.continueFunction(constructHero);
	};

	this.hide = function() {

	};
}