window.connectFour = window.connectFour || {};

connectFour.game = (function(config, Model) {
	"use strict";

	var context = $('#output');
	var model = null;

	//...

	function init() {

		//context = document.getElementById("gameBoard").getContext("2d");
		model = new Model(config);
		$(model).on(Model.EVENTS.GAME_LIST_CHANGE, onGameListChange);
		// $(model).on(Model.EVENTS.INSERT_TOKEN, renderBoard);

		// console.log(model.toString());
		var board = model.getBoard();
		console.log(board);
		//init model and wait for model
		//draw game list and wait for changes
		//draw game
		//wait for user to enter name, start or join a game

		//...

		//listen for model events with jquery, e.g.

		//$(model).on(Model.EVENTS.STATE_CHANGE, onGameStateChange);
		renderBoard();
	}

	function onGameListChange(e) {
		drawGamelist();
	}

	function drawGameList() {

	}
	function renderBoard() {
		var board = model.getBoard();
		var cols = config.numColumns;
		var rows = config.numRows;
		var fieldSize = config.fieldSize;

		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext("2d");
		canvas.id = "gameBoard";
		canvas.width = cols*100;
		canvas.height = rows*100;
		ctx.fillStyle = '#00c';
		ctx.fillRect(0,0,ctx.canvas.width, ctx.canvas.height);

		for (var col = 0; col <= cols - 1; col++) {
			for (var row = 0; row <= rows - 1; row++) {
				var token = board[col][row];
				switch(token) {
					case 0:
						ctx.fillStyle = '#fff';
						break;
					case 1:
						ctx.fillStyle = '#c00';
						break;
					case 2:
						ctx.fillStyle = '#ff0';
						break;
					default:
						ctx.fillStyle = '#fff';
				}
				ctx.beginPath();
				ctx.arc(100*col+45,100*row+50, 35, 0, 2 * Math.PI, false);
				ctx.fill();
				ctx.closePath();
			}
		};
		$('#output').append(canvas);

	}

	init();

}(connectFour.CONFIG, connectFour.Model));
