
var thisUser;
var name;
var photoUrl;

authenticate(function(user) {
	thisUser = user;
	if (user != null) {
		name = user.displayName;
		photoUrl = user.photoURL;
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
