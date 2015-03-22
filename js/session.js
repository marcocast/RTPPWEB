var ref = new Firebase('https://rtpp.firebaseio.com');

var cardsStandard = ["card0", "cardhalf", "card1", "card2", "card3", "card5", "card8", "card13", "card20", "card40", "card100", "cardinfinite", "cardquestion", "cardcoffee"];

var cardsFibonacci = ["card0", "card1", "card2", "card3", "card5", "card8", "card13", "card21", "card34", "card55", "card89", "card144", "cardinfinite", "cardquestion", "cardcoffee"];

var cardsTshirt = ["cardxs", "cards", "cardm", "cardl", "cardxl", "cardxxl", "cardinfinite", "cardquestion", "cardcoffee"];

var totUsers = 0;
var totVotes = 0;

var mapUserImage = {};

var idx = window.location.href.indexOf('?name=');
var sessionname = (idx > 0) ? window.location.href.slice(idx + 6) : '';
if (sessionname == "") {
	window.location.href = "/index.html";
}

function getCard(type, index) {

	if (type == "Standard") {
		return cardsStandard[index];
	} else if (type == "Fibonacci") {
		return cardsFibonacci[index];
	} else if (type == "T-Shirt") {
		return cardsTshirt[index];
	} else {
		return "";
	}
}


$(document).ready(function() {
	var sessionOwner = "";

	var table = $("#container");

	ref.child("session-type").child(sessionname).once("value", function(typeSnapshot) {

		var cardType = typeSnapshot.child("cardType").val();

		ref.child("session-participants").child(sessionname).on("value", function(aSnapshot) {

			aSnapshot.forEach(function(childSnapshot) {

				totUsers++;
				var key = childSnapshot.key();
				var keyNoColum = key.replace(":", "");

				var row = "<div class='item'>";
				row += "<br>";
				row += "<div id='photo_" + keyNoColum + "'></div>";
				row += "<br>";
				row += "<strong id='username_" + keyNoColum + "'></strong>";
				row += "<br>";
				row += "<div id='" + keyNoColum + "'></div>";
				row += "</div>";

				var el = jQuery(row);

				jQuery("#container").append(el).masonry('reload');

				ref.child("users").child(key).once("value", function(userSnapshot) {
					
					var username = userSnapshot.child("username").val();
					$("#username_" + keyNoColum).html(username);
					
					
					
					var photo = userSnapshot.child("photo").val();
					var photoImg = "<img src='img/user.png' height='160' width='100'>";
					if (photo != null && photo != "") {
						var img = new Image();
						img.src = "data:image/png;base64,"+photo.toString().trim();
						img.style.height = '100px';
                        img.style.width = '100px';
						document.getElementById("photo_" + keyNoColum).appendChild(img);
					}else{
						var img = new Image();
						img.src = "img/user.png";
						img.style.height = '100px';
                        img.style.width = '100px';
						document.getElementById("photo_" + keyNoColum).appendChild(img);
					}

				});

				ref.child("session-votes").child(sessionname).child(key).once("value", function(childSnapshot) {
					var card = childSnapshot.child("card").val();
					var cardImg = "<img src='img/cards/blank_card.png' height='160' width='100'>";
					if (card != null && card != "none") {
						cardImg = "<img src='img/card_back.png' height='160' width='100'>";
						totVotes++;
						mapUserImage[keyNoColum] = "<img src='img/cards/" + getCard(cardType, parseInt(card)) + ".jpg'>";
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

	});

	ref.child("session-participants").child(sessionname).on("child_changed", function(childSnapshot) {
		location.reload();
	});

	ref.child("session-votes").child(sessionname).on("child_changed", function(childSnapshot) {
		location.reload();
	});

});

