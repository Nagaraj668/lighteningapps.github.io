authenticate(function(user) {
	thisUser = user;
	if (user != null) {
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
	playerAdded(data);
});

var allPlayers = [];
function playerAdded(data) {
	allPlayers.push(data);
	var playerHtml = '<div class="col-sm-4 col-md-3">'
			+ '<div class="box-1 padding-sm" align="center"><br><span class="bold" onclick="playerSelected('
			+ q + data.key + q + c + q + data.val().displayName + q + c + q
			+ data.val().email + q + c + q + data.val().photoURL + q + ')">'
			+ data.val().displayName + '</span><br><br><img alt="" src="'
			+ data.val().photoURL + '" width="100" height="100"><br><br></div>'
			+ '</div>';
	$('#players').append(playerHtml);
}

function playerSelected(uid, name, email, photoUrl) {
	var word = $("#word").val();
	var game = {
		'word' : word,
		'name' : name,
		'email' : email,
		'photoURL' : photoUrl
	};
	
	firebase.database().ref().child('games').push().set(game);
}