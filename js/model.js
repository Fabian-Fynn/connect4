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
			var row = 0;
			//remove after firebase added
			var myPlayerIndex = 1;
			var destination;

			for (var row = 0; row <= this.columns[columnIndex].length - 1; row++) {
				if(this.columns[columnIndex][row + 1 ] != 0 || row == this.columns[columnIndex].length - 1)
				{
					destination = row;
					break;
				}
			}
			this.columns[columnIndex][destination] = myPlayerIndex;
			this.renderBoard();
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


		renderBoard: function () {
		var board = this.columns;
		var cols = this.config.numColumns;
		var rows = this.config.numRows;

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
		if($('#gameBoard'))
			$('#gameBoard').remove();

		$('#output').append(canvas);



	},
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