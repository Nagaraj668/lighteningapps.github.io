
var email, passwordFlag = false;
authenticate(function(user) {
	if(user.emailVerified){
		$("#verifyStatus").hide();
		$("#checkNowBtn").hide();
		$("#logoutBtn").hide();
		$("#emailId").hide();
		$("#alertMsg").html("<p>"+user.email+"</p><h2>Your email has been verified</h2><br> <p> Taking you to games page in few seconds...<p>");
		setInterval(function() {
			nav("additional-details.html");	
		}, 5000);
	}
	$("#verifyStatus").text("Verification pending");
	email = user.email;
	$("#emailId").text(user.email);
	$("#password").hide();
	passwordFlag = false;
}, function() {
	nav("index.html");
}, 0);

$(document).ready(function() {
	$("#password").hide();
});

function checkNow() {
	if (!passwordFlag){
		passwordFlag = true;
		$("#password").show();
		
		$("#password").focus();
		return;
	}
	var password = $("#password").val();
	if (password == "" || password == null) {
		$("#password").focus();
		alert("Please enter Password");
		return;
	}
	
	$("#password").val(null);
	$("#password").hide();
	$("#verifyStatus").text("Checking...");
	firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
		passwordFlag = false;
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  $("#verifyStatus").text(errorMessage);
		});;
}


function logout() {
	firebase.auth().signOut().then(function() {
		  // Sign-out successful.
		}, function(error) {
		  // An error happened.
		});
}