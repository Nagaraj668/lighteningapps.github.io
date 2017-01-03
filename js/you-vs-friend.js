$(document).ready(function() {
	$.get("header.html", function(data) {
		$("#header").html(data);
	});
	
	$("#word").keyup(function(e){
	    if(e.keyCode == 13) {
	    	proceedToFindOpponentWord();
	    }
	});
});

// Authenticating the user
var name, email, photoUrl, uid;
authenticate(function(user) {
	var user = firebase.auth().currentUser;
	if (user != null) {
		name = user.displayName;
		email = user.email;
		photoUrl = user.photoURL;
		uid = user.uid;
	}
	if (name == null || name == "null" || name == "") {
		name = "User";
	}
	$("#username").text(name);
	if (photoUrl != null) {
		$("#photoPic").attr('src', photoUrl);
	}
}, function() {
	nav("index.html");
});

function proceedToFindOpponentWord() {
	if (uid == null) {
		A("Please wait...");
		return;
	}
	var word = $("#word").val();
	if (validateWord(word)) {
		var key = firebase.database().ref().child('users/'+uid).child('matches').push().key;
		firebase.database().ref().child('users/'+uid).child('matches/' + key).set({
			'WordToOpponent' : word
		}).then(function() {
			A('done');
		}).catch(function() {
			A('error');
		});
	} else {
		A("Invalid word");
		$("#word").focus();
		$("#word").select();
	}
}

function back() {
	window.history.back();
}