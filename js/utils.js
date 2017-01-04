function authenticate(success, failure, emailVerifyFlag) {
	firebase.auth().onAuthStateChanged(
			function(user) {
				if (user) {
					if (emailVerifyFlag == undefined && !user.emailVerified) {
						// email not verified
						nav("email-verify.html");
					} else {
						firebase.database().ref().child("users")
								.child(user.uid).child("request-status").on(
										"child_added",
										function(data) {
											firebase.database().ref().child(
													"users").child(user.uid)
													.child("request-status")
													.child(data.key).set(
															data.val() + 1);
											L(data.val() + 1);
										});
						localStorage.uid = user.uid;
						success(user);
					}
				} else {
					L("User is not signed in.");
					failure();
				}
			});
}

function signOut() {
	firebase.auth().signOut();
}

function requestStatus(uid, myuid, callback) {
	var rand = random();
	firebase.database().ref().child("users").child(uid).child("request-status")
			.child(myuid).set(rand);
	firebase.database().ref().child("users").child(uid).child("request-status")
			.child(myuid).on(
					'value',
					function(data) {
						// L("data1: " + data.val())
						if (data.val() == rand + 1) {
							firebase.database().ref().child("users").child(uid)
									.child("request-status").child(myuid).set(
											null);
							callback(true);
						} else {
							callback();
						}
					});
}

function A(msg) {
	alert(msg);
}

function L(msg) {
	console.log(msg);
}

function J(obj) {
	return JSON.stringify(obj);
}

function JP(jStr) {
	return JSON.parse(jStr);
}

function nav(path) {
	window.location.href = path;
}

function E(msg){
	L(msg);
}

var AuthType = {
	SESSION_RESUME : 0,
	SIGN_IN : 1,
	SIGN_UP : 2,
	UNAUTHORIZED : 3
};

function validateWord(word) {
	var flag = false;
	if (word != null && word != undefined && word.length == 4
			&& !checkDuplicate(word)) {
		flag = true;
	}
	return flag;
}

function checkDuplicate(str) {
	for (var i = 0; i < str.length; i++) {
		var re = new RegExp("[^" + str[i] + "]", "g");
		if (str.replace(re, "").length >= 2) {
			return true;
		}
	}
	return false;
}

function SL(msg) {
	var loadingHtml = '<div class="loading-box"'
			+ 'style="background: #fff; padding: 5px;" id="loading-msg">' + msg
			+ '...</div>';
	if (($("#loading-container").css('width')) == undefined)
		$("body").append("<div class='loading-container'></div>");
	$(".loading-container").html(loadingHtml);
	$("#loading-msg").css('visibility', "visible");
}

function HL() {
	$("#loading-msg").css('visibility', "hidden");
}

function random() {
	var random1 = Math.floor((Math.random() * 10) + 1);
	L(random1);
	return random1;
}

var monthNames = [ "January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December" ];

function getMonthFullName() {
	var d = new Date();
	return monthNames[d.getMonth()];
}

function getMonthShortName() {
	var d = new Date();
	return monthNames[d.getMonth()].substring(0, 3);
}

function getShortDate() {
	var date = new Date();
	return getMonthShortName() + " " + date.getDate();
}

function isDefined(obj) {
	var flag = false;
	if(obj != undefined && obj != null){
		flag = true;
	}
	return flag;
}

function isUndefined(obj) {
	return !isDefined(obj);
}

function goHome() {
	nav("index.html");
}

// constants

var INDEX_PAGE = "index.html";

var CHAT_APP = 1;
var COWS_AND_BULLS_APP = 2;
var HAND_CRICKET_APP = 3;
var NOTES_APP = 4;
var QUIZ_APP = 5;
var CLEAT_DOUBTS_APP = 6;
var FILE_SAVER_APP = 7;
var HEALTH_CARE_APP = 8;

var q = "'";
var c = ",";