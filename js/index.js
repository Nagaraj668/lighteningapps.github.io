$(document).ready(function() {
	$("#logged-in").hide();
});

function onAuthenticateClicked() {
	localStorage.redirectTo = INDEX_PAGE;
	nav("authenticate.html");
}

function profileClicked() {
	nav("profile.html");
}

var thisUser;
var name;
var photoUrl;

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
});

function onAppClicked(APP_CODE) {
	switch (APP_CODE) {
	case CHAT_APP: {
		if (isUndefined(thisUser)) {
			localStorage.redirectTo = "chat.html";
			nav("authenticate.html");
		} else {
			nav("chat.html");
		}
		break;
	}
	case COWS_AND_BULLS_APP: {
		if (isUndefined(thisUser)) {
			localStorage.redirectTo = "cows-and-bulls.html";
			nav("authenticate.html");
		} else {
			nav("cows-and-bulls.html");
		}
		break;
	}
	case HAND_CRICKET_APP: {

		break;
	}
	case NOTES_APP: {

		break;
	}
	case QUIZ_APP: {

		break;
	}
	case CLEAT_DOUBTS_APP: {

		break;
	}
	case FILE_SAVER_APP: {

		break;
	}
	case HEALTH_CARE_APP: {

		break;
	}
	}
}