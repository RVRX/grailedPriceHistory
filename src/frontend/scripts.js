//todo the python script could be used here to grab search queries.

// Gets Grailed JSON from an ID or URL
function JSONFromInput(input) {
    //parse URL from ID
    //    Example URL: https://www.grailed.com/listings/15582671-kappa-x-vintage-need-gone-vintage-kappa-sidetape-light-jacket
    //    Example ID: 15582671
    if (parseToID(input) !== 0) {
        let listingID = parseToID(input)
        //takes over fetch and propagation
        fetchJSON(listingID);
    } else return alert("Failed, Invalid URL or ID.")
}

//Parses the into to an ID, returns 0 if invalid.
function parseToID(input) {
    if (isValidID(input)) {
        return input;
    } else if (isValidURL(input)) {
        for (let i = 0; i < input.length; i++) { //i=1, to skip potential trailing backslashes
            // if (/^\d+$/.test(input.charAt(input.length-i))) {
            if (/^\/+$/.test(input.charAt(input.length-(i+2)))) { //input.length-(i+2), to go from back to front, and skip last item
                console.log("There is a slash at pos "+i);
                let lastSlash = input.length-(i+1);
                console.log("last slash is at "+lastSlash);
                for (let j = lastSlash; j < input.length; j++) { //from the lastSlash to end, look for '-', remove dash and everything after it.
                    if (/^-+$/.test(input.charAt(j))) {
                        let firstDash = j;
                        console.log("First dash is at "+firstDash);
                        console.log(input.slice(lastSlash,firstDash));
                        return input.slice(lastSlash,firstDash);
                    }
                }
            }
        }
        //parse URL into id
        return input.replace(/\D/g,''); //keeping regex here in-case there are no dashes
        // return input
    } else {
        console.log("This is not a valid URL or ID! " + input)
        return 0;//TODO throw an exception?
    }
}

//checks if arg only contains [0-9]
function isValidID(id) {
    //regex for [0-9]
    return /^\d+$/.test(id);
}

//checks if arg contains "grailed.com/listing"
function isValidURL(url) {
    // console.log(url.contains("grailed.com.listing"))
    return url.includes("grailed.com/listing");
}

let returnedJSON = null;
function fetchJSON(listing) {
    // listing = parseToID(listing);
    $.getJSON("https://cors-anywhere.herokuapp.com/https://www.grailed.com/api/listings/"+listing, fetchJSONCallback);
}

//does the dirty work
function fetchJSONCallback(data) {
    console.log(data);
    returnedJSON = data["data"];
    //propagation of HTML page
    fillData();
}

function fillData() {
    document.getElementById("price-current").innerText = returnedJSON["price"];
    document.getElementById("price-history").innerHTML = returnedJSON["price_drops"];
    document.getElementById("listing-title").innerHTML = returnedJSON["title"];
   /*TODO
   * Created at, show users when this listing was first posted
   * "fee", what is this??
   * "shipping:us:amount", show shipping amount by country
   * "price_updated_at", last time the price was updated
   * */
}