function Skin(){
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
		shape.graphics.beginFill(color).drawCircle(0, 0, radius);
		radSize = radius;
		this.setType("shape");
		skin = shape;				
	}

	this.loadRect= function(width,height,color){
		shape = new createjs.Shape();
		xSize = width;
		ySize = height;
		this.setType("shape");
		shape.graphics.beginFill(color).drawRect(-width/2, -height/2,
			width, height);
		skin = shape;
	}
	this.setPosition = function(screenPos){
		if (typeDef == "shape"){
			shape.x = screenPos.x;
			shape.y = screenPos.y;
		}else{
			sprite.x = screenPos.x;
			sprite.y = screenPos.y;
		}
		this.updateSkin();
	}

	this.setRotation = function(rot){
		rotation = rot;
		if(typeDef == "shape"){
			shape.rotation = rotation;
		}else{
			sprite.rotation = rotation;
		}
		this.updateSkin();
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
		this.updateSkin(); 
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
		this.updateSkin(); 
	}

	this.loadAnimation = function(fWidth, fHeight, UID,assetQueue,start,anims){
		startingAnim = start;
		animations = anims;

		//set size of actor
        frameWidth = fWidth;
		frameHeight = fHeight;
		xSize = frameWidth;
		ySize = frameHeight;

		//get animation resource
		image = assetQueue.getResult(UID);

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

        //this.setScale(scale);
        skin = sprite;
		return sprite;
	}

	this.getAnimation = function(){
		return sprite.currentAnimation;
	}

	/*
		Function : updateSkin

		updates the underlying skin object
	*/
	this.updateSkin = function() {
		if (typeDef == "shape") {
			skin = shape;
		} else {
			skin = sprite;
		}
	}

	this.getSkin = function(){
		this.updateSkin();

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


