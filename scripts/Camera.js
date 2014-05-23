var oneMeter = 50; // pixels

function Camera(position, size, bounds) {

    // Camera class
    // Contains functions for converting screen coordinates
    // to world coordinates and vice-versa

    this.position = position;

    width = size.width;
    height = size.height;

    this.left = position.x - width/2;
    this.top = position.y - height/2;
    this.right = position.x + width/2;
    this.bottom = position.y + height/2;

    this.width = width;
    this.height = height;

    this.bounds = bounds;

    this.origMeter = oneMeter;

    this.elasticity = 0.2;

    // Converts a world b2vec2 position into x and y screen coordinates
    this.worldToScreen = function(point) {
        var screenX = point.x - this.position.x + this.width/2;
        var screenY = point.y - this.position.y + this.height/2;
        return {
            x: screenX * oneMeter,
            y: screenY * oneMeter
        };
    }

    // Converts a screen position into a world b2vec2 position
    this.screenToWorld = function(x, y) {
        var worldX = x / oneMeter + this.position.x - this.width/2;
        var worldY = y / oneMeter + this.position.y - this.height/2;
        return new b2Vec2(worldX, worldY);
    }

    // Determines if a world b2vec2 position is in the viewport of the camera
    this.onScreen = function(worldPos) {
        return (this.left <= worldPos.x &&
                worldPos.x <= this.right &&
                this.top <= worldPos.y &&
                worldPos.y <= this.bottom);
    }

    // refreshes left, top, right, bottom edges
    this.refreshEdges = function() {

        this.left = position.x - this.width/2;
        this.top = position.y - this.height/2;
        this.right = position.x + this.width/2;
        this.bottom = position.y + this.height/2;

    }

    // contains the camera within its own bounds
    this.constrain = function() {

        if (this.position.x <= this.bounds.left + this.width/2) {
            this.position.x = this.bounds.left + this.width/2;
        }
        if (this.position.x >= this.bounds.right - this.width/2) {
            this.position.x = this.bounds.right - this.width/2;
        }

        if (this.position.y <= this.bounds.top + this.height/2) {
            this.position.y = this.bounds.top + this.height/2;
        }
        if (this.position.y >= this.bounds.bottom - this.height/2) {
            this.position.y = this.bounds.bottom - this.height/2;
        }

    }

    this.follow = function(targetActor, offset) {
        if (typeof offset === 'undefined') {
            offset = {x: 0, y: 0};
        }
        var wantPosition = targetActor.body.GetBody().GetPosition();

        var dx = wantPosition.x - this.position.x + offset.x;
        var dy = wantPosition.y - this.position.y + offset.y;

        this.move((dx) * this.elasticity,
                  (dy) * this.elasticity);
    }

    // Moves the camera dx meters right, dy meters down
    this.move = function(dx, dy) {
        this.position.x += dx;
        this.position.y += dy;

        this.constrain();

        this.refreshEdges()
    }

    this.moveTo = function(position) {
        this.position = position;

        this.constrain();

        this.refreshEdges();
    }

    this.zoom = function(factor) {
        oneMeter *= 1/factor;
    }

    this.getScale = function() {
        return (oneMeter / this.origMeter);
    }

    this.oneMeter = function() {
        return oneMeter;
    }
}