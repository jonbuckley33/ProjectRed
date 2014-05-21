var oneMeter = 50; // pixels

function Camera(position, width, height)
{
    // Camera class
    // Contains functions for converting screen coordinates
    // to world coordinates and vice-versa

    this.position = position;

    this.left = position.x - width/2;
    this.top = position.y - height/2;
    this.right = position.x + width/2;
    this.bottom = position.y + height/2;

    this.width = width;
    this.height = height;

    this.origWidth = width;
    this.origHeight = height;

    // Converts a world b2vec2 position into x and y screen coordinates
    this.worldToScreen = function(point) {
        var scale = this.getScale();
        var screenX = scale*(point.x - this.position.x + this.width/2);
        var screenY = scale*(point.y - this.position.y + this.height/2);
        return {
            x: screenX * oneMeter,
            y: screenY * oneMeter
        };
    }

    // Converts a screen position into a world b2vec2 position
    this.screenToWorld = function(x, y) {
        var worldX = x / oneMeter + this.x - this.width/2;
        var worldY = y / oneMeter + this.y - this.height/2;
        return new b2vec2(worldX, worldY);
    }

    // Determines if a world b2vec2 position is in the viewport of the camera
    this.onScreen = function(worldPos) {
        return (this.left <= worldPos.x &&
                worldPos.x <= this.right &&
                this.top <= worldPos.y &&
                worldPos.y <= this.bottom);
    }

    // Moves the camera dx pixels right, dy pixels down
    this.move = function(dx, dy) {
        this.position.x += dx / oneMeter;
        this.left += dx / oneMeter;
        this.right += dx / oneMeter;
        this.position.y += dy / oneMeter;
        this.top += dy / oneMeter;
        this.bottom += dy / oneMeter;
    }

    this.zoom = function(factor) {
        this.width *= factor;
        this.height *= factor;

        this.left = this.position.x - this.width/2;
        this.top = this.position.y - this.height/2;
        this.right = this.position.x + this.width/2;
        this.bottom = this.position.y + this.height/2;

        console.log(this.width, this.height);
    }

    this.getScale = function() {
        return (this.origWidth / this.width);
    }
}