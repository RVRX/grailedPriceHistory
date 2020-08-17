let unhearted = [];

var hearts = document.getElementsByClassName('heart-follow');

for(var i = 0; i < hearts.length; i++) {
	// if heart is not filled
	if (hearts[i].getElementsByClassName("heart unfilled")) {
		unhearted.push(hearts[i])
	}
}

// heart all unhearted elements
for (var i = unhearted.length - 1; i >= 0; i--) {
	unhearted[i].click()
}
