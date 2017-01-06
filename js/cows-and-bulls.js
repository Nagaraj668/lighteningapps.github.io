var uid;
var thisUser;
var name;
var email;
var photoUrl;

authenticate(function(user) {
	thisUser = user;
	if (user != null) {
		uid = user.uid;
		name = user.displayName;
		photoUrl = user.photoURL;
		$("#yet-to-login").hide();
		$("#logged-in").show();
	}
	if (name == null || name == "null" || name == "") {
		name = "User";
	}
	$("#displayName").text(name);
	if (photoUrl != null) {
		$("#profilePhoto").attr('src', photoUrl);
	}
}, function() {
	thisUser = undefined;
	E("user not signed in");
	$("#logged-in").hide();
	$("#yet-to-login").show();
	nav("index.html");
});

var myWord;

function startNewGame() {

}

function tabClicked(element) {
	$('.btn-tab').removeClass('btn-primary');
	$(element).addClass('btn-primary');
}

var usersRef = firebase.database().ref('users');
usersRef.on('child_added', function(data) {
	if (data.key != uid)
		playerAdded(data);
});

var allPlayers = [];
function playerAdded(data) {
	allPlayers.push(data);
	var playerHtml = '<div class="col-sm-4 col-md-3">'
			+ '<div class="box-1 padding-sm" align="center"><br><span class="bold">'
			+ data.val().displayName
			+ '</span><br><br><img alt="" src="'
			+ data.val().photoURL
			+ '" width="100" height="100"><br><br><button class="btn btn-success bold form-control" onclick="playerSelected('
			+ q + data.key + q + c + q + data.val().displayName + q + c + q
			+ data.val().email + q + c + q + data.val().photoURL + q
			+ ')">PLAY</button><br></div>' + '</div>';
	$('#players').append(playerHtml);
}

function onWordEntered(event) {
	if (event.which == 13 || event.keyCode == 13) {
		startGame();
	}
	return true;
};

function startGame() {
	if (validateWord($('#word-modal').val())) {
		SL("Validating word");
		$.get({
			url : BASE_URL + "valid-word.php",
			data : "word=" + $('#word-modal').val()
		}, function(data) {
			if (data == 1) {
				HL();
				var members = {};
				members['' + uid] = {
					'word' : $('#word-modal').val()
				};

				members['' + selectedPlayerUID] = {
					'word' : TO_BE_FILLED
				};

				var game = {
					'createdBy' : {
						'displayName' : thisUser.displayName,
						'photoURL' : thisUser.photoURL,
						'email' : thisUser.email,
						'uid' : thisUser.uid
					},
					'members' : members,
					'status' : {
						'statusCode' : GAME_CREATED,
						'statusMessage' : selectedPlayerName
								+ " has to join the game"
					}
				};
				var gameId = gamesRef.push().key;
				game.gameId = gameId;
				gamesRef.child(gameId).set(game);

				var request = {
					'gameId' : gameId,
					'word1' : $('#word-modal').val(),
					'word2' : ''
				};

				createGameOnServer(request);

				$('#getWordModal').modal('hide');
			} else if (data == 0) {
				HL();
				A("Please enter valid word");
			}
		});
		return false;
	} else {
		A("Please enter valid word");
	}
}

function createGameOnServer(request) {
	$.post(BASE_URL + "start-game.php", J(request), function(data, status) {
		if (data == 200) {
			A('Success! Game created and waiting for your friend\'s approval');
			playerType = 2;
		}
	});
}

function isMemberOfGame(game) {
	var flag = false;
	var members = game.members;
	if (members.hasOwnProperty(uid)) {
		flag = true;
	}
	return flag;
}

var gamesRef = firebase.database().ref().child('games');
gamesRef.on('child_added', function(data) {
	if (isMemberOfGame(data.val())) {
		updateRecentGames(data.val(), data.key);
	}
});

gamesRef.on('child_changed', function(data) {
	if (isMemberOfGame(data.val())) {
		updateRecentGameStatus(data.val(), data.key);
	}
});

function updateRecentGameStatus(game, gameId) {
	$('.' + gameId).find('.list-group-item-text').text(
			game.status.statusMessage);
}

function updateRecentGames(game, gameId) {
	getTempOpponentObject(game, function(data) {
		var gameHtml = '<a href="#" class="list-group-item ' + gameId
				+ ' recent-game-item" onclick="onGameSelected(' + q + gameId
				+ q + ', this)">' + '<h4 class="list-group-item-heading">'
				+ '<img alt="" src="images/ic_person_black_24dp_2x.png"'
				+ 'width="30" height="30">' + data.val().displayName
				+ '</h4>' + '<p class="list-group-item-text">'
				+ game.status.statusMessage + '</p></a>';
		$('#recent-games-itme-group').prepend(gameHtml);
		$('.recent-game-item:last-child').trigger('click');
	});
}

$(document).ready(function() {
	$('#opponent-word-panel').hide();
	$('#game-panel').hide();
});

var currentGame;
var currentGameRef;
var myAttemptCount = 0;
var opponentAttemptCount = 0;
var playerType;

function onGameSelected(gameId, element) {
	$('.recent-game-item').removeClass('active');
	$(element).addClass('active');
	currentGameRef = firebase.database().ref().child('games').child(gameId);
	currentGameRef
			.once('value')
			.then(
					function(data) {
						var gameObj = data.val();
						currentGame = gameObj;
						currentGame.gameId = data.key;
						if (gameObj.members[uid].word == TO_BE_FILLED) {
							$('#opponent-word-panel').show();
							$('#game-panel').hide();
						} else {
							$('#game-panel').show();
							$('#opponent-word-panel').hide();
							myAttemptCount = 0;
							$('#my-attempt').html(
									"My Attempts: <span class='bold' id='my-attempt-count'>"
											+ myAttemptCount + "</span>");
							getOpponentObject(function() {
								L(J(currentOpponent));
								$('#opponent-attempt')
										.html(
												currentOpponent.displayName
														+ ": <span class='bold' id='opponent-attempt-count'>"
														+ myAttemptCount
														+ "</span>");
								currentGameRef.child('attempts').child(
										currentOpponent.uid).on('child_added',
										function(data) {
											onAttemptAdded(data);
										});
							});
							if (currentGame.createdBy.uid == uid) {
								playerType = 2;
							} else {
								playerType = 1;
							}
							currentGameRef.child('attempts').child(uid).on(
									'child_added', function(data) {
										opponentAttemptCount++;
									});
						}
					});
}

function onAttemptAdded(attempt) {
	var attemptHtml = '<div><div class="col-sm-4 padding-sm">' + attempt.word
			+ '</div>' + '<div class="col-sm-4 padding-sm">' + attempt.cows
			+ '</div>' + '<div class="col-sm-4 padding-sm">' + attempt.bulls
			+ '</div></div>';
	$('#attempt-list').prepend(attemptHtml);
}

var currentOpponent;
function getOpponentObject(callback) {
	var members = currentGame.members;
	var uids = Object.keys(members);
	for (var i = 0; i < uids.length; i++) {
		if (uids[i] != uid) {
			usersRef.child(uids[i]).once('value').then(function(data) {
				currentOpponent = data.val();
				currentOpponent.uid = data.key;
				callback();
			});
		}
	}
}

function getTempOpponentObject(game, callback) {
	var members = game.members;
	var uids = Object.keys(members);
	for (var i = 0; i < uids.length; i++) {
		if (uids[i] != uid) {
			usersRef.child(uids[i]).once('value').then(function(data) {
				callback(data);
			});
		}
	}
}

function onWordEnteredByOpponent(event) {
	if (event.which == 13 || event.keyCode == 13) {
		if (validateWord($('#word-opponent').val())) {
			currentGameRef.child('members').child(uid).child('word').set(
					$('#word-opponent').val());
			currentGameRef.child('status').child('statusCode').set(
					GAME_IN_PROGRESS);
			currentGameRef.child('status').child('statusMessage').set(
					IN_PROGRESS);
			acceptGame($('#word-opponent').val());
			$('#opponent-word-panel').hide();
			$('#game-panel').show();
			return false;
		} else {
			A("Please enter valid word");
		}
	}
	return true;
}

function acceptGame(word) {
	$.post(BASE_URL + 'accept.php', J({
		'gameId' : currentGame.gameId+'',
		'word2' : word
	}), function(data, status) {
		A(data);
		if (data == 200) {
			playerType = 1;
			A('Success! You accepted game');
		}
	});
}

function onWordEnteredForGuess(event) {
	if (event.which == 13 || event.keyCode == 13) {
		if (validateWord($('#word-for-guess').val())) {
			attempt($('#word-for-guess').val());
		} else {
			A("Please enter valid word");
		}
	}
	return true;
}

function attempt(word) {
	var request = {
		'word' : word,
		'type' : playerType,
		'gameId' : currentGame.gameId
	};
	$.post(BASE_URL + 'attempts.php', J(request), function(data, status) {
		if(data==200){
			
		}
	});
}

var selectedPlayerUID;
var selectedPlayerName;

function playerSelected(uidParam, name) {
	selectedPlayerUID = uidParam;
	selectedPlayerName = name;
	$('#getWordModal').modal('show');
}