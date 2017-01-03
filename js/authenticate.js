
var authType = AuthType.SESSION_RESUME;
var user;
var displayName;

function login() {
	var emailId = $("#emailId").val();
	var password = $("#password").val();
	if (emailId == "" || emailId == null) {
		$("#emailId").focus();
		A("Please enter Email Id");
		return;
	}
	if (password == "" || password == null) {
		$("#password").focus();
		A("Please enter password");
		return;
	}
	SL("Signing In");
	authType = AuthType.SIGN_IN;
	firebase.auth().signInWithEmailAndPassword(emailId, password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  A(errorMessage);
		  HL();
		});
}

authenticate(function(user){
	  L(J(user));
	  switch(authType){
	  case AuthType.SESSION_RESUME:{
	  }case AuthType.SIGN_IN:{
		  nav(localStorage.redirectTo);
		  break;
	  }case AuthType.SIGN_UP:{
		  firebase.database().ref().child('users').child(user.uid).set({
			  displayName : "User",
			  email : user.email,
			  photoURL : user.photoURL
		  }).then(function(){
			  SL("Success! Sending link to verify");
			  var user = firebase.auth().currentUser;
			  
			  user.updateProfile({
				  'displayName': displayName,
				  'photoURL': "https://example.com/jane-q-user/profile.jpg"
				}).then(function() {
				  // Update successful.
					user.sendEmailVerification().then(function() {
						  nav("email-verify.html");
					  }, function(error) {
						  A("Error in sending email verification link");
					  });
				}, function(error) {
				  // An error happened.
				});
			  
		  }).catch(function(){
			  A("Registration Faild");
		  });
		  break;
	  }
	  }
}, function() {
	L("User is not signed in.");
}, 0);

function register() {
	var emailId = $("#email-id").val();
	var password = $("#password-reg").val();
	var confirmPassword = $("#confirm-password").val();
	displayName = $("#displayName").val();
	
	if (displayName == "" || displayName == null) {
		$("#displayName").focus();
		A("Please enter your good name");
		return;
	}
	if (emailId == "" || emailId == null) {
		$("#email-id").focus();
		A("Please enter Email Id");
		return;
	}
	if (password == "" || password == null) {
		$("#password-reg").focus();
		A("Please enter password");
		return;
	}
	if (confirmPassword == "" || confirmPassword == null) {
		$("#confirm-password").focus();
		A("Please enter confirm password");
		return;
	}
	if (confirmPassword != password) {
		$("#confirm-password").val(null);
		$("#password-reg").val(null);
		$("#password-reg").focus();
		A("Password and confirm password mis match");
		return;
	}

	authType = AuthType.SIGN_UP;
	
	SL("Creating Account");
	firebase.auth().createUserWithEmailAndPassword(emailId, password).catch(function(error) {
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  HL();
		  A(errorMessage);
		});
}