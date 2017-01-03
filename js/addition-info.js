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
		$("#profilePic").attr('src', photoUrl);
	}
}, function() {
	nav("index.html");
});

$.get({
	url : "update-name.html",
	cache : false
}).then(function(data) {
	$("#contentArea").html(data);
});

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
					$.get({
						url : "profile-photo.html",
						cache : false
					}).then(function(data) {
						HL();
						$("#contentArea").html(data);
					});
				});
			}, function(error) {
				// An error happened.
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

	// Register three observers:
	// 1. 'state_changed' observer, called any time the state changes
	// 2. Error observer, called on failure
	// 3. Completion observer, called on successful completion
	uploadTask.on('state_changed', function(snapshot) {
		// Observe state change events such as progress, pause, and resume
		// Get task progress, including the number of bytes uploaded and the
		// total number of bytes to be uploaded
		var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
		// SL('Upload is ' + progress.toFixed(2) + '% done');
		$(".progress-bar").css('width', progress.toFixed(2) + '%');
		/*
		 * switch (snapshot.state) { case firebase.storage.TaskState.PAUSED: //
		 * or 'paused' SL('Upload is paused'); break; case
		 * firebase.storage.TaskState.RUNNING: // or 'running' SL('Upload is
		 * running'); break; }
		 */
	}, function(error) {
		// Handle unsuccessful uploads
		SH(error);
	}, function() {
		// Handle successful uploads on complete
		// For instance, get the download URL:
		// https://firebasestorage.googleapis.com/...
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
					// An error happened.
				});

	});
}

function uploadPhoto() {
	$("#selectedFile").trigger("click");
}

function proceedToGame() {
	nav("game.html");
}

function skipProfilePhoto() {
	proceedToGame();
}