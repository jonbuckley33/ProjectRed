function CanvasManager()
{
    //reference to stage object

    var canvas;
    var imgSpriteRun;
    this.init = function(canvasID)
    {
        //Create a stage by getting a reference to the canvas
         this.stage = new createjs.Stage(canvasID);
         canvas = $("#" + canvasID);
        

        // imgSpriteRun = new Image();

        // imgSpriteRun.src = "../images/exSpriteRun.png";


        // var spriteSheet = new createjs.SpriteSheet({
        //     images: [imgSpriteRun], 
        //     frames: {width: 64, height: 64, regX: 32, regY: 32}, 
        //     animations: {    
        //         walk: [0, 9, "walk"]
        //     }
        // });

        // bmpAnimation = new createjs.BitmapAnimation(spriteSheet);

        // bmpAnimation.gotoAndPlay("walk"); 

        // bmpAnimation.direction = 160;
        // bmpAnimation.vX = 4;
        // bmpAnimation.x = 400;
        // bmpAnimation.y = 320;

        // /*//Create a Shape DisplayObject.
        // circle = new createjs.Shape();
        // circle.graphics.beginFill("red").drawCircle(0, 0, 40);
        // //Set position of Shape instance.
        // circle.x = circle.y = 100;
        // //Add Shape instance to stage display list.
        // this.stage.addChild(circle);
        // //Update stage will render next frame
        // this.stage.update();*/

        // bmpAnimation.currentFrame = 0;
        // this.stage.addChild(bmpAnimation);

    }

    //adds actor skin to stage
    this.addActor = function(child) {
        this.stage.addChild(child.skin.getSkin());
    }

    //removes actor skin from stage
    this.removeActor = function(child) {
        this.stage.removeChild(child.skin.getSkin());
    }

    //repaints
    this.update = function() { this.stage.update(); }

    //gets width and height of canvas that stage is drawn on
    this.getCanvasWidth = function () {return canvas.width();}
    this.getCanvasHeight = function () {return canvas.height();}
}

