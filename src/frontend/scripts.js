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
        //parse URL into id
        return input.replace(/\D/g,'')
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
    return url.contains("grailed.com/listing");
}

function JSONFromListingNumber(listing) {
    let retrievedJSON = $.getJSON("https://www.grailed.com/api/listings/"+listing,function ( data ) {
        let items = [];
        $.each( data, function( key, val ) {
            items.push( "<li id='" + key + "'>" + val + "</li>" );
        });

        $( "<ul/>", {
            "class": "my-new-list",
            html: items.join( "" )
        }).appendTo( "body" );
    });

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