function Keyboard()
{
	
}

var W = 119;
var A = 97;
var S = 115;
var D = 100;

var I = 105;
var J = 106;
var K = 107;
var L = 108;

var U = 117;
var O = 111;

Keyboard.bind = function(hm, cam)
{
	$(document).on("keypress", function (e) {

		switch(e.which){
			case W:
				hm(0,-1);
			break;
			case A:
				hm(-1,0);
			break;
			case S:
				hm(0,1);
			break;
			case D:
				hm(1,0);
			break;
			case I:
				cam.move(0, -10);
				break;
			case J:
				cam.move(-10, 0);
				break;
			case K:
				cam.move(0, 10);
				break;
			case L:
				cam.move(10, 0);
				break;
			case U:
				cam.zoom(1001/1000);
				break;
			case O:
				cam.zoom(1000/1001);
				break;
			default:
				console.log(e.which);
			break;

		}
	});
};
