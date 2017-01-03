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
	updateValues(dataUrl);
	if(signInFlag){
		SL("Updating password");
		var user = firebase.auth().currentUser;
		user.updatePassword(currentPassword).then(function() {
			A("You are logged out, Please login again");
			firebase.auth().signOut();
		}, function(error) {
		});
	}
}, function() {
	nav("index.html");
});

function updateValues(data) {
	switch (data) {
	case "name-update.html":
		$("#displayName").val(name);
		break;
	case "profile-photo-update.html":

		break;
	case "change-password.html":

		break;
	default:
		break;
	}
}

var dataUrl;
function updatedataUrl(dataUrl) {
	this.dataUrl = dataUrl;
}

function updateName() {
	var displayName = $('#displayName').val();
	if (displayName == null || displayName == "") {
		$('#displayName').focus();
		A("Please enter your good name");
		return;
	}
	SL('Updating Name');
	var user = firebase.auth().currentUser;
	user.updateProfile({
		displayName : displayName
	}).then(
			function() {
				firebase.database().ref().child('users/' + uid).child(
						"displayName").set(displayName).then(function() {
					$("#username").text(displayName);
					HL();
				});
			}, function(error) {
			});
}

function initUpload() {

	var selectedFile = $('#selectedFile').get(0).files[0];
	if (selectedFile == null) {
		A("Please select photo");
		return;
	}
	$(".progress").show();
	var storageRef = firebase.storage().ref();
	var profileImageRef = storageRef.child('users/' + uid
			+ '/profilePicture.png');
	var uploadTask = profileImageRef.put(selectedFile);
	uploadTask.on('state_changed', function(snapshot) {
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		$(".progress-bar").css('width', progress.toFixed(2) + '%');
	}, function(error) {
		SH(error);
	}, function() {
		var downloadURL = uploadTask.snapshot.downloadURL;
		L(downloadURL);
		var user = firebase.auth().currentUser;
		$('#skipBtn').hide();
		user.updateProfile({
			photoURL : downloadURL
		}).then(
				function() {
					$("#profilePic").attr("src", downloadURL);
					$("#photoPic").attr('src', downloadURL);
					firebase.database().ref().child('users/' + uid).child(
							"photoURL").set(downloadURL).then(function() {
						HL();
					});
				}, function(error) {
				});
	});
}

function uploadPhoto() {
	$("#selectedFile").trigger("click");
}

var currentPassword;
var confirmPassword;
var signInFlag = false;

function updatePassword() {
	var oldPassword = $("#oldPassword").val();
	currentPassword = $("#currentPassword").val();
	confirmPassword = $("#confirmPassword").val();
	if (oldPassword == null || oldPassword == "") {
		A("Please enter old password");
		$("#oldPassword").focus();
		return;
	}
	if (currentPassword == null || currentPassword == "") {
		A("Please enter current password");
		$("#currentPassword").focus();
		return;
	}
	if (confirmPassword == null || confirmPassword == "") {
		A("Please enter confirm password");
		$("#confirmPassword").focus();
		return;
	}
	
	if (confirmPassword != currentPassword) {
		A("Current password and confirm password don't match");
		$("#currentPassword").focus();
		$("#currentPassword").val(null);
		$("#confirmPassword").val(null);
		return;
	}
	if(signInFlag == false){
		signInFlag = true;
		SL("Checking old password");
		firebase.auth().signInWithEmailAndPassword(email, oldPassword).catch(function(error) {
			A(error.message);
			HL();
		});
	}
}