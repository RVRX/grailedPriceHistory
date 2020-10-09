//todo the python script could be used here to grab search queries.

// Gets Grailed JSON from an ID or URL
function JSONFromInput(input) {
    //parse URL from ID
    //    Example URL: https://www.grailed.com/listings/15582671-kappa-x-vintage-need-gone-vintage-kappa-sidetape-light-jacket
    //    Example ID: 15582671
    if (parseToID(input) !== 0) {
        let listingID = parseToID(input)

        // get JSON from id
        // return fetchJSON(listingID); //todo parse this JSON down a level - to "responseText" - before returning.
        fetchJSON(listingID); //todo set up this function to take over from here
        // return returnedJSON
        // return returnedJSON["data"]["price_drops"]
        // return returnedJSON;
        // return JSONFromListingNumber(listingID)["responseJSON"];
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

function isValidID(id) {
    //regex for [0-9]
    return /^\d+$/.test(id);
}

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
    // console.log("DATA: "+ JSON.stringify(data));
    returnedJSON = data["data"];
    let listingPriceDrops = returnedJSON["price_drops"];
    let listingCurrentPrice = returnedJSON["price"];
    let listingName = returnedJSON["title"]
    fillData(listingCurrentPrice,listingPriceDrops,listingName);
}

function fillData(currentPrice, priceHistory, name) {
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

function testFcn() { //todo im thinking the issue is that im trying to parse an already parsed JSON?
    let kount = JSONFromInput("https://www.grailed.com/listings/15582671-kappa-x-vintage-need-gone-vintage-kappa-sidetape-light-jacket");
    // const obj = JSON.parse(kount);
    // console.log(obj.responseJSON);
    // return kount["Object"];
    //todo why does this all work fine the the browser but won't work here?
    let temp1 = JSONFromInput("https://www.grailed.com/listings/15582671-kappa-x-vintage-need-gone-vintage-kappa-sidetape-light-jacket");
    let temp2 = temp1["responseJSON"]["data"]["price_drops"];
    // let temp3 = JSON.parse(temp2);
    // return JSON.parse(kountTwo);
    // return temp1;
    return temp2;
    // return temp
    console.log("kount is:\n"+kount);
    let kountTwo = JSON.stringify(kount);
    console.log("kountTwo is: \n"+ kountTwo);
    console.log("Parsed kountTwo is: \n"+JSON.parse(kountTwo));
    // return kountTwo
// let xyz = retrievedJSON["responseJSON"]["data"]["price_drops"];

}
function test() {
    let retrievedJSON = $.getJSON("https://cors-anywhere.herokuapp.com/https://www.grailed.com/api/listings/15582671")
    // return retrievedJSON["responseJSON"]["data"]["price_drops"];
    // return JSON.stringify(retrievedJSON);
    // return JSON.stringify(retrievedJSON);
// return parsedStringifyJSON;
    return retrievedJSON;

}
function testTwo() {
    let retrievedJSON = $.getJSON("https://cors-anywhere.herokuapp.com/https://www.grailed.com/api/listings/15582671");
    let stringifyJSON = JSON.stringify(retrievedJSON);
    let parsedStringifyJSON = JSON.parse(stringifyJSON)
//deefining for later use in fetchJSON callback fcn.
    return stringifyJSON;

}
function testThree() {
    $.getJSON("https://cors-anywhere.herokuapp.com/https://www.grailed.com/api/listings/15582671", function(test) {
        returnedJSON = test;
        console.log(JSON.stringify(test));
        return returnedJSON;
    });
}
function fetchJSONTEST() {
    $.getJSON("https://cors-anywhere.herokuapp.com/https://www.grailed.com/api/listings/15582671", callbackFuncWithData);
}
function callbackFuncWithData(data)
{
    console.log(data)
    returnedJSON = data;
}