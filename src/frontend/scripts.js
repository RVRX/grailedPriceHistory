//todo the python script could be used here to grab search queries.

// Gets JSON from an ID or URL
function JSONFromInput(input) {
    //parse URL from ID
    //    Example URL: https://www.grailed.com/listings/15582671-kappa-x-vintage-need-gone-vintage-kappa-sidetape-light-jacket
    //    Example ID: 15582671
    if (parseToID(input) !== 0) {
        let listingID = parseToID(input)
    } else return alert("Failed, Invalid URL or ID.")

//    get JSON from id

}

//Pareses the into to an ID, returns 0 if invalid.
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

function JSONFromListingNumber(listing) {
    let retrievedJSON = $.getJSON("https://cors-anywhere.herokuapp.com/https://www.grailed.com/api/listings/"+listing)
        // let items = [];
        // $.each( data, function( key, val ) {
        //     items.push( "<li id='" + key + "'>" + val + "</li>" );
        // });
        //
        // $( "<ul/>", {
        //     "class": "my-new-list",
        //     html: items.join( "" )
        // }).appendTo( "body" );
    // });

    console.log(retrievedJSON);



}

// $.getJSON( "ajax/test.json", function( data ) {
//     var items = [];
//     $.each( data, function( key, val ) {
//         items.push( "<li id='" + key + "'>" + val + "</li>" );
//     });
//
//     $( "<ul/>", {
//         "class": "my-new-list",
//         html: items.join( "" )
//     }).appendTo( "body" );
// });