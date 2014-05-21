function LevelLoader() {
	//mines level files for data and returns instance of level
}

var heroImageURL = "../images/exSpriteRun.png"

/*
	Function: animLoad

	sets up bitmap animation skin based on 
	JSON preferences

	Parameters: 

		URL - filepath
		frameW - frame width
		frameH - frame height
		anims - animations array 
		start - starting/default animation

	Returns:

		BitmapAnimation

*/

function animLoad (URL,frameW,frameH,anims,start){

	//Initialize Image
	var image = new Image();
	image.src = URL;

	//Configure animations in correct format for 
	//sprite sheet
	var animations = {};
	for (i = 0; i < anims.length; i++){
       animations[anims[i].name] = [anims[i].begin, anims[i].end]
    }

	//Setup Sprite Sheet
	var spriteSheet = new createjs.SpriteSheet({
		images: [image], 
		frames: {width: frameW, height: frameH, regX: frameW/2, regY: frameH/2}, 
		animations: animations
        });

	//creates animation skin object
	bmpAnimation = new createjs.BitmapAnimation(spriteSheet);

    //anim switch speed
    bmpAnimation.vX = 1;

	bmpAnimation.gotoAndPlay(anims[start].name);  


    return bmpAnimation;
}

var defaultDensity = 1.0;
var defaultFriction = 0.4;
var defaultColor = "blue";
var defaultRestitution = 0.1;

/*
	Function: hydrate

	sets up actor based on JSON actor definition

	Parameters: 

		actorDef - actor definition
		world - Box2D world
		cm - Canvas Manager

	Returns:

		Actor

*/
LevelLoader.hydrate = function(actorDef, world, cm,animations) {
	var bodyDef = new b2BodyDef;
	var fixDef = new b2FixtureDef;
	var skin = new createjs.Shape();
	
	//we can make these settable properties, but for now, we won't
	fixDef.restitution = defaultRestitution;

	//does graphics processing per actor
	if ("graphics" in actorDef){

		if ("type" in actorDef.graphics){
			if (actorDef.graphics.type == "shape"){
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

				}else{
					throw "NO ShapeDef"
				}
			}else{
				if ("animationDef" in actorDef.graphics){
					var anim = actorDef.graphics.animationDef;
					var start = 0;
					if (anim in animations){
						animDef = animations[anim]
						if ("startingAnim" in animDef) start = animDef.startingAnim
						skin = animLoad(animDef.filepath,animDef.frameWidth,animDef.frameHeight
										,animDef.animations,start);
						fixDef.shape = new b2PolygonShape;
						fixDef.shape.SetAsBox(Converter.canvasToGame(animDef.frameWidth/2)
											,Converter.canvasToGame(animDef.frameHeight/2));
					}else{
						throw "No animations defined"
					}

				}else{
					throw "NO AnimationDef"
				}

			}
		}else{
			throw "WTF is the type"
		}
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

	//get class information
	if ("classes" in actorDef) {
		actor.classes = actorDef.classes;  	
		//specifically, if is hero, set hero bool
		if ($.inArray("americanHero", actorDef.classes) > -1)
		{
			actor.isHero = true;
			actor.body.GetBody().SetFixedRotation(true);
		} 
	}

	return actor;
};

/*
	Function: loadStartEnd

	identifies the start and ends of a level, hydrating both of them

	Parameters:
		levelDef - the level definition, defined as a JSON object
		world - the physics world
		cm - the CanvasManager instance

	Returns:
		{start, end} - start is the start actor, end is the end actor

	See Also: 

		<LevelLoader.hydrate>
*/
function loadStartEnd(levelDef, world, cm) {
	if ("start" in levelDef && "end" in levelDef) {
		//hydrate the actors playing the start and end 
		var start = LevelLoader.hydrate(levelDef.start, world, cm),
			end = LevelLoader.hydrate(levelDef.end, world, cm);

		start.classes.push("start");
		end.classes.push("end");

		//return pair of them
		return {start : start, end : end};
	} else {
		throw "No start/end defined in level definition";
	}
}

var defaultGravity = new b2Vec2(0, 10);
var defaultDoSleep = true;

/*
	Function: load

	sets up level based on JSON then runs callback function

	Parameters: 

		fileName - file name
		callback - callback function
		cm - Canvas Manager

	Returns:

		void

*/

LevelLoader.load = function(fileName, callback, cm, camera)
{
	debug.log("loading level...");

	$.ajax({
		url : "levels/" + fileName,
		success : function(data) { 
			debug.log("retrieved level data")

			var level = JSON.parse(data);

			//get animations
			var animations;
			if ("animations" in level){
				animations = level.animations;
			}else throw "No animation library"


			//get gravity
			var gravity = ("gravity" in level) ? new b2Vec2(0, level.gravity) : defaultGravity;

			//generate the physics world
			var world = new b2World(gravity, defaultDoSleep);

			var actors = [];
			var hero;

			//gets beginning and ending of level
			var startEnd = loadStartEnd(level, world, cm);
			var start = startEnd.start,
				end = startEnd.end;

			actors.push(start); 
			actors.push(end);

			//populate static actors 
			if ("staticActors" in level) {
				for (var i = 0; i < level.staticActors.length; i++)
				{
					var actorDef = level.staticActors[i];
					var actor = LevelLoader.hydrate(actorDef, world, cm,animations);

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
					var actor = LevelLoader.hydrate(actorDef, world, cm,animations);

					//sets hero ref
					if (actor.isHero) {
						hero = actor;

						var startPos = start.body.GetBody().GetPosition();
						var heroPos = new b2Vec2(startPos.x, startPos.y - 3);
						//place hero above start
						hero.body.GetBody().SetPosition(heroPos);

						hero.update(camera);
					} 

					actors.push(actor);
				}
			} else {
				//uh oh
				throw "Level Improperly Defined";
			}

			callback({
				actors : actors,
				world : world,
				hero : hero
			})
		},

		error : function(data, textStatus) {
			throw "Level File Could Not Be Found or Read";
		}
	});
};

