function CanvasManager()
{
    //reference to stage object
    var stage;

    this.init = function(canvasID)
    {
        //Create a stage by getting a reference to the canvas
        this.stage = new createjs.Stage(canvasID);
        //Create a Shape DisplayObject.
        circle = new createjs.Shape();
        circle.graphics.beginFill("red").drawCircle(0, 0, 40);
        //Set position of Shape instance.
        circle.x = circle.y = 50;
        //Add Shape instance to stage display list.
        this.stage.addChild(circle);
        //Update stage will render next frame
        this.stage.update();
    }


}

