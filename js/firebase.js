// (function() {
//   //quick and dirty firebase game demo
//   var FIREBASE_URL = 'https://fh-demo.firebaseIO.com/';

//   var userListRef = new Firebase(FIREBASE_URL);


//   var connectionRef = new Firebase(FIREBASE_URL + '/.info/connected'); //reference to our firebase
//   //.info/connected provides info about the connection state, every user has another connection state, is set
//   //by firebase
//   var gameList = new Firebase(FIREBASE_URL + '/games');

//   var gamesSnap;
//   gameList.on('value', function(snapshot) {
//     gamesSnap = snapshot;
//     console.log(gameList);
//     for (var i = gamesSnap.length - 1; i >= 0; i--) {
//       if (gamesSnap[i].val('info')) {
//         console.log('game');
//       };

//     };
//     // console.log('##############');
//     // console.log(gamesSnap.val());
//     // console.log('##############');
//   });




  // userListRef.on("child_added", function(snapshot) {
  //   var user = snapshot.val();
  //   console.log(user.name);
  //   })
(function() {
  //firebase communication for connect4 game

  var FIREBASE_URL = 'https://fh-demo.firebaseIO.com';

  var gameList = new Firebase(FIREBASE_URL + '/games'); //list of all firebase games
  var firebaseGame = null; //ref to firebase game
  var playerId = 0; //id of player, 1 or 2

  // var playerName = prompt("Your name?", "Player");
  // gameList.child('user').update({
  //   name: playerName
  // });

  function init() {
    watchGameList();
  }

  //watches games for changes
  //thus if game has been added or removed, or if game state switches to over or playing
  function watchGameList() {

    //watch game added, this happens also on initalization for each game in list
    gameList.on('child_added', function(dataSnapshot) {

      console.log('new game added');

      var game = dataSnapshot.ref();
      game.child('name').on('value', function(dataSnapshot) {
        console.log('user!!!!!!!');
        console.log(dataSnapshot);
      })
      game.child('info/state').on('value', function(dataSnapshot) {

        //watch state switching to over or playing
        if(dataSnapshot.val() == 'over' || dataSnapshot.val() == 'playing') {
          game.child('info/state').off('value');
          handleGameListChange();
        }
      });

      handleGameListChange();
    });

    //watch game removed
    gameList.on('child_removed', handleGameListChange);

  }

  function handleGameListChange() {
    gameList.once('value', function(dataSnapshot) {
      console.log('game list changed:'); //todo dispatch event
      console.log(dataSnapshot.val());
    });
  }

  //start a new game and wait for second player
  function startGame() {
    console.log('start game:');
    playerId = 1;
    firebaseGame = gameList.push();
    firebaseGame.child('player/1').set({name: 'Hansi'});
    firebaseGame.child('startedPlayerId').set({name: '1'});
    firebaseGame.child('info').set({state: 'waiting'});

    console.log('game id: ' + firebaseGame.key() + ', wait for another player to enter game.');

    waitForPlayer(onGameStart);

    watchGameAbort(); //watches if another player exits game
    firebaseGame.onDisconnect().remove(); //when game is closed, remove game from data
  }

  //waits for second player
  //if second player enters game, successFunction is executed
  function waitForPlayer(successFunction) {
    firebaseGame.child('player').on('value', function(snapshot) {
      var players = snapshot.val();
      if(players && players['1'] && players['2']) {
        firebaseGame.child('player').off('value');
        successFunction();
      }
    });
  }

  //join an existing game
  //param gameId Firebase GameId of game we want to join
  function joinGame(gameId) {

    if(!gameId) {
      console.log('error, game id is null'); //todo handle error
      return;
    }

    firebaseGame = new Firebase(FIREBASE_URL + '/games/' + gameId);
    firebaseGame.once('value', function(dataSnapshot) {

      var game = dataSnapshot.val();
      if(game) {

        //transaction is a safe way of setting value, ensures only one person can write a value
        firebaseGame.child('info').transaction(function(currentData) {
          if(currentData && currentData.state == 'waiting') {
            return {state: 'playing'};
          } else {
            return null; //don't allow setting data
          }
        }, function(error, committed, snapshot) {
          if(error) {
            console.log('abnormal error'); //todo handle error
          }
          else if(!committed) {
            console.log('somebody plays already'); //todo handle case
          } else {
            console.log('i joined the game');
            playerId = 2;
            firebaseGame.child('player/2').set({name: 'hansi'});
            watchGameAbort();
            firebaseGame.onDisconnect().remove();
            onGameStart();
          }
        });

      } else {
        console.log('game doesnt exist'); //todo handle error
      }
    });
  }

  //game started
  function onGameStart() {
    watchGameMoves();
    console.log('game started, player id: ' + playerId);
  }

  //sets a move
  function setMove(xPosition) {
    firebaseGame.child('move').push({playerId: playerId, x: xPosition});
  }

  //watches all game moves
  function watchGameMoves() {
    firebaseGame.child('move').on('child_added', function(snapshot) {
      console.log('game move added: ');
      console.log(snapshot.val());
    });
  }

  //watch if game was aborted (game closed)
  function watchGameAbort() {
    firebaseGame.on('child_removed', function(test) { //gets triggered for every child element
      console.log('game aborted.');
    });
  }

  //testcode
  $('#btnStartGame').on('click', startGame);

  $('#btnJoinGame').on('click', function() {
    joinGame($('#inputGameId').val());
  });
  $('#btnInsertToken').on('click', function() {
    setMove(0);
  });

  init();
})();