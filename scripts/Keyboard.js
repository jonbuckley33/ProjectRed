function Keyboard()
{
	
}

var W = 119;
var A = 97;
var S = 115;
var D = 100;

Keyboard.bind = function(hm)
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
			default:
			break;

		}
	});
};
