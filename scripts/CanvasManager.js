function CanvasManager()
{
    //reference to stage object

    var canvas;
    
    this.init = function(canvasID)
    {
        //Create a stage by getting a reference to the canvas
         this.stage = new createjs.Stage(canvasID);
         canvas = $("#" + canvasID);

    }

    //adds actor skin to stage
    this.addActor = function(child) {
        this.stage.addChild(child.skin);
    }

    //removes actor skin from stage
    this.removeActor = function(child) {
        this.stage.removeChild(child.skin);
    }

    //repaints
    this.update = function() { this.stage.update(); }

    //gets width and height of canvas that stage is drawn on
    this.getCanvasWidth = function () {return canvas.width();}
    this.getCanvasHeight = function () {return canvas.height();}
}

