function CanvasManager()
{
    //reference to stage object
    var stage;

    this.init = function(canvasID)
    {
        //Create a stage by getting a reference to the canvas
        this.stage = new createjs.Stage(canvasID);
        //Update stage will render next frame
        this.stage.update();
    }

    this.addChild = function(child) {
        this.stage.addChild(child);
    }

    this.update = function() { this.stage.update(); }
}

