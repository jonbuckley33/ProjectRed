function CanvasManager(canvasID)
{
    //reference to stage object
    this.canvas = $("#" + canvasID);
    this.stage = new createjs.Stage(canvasID);
    this.stage.enableMouseOver(10);

  //adds actor skin to stage
    this.addActor = function(child) {
        this.stage.addChild(child.skin.getSkin());
    };

    //removes actor skin from stage
    this.removeActor = function(child) {
        this.stage.removeChild(child.skin.getSkin());
    };

    //repaints
    this.update = function() { this.stage.update(); };

    //gets width and height of canvas that stage is drawn on
    this.getCanvasWidth = function () {return this.canvas.width();};
    this.getCanvasHeight = function () {return this.canvas.height();};

    this.clear = function() {
        this.stage.clear();
    };
}
