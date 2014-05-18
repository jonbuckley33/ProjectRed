function Converter()
{
	//Converter class contains static methods for converting from game to canvas 
	//and visa versa
}

var oneMeter = 50; //pixels
Converter.gameToCanvas = function(x)
{
	return x * oneMeter;
}	

Converter.canvasToGame = function(x)
{
	return x / oneMeter;
}