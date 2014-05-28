function Skin(camera){

	this.camera = camera;

	//shape def or animation def
	var typeDef;

	//Shape properties
	var shapeType;
	var shapeRadius;
	var shapeWidth;
	var shapeHeight;
	var shape;

	//Animation properties
	var frameWidth;
	var frameHeight;
	var filePath;
	var startingAnim;
	var animations;
	var image;
	var sprite;
	var charWidth;
	var charHeight;


	//General Properties

	var x = 100;
	var y = 100;
	var rotation =0;
	var xScale =1;
	var yScale = 1;
	var xSize = 0;
	var ySize = 0;
	var radSize =0;
	var skin;

	this.getType = function(){
		return typeDef;
	}

	this.setType = function(type){
		typeDef = type;
	}

	this.getShape = function(){
		return shapeType;
	}


	this.loadCircle= function(radius,color){
		shape = new createjs.Shape();
		var coord = this.camera.worldToScreen(new b2Vec2(radius,0));
		shapeRadius = coord.x;
		shape.graphics.beginFill(color).drawCircle(0, 0, shapeRadius);
		radSize = radius;
		skin = shape;				
	}

	this.loadRect= function(width,height,color){
		shape = new createjs.Shape();
		var coord = this.camera.worldToScreen(new b2Vec2(width,height));
		shapeWidth = coord.x;
		shapeHeight = coord.y;
		xSize = width;
		ySize = height;
		shape.graphics.beginFill(color).drawRect(-shapeWidth/2, -shapeHeight/2, shapeWidth,shapeHeight);
		skin = shape;
	}
	this.setPosition = function(xPosition,yPosition){
		var coord = this.camera.worldToScreen(new b2Vec2(xPosition,yPosition));
		x = coord.x;
		y = coord.y;
		if (typeDef == "shape"){
			shape.x = x;
			shape.y = y;
		}else{
			sprite.x = x;
			sprite.y = y;
		}
		//this.getSkin();
	}

	this.setRotation = function(rot){
		rotation = rot;
		if(typeDef == "shape"){
			shape.rotation = rotation;
		}else{
			sprite.rotation = rotation;
		}
		this.getSkin();
	}


	this.setSize = function(width,height){
		if(typeDef == "shape"){
			shape.scaleX = xScale;
			shape.scaleY = yScale;
		}else{
			var widthScale = width/xSize;
			var heightScale = height/ySize;
			xSize = width;
			ySize = height;
			xScale = xScale * widthScale;
			yScale = yScale * heightScale;
			sprite.scaleX = xScale;
			sprite.scaleY = yScale;
		}
		this.getSkin(); 
	}

	this.setScale = function(scale){
		xScale *= scale;
		yScale *= scale;
		if(typeDef == "shape"){
			shape.scaleX = xScale;
			shape.scaleY = yScale;
		}else{
			sprite.scaleX = xScale;
			sprite.scaleY = yScale;
		}
		this.getSkin(); 
	}

	this.loadAnimation = function(w,h,path,start,anims,sizeW,sizeH){
		frameWidth = w;
		frameHeight = h;
		xSize = frameWidth;
		ySize = frameHeight;
		filePath = path;
		startingAnim = start;
		animations = anims;

		image = new Image();
		image.src = path;

		animations = {};
		for (i = 0; i < anims.length; i++){
       		animations[anims[i].name] = [anims[i].begin, anims[i].end]
    	}

    	var spriteSheet = new createjs.SpriteSheet({
			images: [image], 
			frames: {width: frameWidth, height: frameHeight, regX: frameWidth/2, regY: frameHeight/2}, 
			animations: animations
        });

        sprite = new createjs.Sprite(spriteSheet);

        sprite.vX = 1;

        this.setSize(sizeW,sizeH);
        skin = sprite;
		return sprite;

	}

	this.getAnimation = function(){
		return sprite.currentAnimation;
	}

	this.getSkin = function(){
		if (typeDef == "shape")skin = shape;
		else skin = sprite;
		return skin;
	}

	this.getSprite = function(){
		return sprites;
	}

	this.setAnimation = function(anim){
		sprite.gotoAndPlay(anim); 
		this.getSkin(); 
	}



}


