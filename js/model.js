window.connectFour = window.connectFour || {};

connectFour.Model = (function() {
	"use strict";

	//Model constructor function
	var Model = function Model(config) {

		this.config = config;
		this.init();
		this.myPlayerIndex = 1;
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
			this._firbase = new Firebase(this.config.firebaseUrl + '/games');
      $(this).triggerHandler(Model.EVENTS.INIT_COMPLETE);
		},

		getBoard: function() {
			return this.columns;
		},

		insertTokenAt: function (columnIndex) {
			var row = 0;
			//remove after firebase added
			// console.log(this.columns)
			var destination;

			if(this.isInsertTokenPossibleAt(columnIndex)) {
				for (var row = 0; row <= this.columns[columnIndex].length - 1; row++) {
					if(this.columns[columnIndex][row + 1 ] != 0 || row == this.columns[columnIndex].length - 1)
					{
						destination = row;
						break;
					}
				}
				this.columns[columnIndex][destination] = this.myPlayerIndex;
				// this.renderBoard();
				if(this._isDraw()) {
					this.state = 'over';
				}
				// if(this._hasPlayerWon())
				if(this._hasPlayerWon([columnIndex, destination])) {
					this.state = 'over';
				}
				return true;
			}
			else
				return false;
		},

		isInsertTokenPossibleAt: function (columnIndex) {
			if(this.columns[columnIndex][0] == 0)
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
						case '1':
							ctx.fillStyle = '#c00';
							break;
						case '2':
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

			$('#board').append(canvas);

		},

		startGame: function (playerName) {
			//create new game and wait for user
			console.log('start game:');
      this._firbase =  this._firbase.push();
      this._firbase.child('player/1').set({name: playerName});
      this._firbase.child('startedPlayerId').set({name: '1'});
      this._firbase.child('info').set({state: 'waiting'});

      this._gameId = this._firbase.key();
      this.myPlayerIndex = '1';

      console.log('game id: ' +  this._firbase.key() + ', wait for another player to enter game.');
      console.log('name id: ' +  this._firbase.child('player/1') + ', wait for another player to enter game.');
      $('.code').remove();
      $('#output').append('<div class="code" >Match code: '+ this._gameId+'</div>');


			$('.insertTokenButton').remove();


      for (var col = 0; col <= this.config.numColumns - 1; col++) {
      	$('.btns').append('<button class="insertTokenButton" id="' + col + '">&#x25BC;</button>');
      }
      var that = this;
      $('.insertTokenButton').on('click', function(e) {
	    	var id = e.target.id;
	    	that.setMove(id);
	  	});

      this.renderBoard();

      this.waitForPlayer();

      this.watchGameAbort(); //watches if another player exits game
      this._firbase.onDisconnect().remove(); //when game is clos2ed, remove game from data
		},

		joinGame: function (gameId, playerName) {
      //try to join an existing game
      if(!gameId) {
	      console.log('error, game id is null'); //todo handle error
	      return;
      }

      this.myPlayerIndex = '2';
      this._gameId = gameId;

      this._firbase = new Firebase(this.config.firebaseUrl + '/games/' + gameId);

      var firebase = this._firbase;
      var that = this;

      firebase.once('value', function(dataSnapshot) {
     	 	var game = dataSnapshot.val();

      	if(game) {
		      //transaction is a safe way of setting value, ensures only one person can write a value
	  	    firebase.child('info').transaction(function(currentData) {
	          if(currentData && currentData.state == 'waiting')
	            return {state: 'playing'};
	          else
	            return null; //don't allow setting data
	      	}, function(error, committed, snapshot) {
	          if(error)
	            console.log('abnormal error'); //todo handle error
	          else if(!committed)
	            console.log('somebody plays already'); //todo handle case
	          else {
	            console.log('i joined the game');
	            firebase.child('player/2').set({name: playerName});

	            $('#output').append('<div class="code" >Match code: '+ this._gameId+'</div>');

      				for (var col = 0; col <= this.config.numColumns - 1; col++) {
      					$('.btns').append('<button class="insertTokenButton" id="' + col + '">&#x25BC;</button>');
      				}
      				$('#output').append('<div class="code" >Match code: '+ this._gameId+'</div>');

				      for (var col = 0; col <= this.config.numColumns - 1; col++) {
				      	$('.btns').append('<button class="insertTokenButton" id="' + col + '">&#x25BC;</button>');
				      }
				      var that = this;
				      $('.insertTokenButton').on('click', function(e) {
					    	var id = e.target.id;
					    	that.setMove(id);
					  	});
	            that.watchGameAbort();
	            that.watchGameMoves();

	            firebase.onDisconnect().remove();
	          }
  		    });
      	}
      	else
	        console.log('game doesnt exist'); //todo handle error
  		});
		},

		waitForPlayer: function () {
      console.log('wait for players!');
      var firebase = this._firbase;
      var that = this;
      firebase.child('player').on('value', function(snapshot) {
        var players = snapshot.val();
        if(players && players['1'] && players['2']) {
          console.log(players['1'].name +" vs. "+players['2'].name);
          firebase.child('player').off('value');
          that.watchGameMoves();
        }
      });
    },

    watchGameMoves: function() {
      var that = this;
      this._firbase.child('move').on('child_added', function(snapshot) {
        console.log('game move added: ');
        console.log(snapshot.val());
      });
    },

    watchGameAbort: function() {
      this._firbase.on('child_removed', function(test) { //gets triggered for every child element
	      console.log('game aborted.');
      });
    },

    setMove: function(xPosition) {
    	if(this.isInsertTokenPossibleAt(xPosition)) {
	      this._firbase.child('move').push({playerId: this.myPlayerIndex, x: xPosition});
	      this.insertTokenAt(xPosition);
	      this.renderBoard();
	    }
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
		},

		_isDraw: function () {
			for (var col = 0; col <= this.config.numColumns - 1; col++) {
				if(this.columns[col][0] == 0)
					return 'going';
			}
			return 'draw';
		},

		_hasPlayerWon: function (lastToken) {
			var count = 0;
			var columns = this.columns;
			//vertical check
			for (var row = lastToken[1]; row <= this.config.numRows - 1; row++) {
				if(this.columns[lastToken[0]][row] == this.myPlayerIndex)
					count++;
				else
					break;

				if(count >= this.config.maxLineLength)
					return true;
			}

			//horizontal check
			count = 0;
			for (var col = 0; col <= this.config.numColumns - 1; col++) {
				if(this.columns[col][lastToken[1]] == this.myPlayerIndex)
					count++;
				else
					count = 0;

				if(count >= this.config.maxLineLength)
					return true;
			}

			//diagonal check
			//a: direction top left to bottom right
			count = 0;
			var col = lastToken[0];
			var row = lastToken[1];
			while(col > 0 && row > 0) {
				col--;
				row--;
			}
			var a = [col, row];

			while(a[0] < this.config.numColumns && a[1] < this.config.numRows) {
				if(columns[a[0]][a[1]] == this.myPlayerIndex)
					count++;
				else
					count = 0;

				if(count >= this.config.maxLineLength)
					return true;

				a[0]++;
				a[1]++;
			}

			//b: direction top right to bottom left
			count = 0;
			col = lastToken[0];
			row = lastToken[1];
			while(col < this.config.numColumns - 1 && row > 0) {
				col++;
				row--;
			}

			var b = [col, row];
			while(b[0] >= 0 && b[1] <= this.config.numRows) {

				if(columns[b[0]][b[1]] == this.myPlayerIndex)
					count++;
				else
					count = 0;

				if(count >= this.config.maxLineLength)
					return true;

				b[0]--;
				b[1]++;
			}

			return false;
		}


		//...

	};

	return Model;
})();