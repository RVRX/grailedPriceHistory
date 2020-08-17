function getUnhearted() {

	//get all hearts on page
	var hearts = document.getElementsByClassName('heart-follow');

	//add all un-hearted listings to array
	let unhearted = [];
	for(var i = 0; i < hearts.length; i++) {
		// if heart is not filled
		if (hearts[i].getElementsByClassName("heart unfilled")) {
			unhearted.push(hearts[i])
		}
	}
	return unhearted;
}

function clickAllElements(arrayOfElements) {
	for (var i = arrayOfElements.length - 1; i >= 0; i--) {
		arrayOfElements[i].click()
		console.log("Clicked", arrayOfElements[i])
	}
}

//run the functions
setTimeout(function() {
	clickAllElements(getUnhearted())
  	location.reload();
}, 30000);
