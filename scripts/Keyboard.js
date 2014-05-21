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

Keyboard.bind = function(hm, cm)
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
				cm(0, -1);
				break;
			case J:
				cm(-1, 0);
				break;
			case K:
				cm(0, 1);
				break;
			case L:
				cm(1, 0);
				break;
			default:
			break;

		}
	});
};
