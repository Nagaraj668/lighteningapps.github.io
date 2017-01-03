
var authType = AuthType.SESSION_RESUME;
var user;

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
		A("Please enter Password");
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
			  user.sendEmailVerification().then(function() {
				  nav("email-verify.html");
			  }, function(error) {
				  A("Error in sending email verification link");
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
	var emailId = $("#emailId").val();
	var password = $("#password").val();
	if (emailId == "" || emailId == null) {
		$("#emailId").focus();
		A("Please enter Email Id");
		return;
	}
	if (password == "" || password == null) {
		$("#password").focus();
		A("Please enter Password");
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