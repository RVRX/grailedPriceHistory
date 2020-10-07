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
