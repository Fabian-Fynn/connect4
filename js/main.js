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
		//console.log(board);
		//init model and wait for model
		//draw game list and wait for changes
		//draw game
		//wait for user to enter name, start or join a game

		//...

		//listen for model events with jquery, e.g.

		//$(model).on(Model.EVENTS.STATE_CHANGE, onGameStateChange);
		model.renderBoard();
		console.log(model.insertTokenAt(1));
		console.log(model.insertTokenAt(0));
		console.log(model.insertTokenAt(0));
		console.log(model.insertTokenAt(0));
		console.log(model.insertTokenAt(0));
		console.log(model.insertTokenAt(0));
		console.log(model.insertTokenAt(0));
		console.log(model.insertTokenAt(0));
		console.log(model.insertTokenAt(0));
	}

	function onGameListChange(e) {
		drawGamelist();
	}

	function drawGameList() {

	}


	init();

}(connectFour.CONFIG, connectFour.Model));
