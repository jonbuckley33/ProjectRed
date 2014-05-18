function CanvasManager()
{
    //reference to stage object

    this.init = function(canvasID)
    {
        //Create a stage by getting a reference to the canvas
        this.stage = new createjs.Stage(canvasID);
        /*//Create a Shape DisplayObject.
        circle = new createjs.Shape();
        circle.graphics.beginFill("red").drawCircle(0, 0, 40);
        //Set position of Shape instance.
        circle.x = circle.y = 100;
        //Add Shape instance to stage display list.
        this.stage.addChild(circle);
>>>>>>> c03825d72a1fdb432b078f1dec4075977f7fa4ba:scripts/CanvasManager.js
        //Update stage will render next frame
        this.stage.update();*/

    }

    this.addChild = function(child) {
        this.stage.addChild(child);
    }

    this.update = function() { this.stage.update(); }
}

