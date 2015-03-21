var ref = new Firebase('https://rtpp.firebaseio.com');

var cards = ["card0", "cardhalf", "card1", "card2", "card3", "card5", "card8", "card13", "card20", "card40", "card100", "cardinfinite", "cardquestion", "cardcoffee"];

var totUsers = 0;
var totVotes = 0;

var mapUserImage = {};

$(document).ready(function() {
	var sessionOwner = "";

	var table = $("#container");

	
	ref.child("session-participants").child("mmm").on("value", function(aSnapshot) {

		aSnapshot.forEach(function(childSnapshot) {

			totUsers++;
			var key = childSnapshot.key();
			var keyNoColum = key.replace(":", "");

			var username = childSnapshot.child("username").val();

			var row = "<div class='item'>";
			row += "<br>";
			row += "<strong>" + username + "</strong>";
			row += "<br>";
			row += "<div id='" + keyNoColum + "'></div>";
			row += "</div>";

			var el = jQuery(row);
			
			jQuery("#container").append(el).masonry( 'reload' );

			ref.child("session-votes").child("mmm").child(key).once("value", function(childSnapshot) {
				var card = childSnapshot.child("card").val();
				var cardImg = "<img src='img/cards/blank_card.png' height='160' width='100'>";
				if (card != null && card != "none") {
					cardImg = "<img src='img/card_back.png' height='160' width='100'>";
					totVotes++;
					mapUserImage[keyNoColum] = "<img src='img/cards/" + cards[parseInt(card)] + ".jpg'>";
				} else if (totVotes > 0) {				
					totVotes--;
				}

				$("#" + keyNoColum).html(cardImg);

				if (totUsers <= totVotes) {
					for (var id in mapUserImage) {
						if (mapUserImage.hasOwnProperty(id)) {
							$("#" + id).html(mapUserImage[id]);
						}
					}
				} 
			});

		});

	});

	ref.child("session-participants").child("mmm").on("child_changed", function(childSnapshot) {
		location.reload();
	});

	ref.child("session-votes").child("mmm").on("child_changed", function(childSnapshot) {
		location.reload();
	});

});

