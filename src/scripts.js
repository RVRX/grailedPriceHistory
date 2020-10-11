//hide content (headers) on load.
$("#auto-content").toggle(false);

//variable that decides whether you can change section tabs or not.
let dataGrabSuccess = false;

//definition for JSON functions to use, defined in outer-scope so that it can be access from any function.
let returnedJSON = null;

//Variables for Section switching. Must be updated for every new section added to the interface, along with a function called in fillData()
    //Format [[#ID_NAME_OF_SECTION],[NAV-LINK-ID]]
const sectionListAndLinkID = [["#section-price-history","price-history-link"],["#section-shipping","shipping-link"],["#section-seller-info","seller-info-link"]];

//Stop the form submission from refreshing the page / redirecting, eats the request and calls functions for JSON requests instead.
(function() {
    var form = document.getElementById("search-form");
    console.log(form);
    function handleForm(event) { event.preventDefault(); clearPreviousResult(); JSONFromInput(); }
    form.addEventListener('submit', handleForm);
})();

//start tooltips
(function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })

})();

//does as it says, clears the last result, doesnt let you change section, until new result is found.
function clearPreviousResult() {
    $("#auto-content").toggle(false);
    dataGrabSuccess = false;
}

// Gets Grailed JSON from an ID or URL
function JSONFromInput() {
    console.log("Starting search")
    setStatus("alert-primary","Starting Search...")
    let input = document.getElementById("search-query").value.toString();
    console.log("input: "+input);
    //parse URL from ID
    //    Example URL: https://www.grailed.com/listings/15582671-kappa-x-vintage-need-gone-vintage-kappa-sidetape-light-jacket
    //    Example ID: 15582671
    if (parseToID(input) !== 0) {
        let listingID = parseToID(input)
        //takes over fetch and propagation
        fetchJSON(listingID);
    } else {
        //set status
        setStatus("alert-danger","Failed! Invalid URL or ID.");
        // return alert("Failed, Invalid URL or ID.")
    }
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

//makes the request for the JSON, and callbacks fetchJSONCallback on completion.
/*TODO
*  parse 404 and timed-out requests into a status
*   maybe do this with by looking at JSON content for 404,
*   or if returnedJSON is still null after x seconds set the error status*/
function fetchJSON(listing) {
    setStatus("alert-secondary", "Fetching Data...")
    $.getJSON("https://cors-anywhere.herokuapp.com/https://www.grailed.com/api/listings/"+listing, fetchJSONCallback);
}

//does the dirty work
function fetchJSONCallback(data) {
    console.log(data);

    //add success status
    setStatus("alert-success", "Request Approved!");
    dataGrabSuccess = true;

    returnedJSON = data["data"];
    //propagation of HTML page
    fillData();
}

//fills the page with content parsed from JSON, each section has a helper function.
function fillData() {

    //Data for
    document.getElementById("listing-title").innerHTML = returnedJSON["title"];

    //Get date and format
    let dateUpdated = new Date(returnedJSON["price_updated_at"]);
    console.log("Date Updated:\n",dateUpdated);
    let [month, date, year] = (dateUpdated).toLocaleDateString().split("/")

    //Create price history table
    let priceHistory = returnedJSON["price_drops"]; //array of prices
        //Empty the table body
    document.getElementById("listing-info-table-body").innerHTML = "";
        //Create table headers
    document.getElementById("listing-info-table-head").innerHTML = "<tr>\n" +
        "            <th scope=\"col\">Price (USD)</th>\n" +
        "            <th scope=\"col\">Date</th>\n" +
        "        </tr>"
        //For each priceHistory item add a row
    for (let i = 0; i < priceHistory.length-1; i++) {
        document.getElementById("listing-info-table-body").innerHTML = document.getElementById("listing-info-table-body").innerHTML + "<tr><td>$" + priceHistory[i] + "</td><td>--</td></tr>";
    }
    //adding most current info
    document.getElementById("listing-info-table-body").innerHTML = document.getElementById("listing-info-table-body").innerHTML + "<tr><td>$" + returnedJSON['price'] + "</td><td>" + month+"/"+date+"/"+year + "</td></tr>";


    // initializeCharts(priceHistory);
    propagateChart(priceHistory);

    //shipping table
    fillShippingInfo();

    //seller info
    fillSellerInfo();

    $("#auto-content").toggle(true);

}

function fillShippingInfo() {
    let shippingInfo = returnedJSON["shipping"];

    //Empty the table body
    document.getElementById("shipping-table-body").innerHTML = "";
    //Create table headers
    document.getElementById("shipping-table-head").innerHTML = "<tr>\n" +
        "            <th scope=\"col\">Location</th>\n" +
        "            <th scope=\"col\">Amount</th>\n" +
        "            <th scope=\"col\">Enabled?</th>\n" +
        "        </tr>"
    //Location Array
    const location = ["us","ca","uk","eu","asia","au","other"];
    //For each priceHistory item add a row
    for (let i = 0; i < 7; i++) {
        document.getElementById("shipping-table-body").innerHTML = document.getElementById("shipping-table-body").innerHTML + "<tr><td>" + location[i] + "</td><td>$ " + shippingInfo[location[i]]['amount'] + "</td><td>" + shippingInfo[location[i]]['enabled'] + "</td></tr>";
    }
}

/*Puts seller info on seller info section
* TODO
*   - finish page fill / format JSON*/
function fillSellerInfo() {
    let sellerInfo = returnedJSON["seller"];
    document.getElementById("section-seller-info").innerHTML = JSON.stringify(sellerInfo);
}

/* Sets a status box on the page, new statuses override old. Statuses do not disappear.
*   TODO
*    add an 'x' button to statuses, or make they timeout on their own
* */
function setStatus(type, text) {
    document.getElementById("statuses").innerHTML = "<div id=\"status-box\" class=\"alert "+type+" mt-3\" role=\"alert\">\n" +
        text +
        "</div>"
}

function propagateChart(inputDataPoints) {
    'use strict'

    feather.replace()
    console.log("Input Data Points: ",inputDataPoints);
    //make x-axis
    let labels = [];
    for (let i = 0; i < inputDataPoints.length; i++) {
        labels.push("");
    }

    // Graphs
    var ctx = document.getElementById('myChart')
    // eslint-disable-next-line no-unused-vars
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                data: inputDataPoints,
                lineTension: 0,
                backgroundColor: 'transparent',
                borderColor: '#007bff',
                borderWidth: 4,
                pointBackgroundColor: '#007bff'
            }]
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: false
                    }
                }]
            },
            legend: {
                display: false
            }
        }
    })
}

function openSection(openMe) {
    if (dataGrabSuccess) {
        console.log("Opening",openMe);
        closeOtherSections(openMe);
    } else console.log("Failed to Open: ",openMe,"condition's not met");
}

function closeOtherSections(keepOpen) {
    //close all sections & remove active status
    for (let i = 0; i < sectionListAndLinkID.length; i++) {
        $(sectionListAndLinkID[i][0]).toggle(false);
        document.getElementById(sectionListAndLinkID[i][1]).classList.remove("active");
    }

    //open keepOpen
    $(keepOpen[0]).toggle(true);
    document.getElementById(keepOpen[1]).classList.add("active");

}

//set the default section view
(function(){
    closeOtherSections(sectionListAndLinkID[0]);

})();
