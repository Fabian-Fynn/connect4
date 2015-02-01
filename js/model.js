window.connectFour = window.connectFour || {};

connectFour.Model = (function() {
	"use strict";

	//Model constructor function
	var Model = function Model(config) {

		this.config = config;
		this.init();
	};

	//static consts

	Model.EVENTS = {
		INIT_COMPLETE: 'initComplete', // after connected to firebase
		INSERT_TOKEN: 'insertToken', // drop a piece
		GAME_OVER: 'gameOver', // a player wins, pass winning player as event parameter...
		GAME_ABORTED: 'gameAborted',
		STATE_CHANGE: 'stateChange',
		GAME_LIST_CHANGE: 'gameListChange',
		ERROR: 'error'
		//...
	};

	Model.STATES = {
		WAITING: 'waiting',
		PLAYING: 'playing',
		OVER: 'over'
	};

	//Model prototype

	Model.prototype = {

		//public properties

		state: Model.STATES.WAITING,
		currentPlayer: '',
		myPlayerIndex: '',
		columns: null,
		gameList: null,
		numColumns: 7,

		//...

		//private properties
		_firbase: null,
		_gameId: '',

		//...

		//public functions

		init: function () {
			this._initColumns();
			//connect to firebase and wait for it
			//...
			//$(this).triggerHandler(Model.EVENTS.INIT_COMPLETE);
		},
		getBoard: function() {
			return this.columns;
		},

		insertTokenAt: function (columnIndex) {
			return this.columns[columnIndex].length < this.config.numRows;
		},

		isInsertTokenPossibleAt: function (columnIndex) {
			if(this.comlumns[columnIndex][0] == 0)
				return true;
			else
				return false;
		},

		toString: function () {
			var s = '';
			for (var row = 0; row < this.config.numRows; row++) {
				var line = '';
				for (var col = 0; col < this.config.numColumns; col++) {
					var elem = this.columns[col][row];
					line += (elem === undefined ? '-' : elem) + ' ';
				}
				s = line + '\n' + s;
			}
			return '\n' + s;
		},

		startGame: function () {
			//create new game and wait for user
		},

		joinGame: function (gameId) {
			//try to join an existing game
		},

		//...

		//private functions

		_initColumns: function () {
			this.columns = [];
			for (var col = 0; col <= this.config.numColumns - 1; col++) {
				this.columns[col] = [];
				for (var row = 0; row <= this.config.numRows - 1; row++) {
					this.columns[col][row] = 0;
				}
			}

			this.columns[0][5] = 1;
			this.columns[3][2] = 2;
		}

		//...

	};

	return Model;
})();