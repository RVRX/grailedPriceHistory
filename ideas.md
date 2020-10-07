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

## WebServer
### What it be
Idea is to have a like meta-Grailed page, when you click on the listing it should take you to a page listing the price history. Maybe make the directory look just like normal Grailed. If the DB gets big, might not be a good idea to just list all of the items, will need some sort of search? Maybe ONLY have a search, and you just put in the item id/URL (will be parsed to id, if possible).
A Browser extension for price history (or tamperMonkey script)? Will only work on Grailed.com, a little pop-up or extra button that you click to redirect to price history page.

### What it do
Pulls from DB server on page load? Twig/Slim templates? Make an API?