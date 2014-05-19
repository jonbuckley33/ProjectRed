function LevelLoader() {
	//mines level files for data and returns instance of level
}

var heroImageURL = "../images/exSpriteRun.png"


function animLoad (URL,frameW,frameH){

	//Initialize Image
	var image = new Image();
	image.src = URL;

	//Setup Sprite Sheet
	var spritesheet = new createjs.SpriteSheet({
            images: [image], 
            frames: {width: frameW, height: frameH, regX: frameW/2, regY: frameH/2}, 
            animations: {  
            	//we can define multiple animations here   
                anim1: [0, 9, "walk"]
            }
        });

	//creates animation skin object
    bmpAnimation = new createjs.BitmapAnimation(spriteSheet);

    //this will run the specified animation 
    //bmpAnimation.gotoAndPlay("walk"); 

    //anim switch speed
    bmpAnimation.vX = 4;

    return bmpAnimation;
}

var defaultDensity = 1.0;
var defaultFriction = 0.1;
var defaultColor = "blue";
var defaultRestitution = 0.2;


LevelLoader.hydrate = function(actorDef, world, cm) {
	var bodyDef = new b2BodyDef;
	var fixDef = new b2FixtureDef;
	var skin = new createjs.Shape();
	
	//we can make these settable properties, but for now, we won't
    fixDef.restitution = defaultRestitution;

<<<<<<< HEAD
    if ("graphics" in actorDef){

    	if ("type" in actorDef.graphics){
    		if (actorDef.graphics.type = "shape"){
    			if ("shapeDef" in actorDef.graphics){
    				var shape = actorDef.graphics.shapeDef;
    				var color = ("color" in shape) ? shape.color : defaultColor;
				switch (shape.type) 
				{
					case "circ":
						fixDef.shape = new b2CircleShape(
		        	   	shape.radius //radius
		        		); 

					skin.graphics.beginFill(color).drawCircle(0, 0, Converter.gameToCanvas(shape.radius));
					break;

					case "rect":
						fixDef.shape = new b2PolygonShape;
	   					fixDef.shape.SetAsBox(shape.width / 2, shape.height / 2);

	   					var widthPix = Converter.gameToCanvas(shape.width);
						var heightPix = Converter.gameToCanvas(shape.height);

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

    			}else{
    				throw "NO ShapeDef"
    			}
    		}else{
    			if ("animationDef" in actorDef.graphics){
    				var anim = actorDef.graphics.animationDef;
    				skin = animLoad(anim.filepath,anim.frameWidth,anim.frameHeight);
    			}else{
    				throw "NO AnimationDef"
    			}

    		}
    	}else{
    		throw "WTF is the type"
    	}


    



=======
>>>>>>> FETCH_HEAD
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

		if ("mass" in actorDef) {
			fixDef.density = actorDef.density;
		} else {
			fixDef.density = defaultDensity;
		}

	} else {
		bodyDef.type = b2Body.b2_staticBody;
	}	

	//friction, default .1
	if ("friction" in actorDef) {
		fixDef.friction = actorDef.friction;
	} else {
		fixDef.friction = defaultFriction;
	}

	var body = world.CreateBody(bodyDef).CreateFixture(fixDef);
	var actor = new Actor(skin, body);

    if ("class" in actorDef) {
  		actor.class = actorDef.class;  	
  		if (actor.class == "americanHero")
  		{
  			actor.isHero = true;
  		} 
    }

	return actor;
};

var defaultGravity = new b2Vec2(0, 10);
var defaultDoSleep = true;

LevelLoader.load = function(fileName, callback, cm)
{
	debug.log("loading level...");

	$.ajax({
		url : "levels/" + fileName,
		success : function(data) { 
			debug.log("retrieved level data")
			
			//generate the physics world
			var world = new b2World(defaultGravity, defaultDoSleep);

			var level = JSON.parse(data);

			var actors = [];
			var hero;

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

					//sets hero ref
					if (actor.isHero) {
						hero = actor;
					} 

					actors.push(actor);
				}
			} else {
				//uh oh
				throw "Level Improperly Defined";
			}

			setTimeout(function() {callback({
				actors : actors,
				world : world,
				hero : hero
			})}, 4000);
		},

		error : function(data, textStatus) {
			throw "Level File Could Not Be Found or Read";
		}
	});
};

