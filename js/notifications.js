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

function appendNotifications(html, callback) {
	$('#notifyList').append(html);
	callback();
}

function onNotificationItemClick(element, code, gameType, name, uid, photoUrl,
		message, reqOn) {

	if (closingFlag) {
		closingFlag = false;
		return;
	}

	$('#reqDetails').show();
	$('#reqPhoto').attr('src', photoUrl);
	$('.active').removeClass('active');
	$(element).addClass('active');
	$('#requestorName').text(name);
	$('#reqOn').text(reqOn);
	$('#message').text(message);

}

$(document).ready(function() {
	$('#reqDetails').hide();
});

var closingFlag;
function closeNotifyItem(element, key) {
	closingFlag = true;
	$(element).parent().parent().parent().hide();
	firebase.database().ref().child('users').child(localStorage.uid).child(
			'notifications').child(key).set(null);
}