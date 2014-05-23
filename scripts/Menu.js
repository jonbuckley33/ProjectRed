function Menu() {

    this.loaded = false;
    this.shown = false;

    this.bg;
    this.buttons;

    this.show = function(cm) {
        if (this.loaded) {
            if (!this.shown) {
                console.log(this.bg);
                cm.stage.addChild(this.bg);
                cm.update();
                for (var i=0, l=this.buttons.length; i < l; i++) {
                    cm.stage.addChild(this.buttons[i]);
                }
                this.shown = true;
            }
        } else {
            throw "Cannot show non-loaded menu.";
        }
        cm.update();
    }

    this.hide = function(cm) {
        if (this.shown) {
            cm.stage.removeChild(this.bg);
            for (var i=0, l=this.buttons.length; i < l; i++) {
                cm.stage.removeChild(this.buttons[i]);
            }
            this.shown = false;
        }
    }
}

/*
    Function: createButton

    creates an individual button

    Parameters:

        URL - path to image
        position:
            x - x position
            y - y position
        frameSize:
            width - frame width
            height - frame height
        animBounds:
            out - mouse off button
                start - start frame
                end - end frame
            over - mouse on button
                start - start frame
                end - end frame
            down - clicking the button
                start - start frame
                end - end frame
        fn - function to call
*/

function createButton(URL, cm, position, frameSize, animBounds, fn) {

    // TODO: Replace this animation stuff with animation class
    var buttonImg = new Image();
    buttonImg.onload = function() {
        cm.update();
    };
    buttonImg.src = URL;

    var buttonSheet = new createjs.SpriteSheet({
        images: [buttonImg],
        frames: {width: frameSize.width, height:frameSize.height,
                 regX: frameSize.width/2, regY: frameSize.height/2},
        animations: {
            out: [animBounds.out.start, animBounds.out.end, "out"],
            over: [animBounds.over.start, animBounds.over.end, "over"],
            down: [animBounds.down.start, animBounds.down.end, "down"]
        }
    });

    var buttonSprite = new createjs.Sprite(buttonSheet, "out");

    buttonSprite.x = position.x;
    buttonSprite.y = position.y;

    var btnHelper = new createjs.ButtonHelper(buttonSprite, "out", "over", "down", true);
    buttonSprite.addEventListener("click", fn);
    return buttonSprite;
}

/*
    Function: load

    reads menu data from a JSON file then runs callback function

    Parameters:

        filename
        callback - callback function
        cm - canvas manager
        functions - buttons' functions

    Returns:

        void
*/

Menu.load = function(filename, callback, cm, functions) {

    $.ajax({
        url : "menus/" + filename,
        success : function(data) {
            debug.log("retrieved menu data");

            var menu = JSON.parse(data);

            //get BG image
            var bg;
            if ("bg_image" in menu) {
                var img = new Image();
                img.onload = function() {
                    cm.update();
                };
                img.src = menu.bg_image;
                bg = new createjs.Bitmap(img);
                bg.x = 0;
                bg.y = 0;
            } else {
                bg = new createjs.Shape();
                bg.graphics.beginFill("#FF0000").drawRect(
                    0, 0, cm.getCanvasWidth(), cm.getCanvasHeight());
            }

            //get buttons
            var buttons = [];
            if ("buttons" in menu) {
                for (var i=0, l=menu.buttons.length; i < l; i++) {

                    var buttonDef = menu.buttons[i];
                    if ("name" in buttonDef) {
                        var name = buttonDef.name;
                    } else {
                        var name = "Button " + i.toString();
                    }
                    // position
                    if ("x" in buttonDef && "y" in buttonDef) {
                        var position = {x: buttonDef.x, y: buttonDef.y};
                    } else throw (name + " has no position");
                    
                    // filename
                    if ("filepath" in buttonDef) {
                        var URL = buttonDef.filepath;
                    } else throw (name + " has no image");

                    // animationDef
                    if ("animDef" in buttonDef) {
                        if ("width" in buttonDef.animDef &&
                            "height" in buttonDef.animDef &&
                            "bounds" in buttonDef.animDef) {

                            var frameSize = {width: buttonDef.animDef.width,
                                             height: buttonDef.animDef.height};

                            var bounds = buttonDef.animDef.bounds;
                            if (!("out" in bounds &&
                                  "over" in bounds &&
                                  "down" in bounds)) {
                                throw (name + " animation bounds improperly defined");
                            }
                        } else throw (name + " animation improperly defined");
                    } else throw (name + " has no animation defined");

                    // click function
                    if ("func" in buttonDef) {
                        if (buttonDef.func in functions) {
                            var fn = eval("functions."+buttonDef.func);
                        } else throw (buttonDef.func + " is not a valid function");
                    } else throw (name + " has no function");

                    buttons.push(createButton(URL, cm, position, frameSize,
                                              bounds, fn));
                }
            }

            // "return" everything
            callback({background: bg,
                      buttonsArray: buttons})

        },

        error : function(data, textStatus) {
            throw "Menu File Could Not Be Found or Read";
        }
    })

}