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

firebase.database().ref('users').on('child_added', function(data) {
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
		var game = {
			'createdBy' : {
				'displayName' : thisUser.displayName,
				'photoURL' : thisUser.photoURL,
				'email' : thisUser.email,
				'uid' : thisUser.uid
			},
			'word' : $('#word-modal').val(),
			'members' : [ uid, selectedPlayerUID ],
			'status' : {
				'statusCode' : GAME_CREATED,
				'statusMessage' : IN_PROGRESS
			}
		};
		firebase.database().ref().child('games').push().set(game);
		$('#getWordModal').modal('hide');
		return false;
	} else {
		A("Please enter valid word");
	}
}

var selectedPlayerUID;

function playerSelected(uidParam) {
	selectedPlayerUID = uidParam;
	$('#getWordModal').modal('show');
}