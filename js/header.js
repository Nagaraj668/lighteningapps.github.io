$(document).ready(function() {
	$.get("header.html", function(data) {
		$("#header").html(data);
	});
});

function logout() {
	firebase.auth().signOut();
}

var count = 0;

firebase
		.database()
		.ref()
		.child('users')
		.child(localStorage.uid)
		.child('notifications')
		.on(
				'child_added',
				function(data) {
					var newLabel = '';
					if (!data.val().viewed) {
						count++;
						newLabel = "<p class'col-sm-4 badge alert-success'>New</p>";
					}

					$('#notifyCount').show();
					$('#notifyCount').text(count);

					var notifyItemHtml = '<a onclick="onNotificationItemClick(this, '
							+ data.val().code
							+ ', \''
							+ data.val().gameType
							+ '\''
							+ ', \''
							+ data.val().user.displayName
							+ '\''
							+ ', \''
							+ data.val().user.uid
							+ '\''
							+ ', \''
							+ data.val().user.photoURL
							+ '\''
							+ ', \''
							+ data.val().message
							+ '\''
							+ ', \''
							+ data.val().requestedOn
							+ '\''
							+ ')" href="#" class="list-group-item"><div class="row"><div class="col-sm-2"><img alt="" src="'
							+ data.val().user.photoURL
							+ '" width="50">'
							+ '</div><div class="col-sm-8"><div class="col-sm-8"><h4 class="list-group-item-heading bold">'
							+ data.val().user.displayName
							+ '</h4></div><div class="col-sm-4">'
							+ data.val().requestedOn
							+ '</div>'
							+ '<p class="col-sm-8 list-group-item-text">'
							+ data.val().gameType
							+ '</p>'
							+ newLabel
							+ '</div><div class="col-sm-2"><button type="button" class="close" onclick="closeNotifyItem(this, \''+data.key+'\')"'
							+ 'data-dismiss="alert"aria-label="Close"><span aria-hidden="true">&times;</span></button></div></div></a>';
					appendNotifications(notifyItemHtml, function() {
						firebase.database().ref().child('users').child(
								localStorage.uid).child('notifications').child(
								data.key).child('viewed').set(true);
					});
				});

function notifications() {
	nav("notifications.html");
}