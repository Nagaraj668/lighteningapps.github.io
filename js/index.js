
$(document).ready(function() {
	$("#loggedin").hide();
});

function onAuthenticateClicked() {
	localStorage.redirectTo = INDEX_PAGE;
	nav("authenticate.html");
}

var thisUser;
var name;
var photoUrl;

authenticate(function(user) {
	thisUser = user;
	if (user != null) {
		A(J(user));
		name = user.displayName;
		photoUrl = user.photoURL;
		$("#yet-to-login").hide();
		$("#loggedin").show();
	}
	if (name == null || name == "null" || name == "") {
		name = "User";
	}
	$("#displayName").text(name);
	if (photoUrl != null) {
		$("#profilePhoto").attr('src', photoUrl);
	}
}, function() {
	E("user not signed in");
});
