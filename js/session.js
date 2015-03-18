var ref = new Firebase('https://rtpp.firebaseio.com');

$(document).ready(function() {
	var sessionOwner = "";

	var table = $("#container");

	$('#container').masonry({
		itemSelector : '.item',
		columnWidth : 200
	});

	ref.child("session-participants").child("mmm").on("child_added", function(childSnapshot) {
		// key will be "fred" the first time and "wilma" the second time
		var key = childSnapshot.key();

		// childData will be the actual contents of the child
		var username = childSnapshot.child("username").val();

		var row = "<div class='item'>";
		row += "<br>";
		row += "<strong>" + username + "</strong>";
		row += "<br>";
		row += "<div id='" + key.replace(":", "") + "'></div>";
		row += "</div>";

		var el = jQuery(row);

		table.append(el).masonry('appended', el).fadeIn();

		ref.child("session-votes").child("mmm").child(key).once("value", function(childSnapshot) {
			// key will be "fred" the first time and "wilma" the second time
			var key = childSnapshot.key();

			// childData will be the actual contents of the child
			var card = childSnapshot.child("card").val();
			var cardImg = "<img src='img/card_back.png' height='42' width='42'>";
			if (card != null && card != "none") {
				cardImg = "<img src='img/about/1.jpg' height='42' width='42'>";
			}

			$("#" + key.replace(":", "")).html(cardImg);

		});

	});

	ref.child("session-votes").child("mmm").on("child_changed", function(childSnapshot) {
		// key will be "fred" the first time and "wilma" the second time
		var key = childSnapshot.key();

		// childData will be the actual contents of the child
		var card = childSnapshot.child("card").val();

		var card = childSnapshot.child("card").val();
		var cardImg = "<img src='img/card_back.png' height='42' width='42'>";
		if (card != null && card != "none") {
			cardImg = "<img src='img/about/1.jpg' height='42' width='42'>";
		}

		$("#" + key.replace(":", "")).html(cardImg);

	});

});

