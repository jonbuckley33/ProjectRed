function LevelLoader() {
	//mines level files for data and returns instance of level
}

var heroImageURL = "../images/exSpriteRun.png"



var defaultDensity = 1.0;
var defaultFriction = 0.4;
var defaultColor = "blue";
var defaultRestitution = 0.1;

LevelLoader.MakeHydrate = function(actorDef) {
	return function(world, cm, animations, camera) {
		return LevelLoader.hydrate(actorDef, world, cm, animations, camera);
	};
};


/*
	Function: hydrate

	sets up actor based on JSON actor definition

	Parameters: 

		world - Box2D world
		cm - Canvas Manager
		camera - camera instance

	Returns:

		Actor

*/
LevelLoader.hydrate = function(actorDef, world, cm, animations, camera) {
	var bodyDef = new b2BodyDef;
	var fixDef = new b2FixtureDef;
	var skin = new Skin();
	
	//we can make these settable properties, but for now, we won't
	fixDef.restitution = defaultRestitution;

	//does graphics processing per actor
	if ("graphics" in actorDef){

		if ("type" in actorDef.graphics){
			skin.setType(actorDef.graphics.type);
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

						skin.loadCircle(camera.worldToScreenSize(shape.radius),
							color);
						break;

						case "rect":
						fixDef.shape = new b2PolygonShape;
						fixDef.shape.SetAsBox(shape.width / 2, shape.height / 2,color);
						skin.loadRect(camera.worldToScreenSize(shape.width),
							camera.worldToScreenSize(shape.height),color);
						break;

						default: 
						//unit rect
						fixDef.shape = new b2PolygonShape;
						fixDef.shape.SetAsBox(1, 1);
						skin.loadRect(camera.worldToScreenSize(1),
							camera.worldToScreenSize(1),color);
						break;
					}

				}else{
					throw "NO ShapeDef"
				}
			}else{
				if ("animationDef" in actorDef.graphics){
					var anim = actorDef.graphics.animationDef;
					var start = 0;
					var sizeW = 1;
					var sizeH = 1;
					if (anim in animations){
						animDef = animations[anim]
						if ("startingAnim" in animDef) start = animDef.startingAnim
						if ("width" in actorDef) sizeW = actorDef.width;
						if ("height" in actorDef) sizeH = actorDef.height;
						
						skin.loadAnimation(animDef.frameWidth,animDef.frameHeight,animDef.filepath
										  ,start,animDef.animations,sizeW,sizeH);

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

	 	skin.setPosition(actorDef.position.x,actorDef.position.y);
	 } else {
	 	//default to placing in top left
	 	bodyDef.position.x = 0;
	 	bodyDef.position.y = 0;

	 	skin.setPosition({x : 0, y: 0});
	 }

	 //extract rotation
	 if ("rotation" in actorDef) {
	 	bodyDef.angle = actorDef.rotation * (Math.PI/180);
	 	skin.setRotation(actorDef.rotation);
	 } else {
	 	//default to no rotation
	 	bodyDef.angle = 0;
	 	skin.setRotation(0);
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
function loadStartEnd(levelDef) {
	if ("start" in levelDef && "end" in levelDef) {
		//hydrate the actors playing the start and end 

		var start = LevelLoader.MakeHydrate(levelDef.start),
			end = LevelLoader.MakeHydrate(levelDef.end);

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

			var level = data;//JSON.parse(data);

			//get animations
			var animations;
			if ("animations" in level){
				animations = level.animations;
			} else {
				throw "No animation library"	
			} 

			//loads manifest file string for preloading
			var manifestFile = ("manifestFile" in level) ? 
				level.manifestFile : undefined;

			//get stage bounds
			var levelBounds = ("levelBounds" in level) ? level.levelBounds : {
				"left" : 0, 
				"right" : 30,
				"top" : 0,
				"bottom" : 15
			};

			//get gravity
			var gravity = ("gravity" in level) ? new b2Vec2(0, level.gravity) : defaultGravity;

			//generate the physics world
			var world = new b2World(gravity, defaultDoSleep);

			var actors = [];
			var hero;

			//gets beginning and ending of level
			var startEnd = loadStartEnd(level);

			//populate static actors 
			if ("staticActors" in level) {
				for (var i = 0; i < level.staticActors.length; i++)
				{
					var actorDef = level.staticActors[i];
					var actor = LevelLoader.MakeHydrate(actorDef);

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
					var actor = LevelLoader.MakeHydrate(actorDef);

					actors.push(actor);
				}
			} else {
				//uh oh
				throw "Level Improperly Defined";
			}

			callback({
				actors : actors,
				world : world,
				bounds : levelBounds,
				manifestFile : manifestFile,
				startEnd : startEnd,
				animations : animations
			});
		},

		error : function(data, textStatus) {
			throw "Level File Could Not Be Found or Read";
		}
	});
};

