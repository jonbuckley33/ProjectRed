function LevelLoader() {
	//mines level files for data and returns instance of level
}

var heroImageURL = "../images/exSpriteRun.png"


function animLoad (URL,frameW,frameH){
	var image = new Image();
	image.src = URL;

	var spritesheet = new createjs.SpriteSheet({
            images: [image], 
            frames: {width: frameW, height: frameH, regX: frameW/2, regY: frameH/2}, 
            animations: {    
                anim1: [0, 9, "walk"]
            }
        });


    bmpAnimation = new createjs.BitmapAnimation(spriteSheet);

    bmpAnimation.gotoAndPlay("walk"); 

    bmpAnimation.vX = 4;

    return bmpAnimation;

}

LevelLoader.hydrate = function(actorDef, world, cm) {
	var bodyDef = new b2BodyDef;
	var fixDef = new b2FixtureDef;
	var skin = new createjs.Shape();
	
	//we can make these settable properties, but for now, we won't
	fixDef.density = 1.0;
    fixDef.friction = 0.5;
    fixDef.restitution = 0.2;

    if("americanHero" in actorDef){

    }


    //extract position
    if ("position" in actorDef) {
    	bodyDef.position.x = actorDef.position.x;
	    bodyDef.position.y = actorDef.position.y;

	    skin.x = Converter.gameToCanvas(actorDef.position.x);
	    skin.y = Converter.gameToCanvas(actorDef.position.y);
    } else {
    	//default to placing in top left
    	bodyDef.position.x = 0;
    	bodyDef.position.y = 0;

	    skin.x = Converter.gameToCanvas(0);
	    skin.y = Converter.gameToCanvas(0);
    }

    //extract rotation
    if ("rotation" in actorDef) {
    	bodyDef.angle = actorDef.rotation * (Math.PI/180);
    	skin.rotation = actorDef.rotation;
    } else {
    	//default to no rotation
    	bodyDef.angle = 0;
    	skin.rotation = 0;
    }
    
    //define the body to be static or dynamic
	if (!("fixed" in actorDef) || !actorDef.fixed) {
		//the def doesn't contain whether fixed is defined, or it is set to false
		//either way, we create a dynamic body here

		bodyDef.type = b2Body.b2_dynamicBody;
	} else {
		bodyDef.type = b2Body.b2_staticBody;
	}	
	
	if ("shape" in actorDef) {

		var color = ("color" in actorDef.shape) ? actorDef.shape.color : "red";

		switch (actorDef.shape.type) 
		{
			case "circ":
				fixDef.shape = new b2CircleShape(
		           	actorDef.shape.radius //radius
		        ); 

				skin.graphics.beginFill(color).drawCircle(0, 0, Converter.gameToCanvas(actorDef.shape.radius));
				break;

			case "rect":
				fixDef.shape = new b2PolygonShape;
	   			fixDef.shape.SetAsBox(actorDef.shape.width / 2, actorDef.shape.height / 2);

	   			var widthPix = Converter.gameToCanvas(actorDef.shape.width);
				var heightPix = Converter.gameToCanvas(actorDef.shape.height);

				skin.graphics.beginFill(color).drawRect(-widthPix/2, -heightPix/2, widthPix, heightPix);
				break;

			default: 
				//unit rect
				fixDef.shape = new b2PolygonShape;
	   			fixDef.shape.SetAsBox(1, 1);

	   			var widthPix = Converter.gameToCanvas(1);
				var heightPix = Converter.gameToCanvas(1);

				skin.graphics.beginFill(color).drawRect(-widthPix/2, -heightPix/2, widthPix, heightPix);
				break;
		}
	} else {
		//default to unit rect
		fixDef.shape = new b2PolygonShape;
	   	fixDef.shape.SetAsBox(1, 1);

	   	var widthPix = Converter.gameToCanvas(1);
		var heightPix = Converter.gameToCanvas(1);

		skin.graphics.beginFill("blue").drawRect(-widthPix/2, -heightPix/2, widthPix, heightPix);
	}

	var body = world.CreateBody(bodyDef).CreateFixture(fixDef);
	var actor = new Actor(skin, body);

	cm.addActor(actor);

	return actor;
};

LevelLoader.load = function(fileName, callback, world, cm)
{
	debug.log("loading level...");

	$.ajax({
		url : "levels/" + fileName,
		success : function(data) { 
			debug.log("retrieved level data")
			var level = JSON.parse(data);

			var actors = [];

			//populate static actors 
			if ("staticActors" in level) {
				for (var i = 0; i < level.staticActors.length; i++)
				{
					var actorDef = level.staticActors[i];
					var actor = LevelLoader.hydrate(actorDef, world, cm);

					actors.push(actor);
				}
			} else {
				//uh oh
				throw "Level Improperly Defined";
			}

			//populate dynamic actors
			if ("dynamicActors" in level) {
				for (var i = 0; i < level.dynamicActors.length; i++)
				{
					var actorDef = level.dynamicActors[i];
					var actor = LevelLoader.hydrate(actorDef, world, cm);

					actors.push(actor);
				}
			} else {
				//uh oh
				throw "Level Improperly Defined";
			}

			setTimeout(function() {callback(actors)}, 4000);
		},

		error : function(data, textStatus) {
			alert("Failed to read data: " + textStatus)
		}
	});
};

