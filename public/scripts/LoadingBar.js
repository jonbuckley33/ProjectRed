function LoadingBar() {
    // Loading bar class contains methods to draw
    // a loading bar on the screen and update it

    var width = 125;
    var height = 30;

    var loadBar, loadMask, loadBg;
    var initted = false;

    var cm;

    /*
        Function: init

        initializes all elements of the loading bar
        and adds them to the stage of canvasManager


        Parameters:
            canvasManager - canvas to draw on

        Returns:
            void
    */
    this.init = function(canvasManager) {
        loadBg = new createjs.Bitmap("images/load_bg.jpg");
        loadBg.x = canvasManager.getCanvasWidth() / 2;
        loadBg.y = canvasManager.getCanvasHeight() / 2;
        loadBg.regX = width/2;
        loadBg.regY = height/2;
        canvasManager.stage.addChild(loadBg);

        var loadSheet = new createjs.SpriteSheet({
            images: ["images/loadbar.png"],
            frames: {width: width, height: height,
                     regX: 0, regY: 0},
            animations: {
                load: [0, 16, "load"]
            }
        })
        loadBar = new createjs.Sprite(loadSheet, "load");
        loadBar.x = loadBg.x - width/2;
        loadBar.y = loadBg.y - height/2;
        loadBar.gotoAndPlay("load");
        canvasManager.stage.addChild(loadBar);

        loadMask = new createjs.Shape();
        loadMask.barSize = {width: width, height: height};

        initted = true;
        canvasManager.update();
        cm = canvasManager;
    }

    /*
        Function: progress

        Updates the loading bar to show the loading percentage

        Parameters:
            e - an object which contains "loaded" property:
                a percentage from 0 to 1;
                if e not given, loaded defaults to 0

        Returns:
            void
    */
    this.progress = function(e) {
        if (initted) {
            var percent;
            if (typeof e === undefined || typeof e.loaded === undefined) {
                percent = 0;
            } else {
                percent = e.loaded;
            }
            var width = loadMask.barSize.width;
            var height = loadMask.barSize.height;
            loadMask.graphics.beginFill("black").drawRect(0, 0, percent*width, height);
            loadMask.cache(0, 0, width, height);
            loadBar.filters = [
                new createjs.AlphaMaskFilter(loadMask.cacheCanvas)
            ];
            loadBar.cache(0, 0, width, height);
            cm.update();
        }
    }

    /*
        Function: destroy

        removes the loading bar from the screen

        Parameters:

        Returns:
            void
    */
    this.destroy = function() {
        if (initted) {
            cm.stage.removeChild(laodBg);
            cm.stage.removeChild(loadBar);
        } else throw "Cannot destroy un-initted loading bar";
    }
}

