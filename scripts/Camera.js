function Camera(pos, width, height)
{
    // Camera class
    // Contains functions for converting screen coordinates
    // to world coordinates and vice-versa

    var pos = pos;

    var left = 0;
    var top = 0;
    var right = width;
    var bottom = height;

    var width = width;
    var height = height;

    function worldToScreen(x, y) {
        return {
            x: x - this.x,
            y: y - this.y
        };
    }

    function screenToWorld(x, y) {
        return {
            x: x + this.x,
            y: y + this.y
        };
    }

    function onScreen(x, y) {
        return (this.left <= x &&
                x <= this.right &&
                this.top <= y &&
                y <= this.bottom);
    }

    function move(dx, dy) {
        this.x += dx;
        this.left += dx;
        this.right += dx;
        this.y += dy;
        this.top += dy;
        this.bottom += dy;
    }
}