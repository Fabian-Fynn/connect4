window.connectFour = window.connectFour || {};

connectFour.game = (function(config, Model) {
	"use strict";

	var context = $('#output');
	var model = null;

	//...

	function init() {

		//context = document.getElementById("gameBoard").getContext("2d");

		$('#btnStartGame').on('click', startGame);

	  $('#btnJoinGame').on('click', function() {
	    joinGame($('#inputGameId').val());
	  });

	  model = new Model(config);
		$(model).on(Model.EVENTS.GAME_LIST_CHANGE, onGameListChange);

		// $(model).on(Model.EVENTS.INSERT_TOKEN, renderBoard);

		// console.log(model.toString());

		//console.log(board);
		//init model and wait for model
		//draw game list and wait for changes
		//draw game
		//wait for user to enter name, start or join a game

		//...

		//listen for model events with jquery, e.g.

		//$(model).on(Model.EVENTS.STATE_CHANGE, onGameStateChange);
		// model.renderBoard();
		// model.insertTokenAt(3);
		// model.insertTokenAt(3);
		// model.insertTokenAt(3);
		// model.insertTokenAt(3);
		// model.insertTokenAt(4);
		// model.insertTokenAt(4);
		// model.insertTokenAt(4);
		// model.insertTokenAt(5);
		// model.insertTokenAt(5);
		// model.insertTokenAt(6);
		// model.insertTokenAt(4);
		// model.insertTokenAt(4);
		// // model.insertTokenAt(1);
		// model.insertTokenAt(2);
		// model.insertTokenAt(3);
		// model.setMove(0);

	}

	function startGame() {
		var person = prompt("Please enter your name", "Harry Potter");
		if (person != '') {
			model.startGame(person);
		}
	}

	function joinGame() {
		var person = prompt("Please enter your name", "Harry Potter");
		if (person != '' && $('#inputGameId').val() != '') {
			model.joinGame($('#inputGameId').val(), person);
		}
	}

	function onGameListChange(e) {
		drawGamelist();
	}

	function drawGameList() {

	}


	init();

}(connectFour.CONFIG, connectFour.Model));
