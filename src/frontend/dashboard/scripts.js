//todo the python script could be used here to grab search queries.
//prevent form submission (https://stackoverflow.com/questions/19454310/stop-form-refreshing-page-on-submit)
// $("#search-form").submit(function(e) {
//     e.preventDefault();
// });
let dataGrabSuccess = false;


var form = document.getElementById("search-form");
console.log(form);
function handleForm(event) { event.preventDefault(); clearPreviousResult(); JSONFromInput(); }
form.addEventListener('submit', handleForm);

$("#auto-content").toggle(false);
// $("#section-shipping").toggle(false);
// defaultSectionView();


//start tooltips
var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'))
var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
})




// var $yourUl = $("#auto-content");
// $yourUl.css("display", $yourUl.css("display") === 'none' ? '' : 'none');
// $("input").keypress(function(event) {
//     if (event.which == 13) {
//         event.preventDefault();
//         $("form").submit();
//     }
// });

// $('#search-form input').keydown(function(e) {
//     if (e.keyCode == 13) {
//         $('#search-form').submit();
//     }
// });

function clearPreviousResult() {
    $("#auto-content").toggle(false);
    dataGrabSuccess = false;

    // if (document.getElementById("auto-content"))
    // document.getElementById("auto-content").innerHTML = "<span id=\"statuses\" class=\"justify-content-center\"></span>\n" +
    //     "\n" +
    //     "        <span id=\"listing-title\"></span>\n" +
    //     "\n" +
    //     "        <table class=\"table\" id=\"listing-info-table\">\n" +
    //     "            <thead id=\"listing-info-table-head\">\n" +
    //     "            <!--Will be propagated by fillData()-->\n" +
    //     "            </thead>\n" +
    //     "            <tbody id=\"listing-info-table-body\">\n" +
    //     "            <!--Will be propagated by fillData()-->\n" +
    //     "            </tbody>\n" +
    //     "        </table>\n" +
    //     "\n" +
    //     "        <div id=\"chartContainer\" style=\"height: 100%; width: 100%;\"></div>";
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

let returnedJSON = null;
function fetchJSON(listing) {
    setStatus("alert-secondary", "Fetching Data...")
    // listing = parseToID(listing);
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

function fillData() {
    //Animate incoming content
    // document.getElementById("auto-content").classList.add("aos-init");

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
        "            <th scope=\"col\">Price</th>\n" +
        "            <th scope=\"col\">Date</th>\n" +
        "        </tr>"
        //For each priceHistory item add a row
    for (let i = 0; i < priceHistory.length-1; i++) {
        document.getElementById("listing-info-table-body").innerHTML = document.getElementById("listing-info-table-body").innerHTML + "<tr><td>$" + priceHistory[i] + "</td><td>--</td></tr>";
    }
    //adding most current info
    document.getElementById("listing-info-table-body").innerHTML = document.getElementById("listing-info-table-body").innerHTML + "<tr><td>" + returnedJSON['price'] + "</td><td>" + month+"/"+date+"/"+year + "</td></tr>";

    // document.getElementById("price-history").innerHTML = returnedJSON["price_drops"];

    //adding shipping
    // document.getElementById("shipping-cost").innerText = returnedJSON["shipping"]["us"]["amount"];

    // initializeCharts(priceHistory);
    propagateChart(priceHistory);

    //shipping table
    fillShippingInfo();

    //seller info
    fillSellerInfo();

   /*TODO
   * Created at, show users when this listing was first posted
   * "fee", what is this??
   * "shipping:us:amount", show shipping amount by country
   * "price_updated_at", last time the price was updated
   * */
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

function fillSellerInfo() {
    let sellerInfo = returnedJSON["seller"];
    document.getElementById("section-seller-info").innerHTML = "SAMPLE SELLER INFO";
}

function initializeCharts(inputDataPoints) {
    console.log("inputDataPoints: ", inputDataPoints);
    var x1 = []; //make 1-n, where n is array.length
    for (let i = 0; i < inputDataPoints.length; i++) {
        x1.push(i+1);
        console.log("array is:",x1);
    }
    var y1 = inputDataPoints;
    var dataPoints = [];

    for (var i = 0; i < x1.length; i++) {
        dataPoints.push({
            x: x1[i],
            y: y1[i]
        });
    }


    console.log("Final Input for Graph is:",x1,y1);

    var chart = new CanvasJS.Chart("chartContainer", {
        title: {
            // text: " Populating chart using array "
        },
        axisY: {
            title: "Price ($)",
        },
        axisX: {
            title: "",
            interval: 1,
            labelFontSize: 0,
            tickThickness: 0,
        },
        data: [{
            type: "line",
            dataPoints: dataPoints
        }]
    });

    chart.render();
}

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
// propagateChart();

// function getShipping() {
//     if (dataGrabSuccess) {
//         console.log("getShipping() ACCEPTED");
//         // $("#section-shipping").toggle(true);
//         closeOtherSections("#section-shipping")
//         return null;
//     }
//     console.log("getShipping() DENIED");
//
// }


const sectionList = ["#section-price-history","#section-shipping","#section-seller-info"];
// const sectionListNoPound = sectionList.map(s => s.slice(1));
const linkIDs = ["price-history-link","shipping-link","seller-info-link"];
const sectionListAndLinkID = [["#section-price-history","price-history-link"],["#section-shipping","shipping-link"],["#section-seller-info","seller-info-link"]];
// (function(){
//     for (let i = 0; i < sectionList.length; i++) {
//         sectionListNoPound.push(sectionList[i].)
//     }
// })();

function openSection(openMe) {
    if (dataGrabSuccess) {
        console.log("Opening",openMe);
        closeOtherSections(openMe);
    } else console.log("Failed to Open: ",openMe,"condition's not met");
}

function closeOtherSections(keepOpen) {
    //close all sections & remove active status
    for (let i = 0; i < sectionList.length; i++) {
        $(sectionListAndLinkID[i][0]).toggle(false);
        document.getElementById(sectionListAndLinkID[i][1]).classList.remove("active");
    }

    //open keepOpen
    $(keepOpen[0]).toggle(true);
    document.getElementById(keepOpen[1]).classList.add("active");

}

// function defaultSectionView() {
//     closeOtherSections(sectionList[0]);
// }

//set the default section view
(function(){
    closeOtherSections(sectionListAndLinkID[0]);

})();

// defaultSectionView();
