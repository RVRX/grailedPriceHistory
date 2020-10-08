# Grailed Scraper Plan

## WebScraper
Goes to Grailed every X hour/min, pull item ID's and their prices.
	If ID *is not* in database, add it and the corresponding price.
	If ID *is* in database add new price to price history.

### How to set up DB:
#### _Option 1_
A table for every ID, rows for price history

id_XXX : table

|  price | date_found |
|--------|------------|
| 35.00  | 01022020   |
| 34.00  | 01190220   |

#### _Option 2_
One master price_history table.
ID column, and history column, every row will be an ID 

price_history : table

| item_ID | price | date_found |
|---------|-------|------------|
|   XXX   | 35.00 |  01022020  |
|   XXX   | 34.00 |  01192020  |


####_Option X.1_
Meta-data table

|  ID  | current_name | first_found | last_found | original_price |
|------|--------------|-------------|------------|----------------|
| XXXX |    "Name"    |   mmddyyyy  |  mmddyyyy  |      00.00     |


## WebServer
### What it be
Idea is to have a like meta-Grailed page, when you click on the listing it should take you to a page listing the price history. Maybe make the directory look just like normal Grailed. If the DB gets big, might not be a good idea to just list all of the items, will need some sort of search? Maybe ONLY have a search, and you just put in the item id/URL (will be parsed to id, if possible).
A Browser extension for price history (or tamperMonkey script)? Will only work on Grailed.com, a little pop-up or extra button that you click to redirect to price history page.

### What it do
Pulls from DB server on page load? Twig/Slim templates? Make an API?


## Hosting
Use RPI for DB, use black.host web-server. Easiest way would probably be using a .SQLite file that I can easily copy back and forth between servers. Can PHP or any other web technology wget files? Maybe the whole thing could be on webserver if I can webscrape with PHP? would be weird IIRC you can asynchronously run PHP, I'd have to visit the web page every so-often in order to run the scraper? You cant realistically have this happen when someone visits the page because it would take forever to load.

Update: after some research it seems like Python is the best way to proceed. I think I can use cPanel's 'Cron Jobs' to run the web scraper every so often.
OR
It looks like I can set up a python application through "Setup Python App" on cPanel, which I'm guessing will allow me to run a script that just loops through the scraper every so often.

## Pseudo-Implementation (Kappa Specific)

visit "https://www.grailed.com/shop/_2L7OmxvvQ" (URL for Kappa, unsure how it hashes/decides on the specific URL)

within `<div class="feed"></div>` look for every `<div class="feed-item"></div>`.

for each `class="feed-item"`:
* Get Price
	* Prices look different depending on whether or not there is a sale/discount
	* Navigate to `<div class="listing-price-and-heart">` -> `<div class="listing-price">` -> `<p class="sub-title origional-price">` -> `<span>` -> PRICE IS HERE.
	* Navigate to `<div class="listing-price-and-heart">` -> `<div class="listing-price">` -> `<p class="sub-title new-price">` -> `<span>` -> PRICE IS HERE.
	* Boils down to: `<div class="listing-price">` **first** element (`<p>`), Innermost content/text.
* Get ID
	* EX: `<a class="listing-item-link" href="/listings/17210964-kappa-kappa-big-logo-trench-coat-breathable-waterproof-jacket" rel="noopener noreferrer" target="_blank">` ID is 17210964. So:
	* `<a class="listing-item-link" href="/listings/{ID}-{IGNORE}">` (so content AFTER "/listings/", and BEFORE "-").
* 
	If ID exists in table / Table for ID exists: 
		Go to ID and add new price and crawl date
	If ID does not exist in table / Table for ID does not exist:
		Create ID Table / Col


#Updates
Base scrapy won't work on grailed. Scrapy just sorta wgets the site, so its not able to work on dynamic content (Grailed is ReactJS). Looks like I can use the Selenium package - seems to be some sort of headless browser api, along with https://github.com/clemfromspace/scrapy-selenium, to try and get things working. Left off with things not working, think it might be becuase of missing dependencies on the WSL or the like
