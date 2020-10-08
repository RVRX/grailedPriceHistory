# Analysis of Grailed's Algolia API

## Method and URL
Been using a `POST` request and URL: `https://mnrwefss2q-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.6.0)%3B%20JS%20Helper%20(3.1.2)&x-algolia-application-id=MNRWEFSS2Q&x-algolia-api-key=a3a4de2e05d9e9b463911705fb6323ad`.
Which weirdly enough has the API key and such in the URL (also in headers, which is why I'm slightly confused).

## Query String
What I've been using:
`
x-algolia-agent=Algolia for JavaScript (3.35.1); Browser; react (16.13.1); react-instantsearch (6.6.0); JS Helper (3.1.2)
x-algolia-application-id=MNRWEFSS2Q
x-algolia-api-key=a3a4de2e05d9e9b463911705fb6323ad
`
I have yet to compare API keys between requests, but I have a feeling they might all be the same. This could be Algolia specific research. Unsure what `application-id` means, or if it is necessary.

## Request Headers
Looks like a typical request header, but I'm sure I dont really need most of these:
`
Host: mnrwefss2q-dsn.algolia.net
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:81.0) Gecko/20100101 Firefox/81.0
Accept: application/json
Accept-Language: en-US,en;q=0.5
Accept-Encoding: gzip, deflate, br
content-type: application/x-www-form-urlencoded
Content-Length: 221
Origin: https://www.grailed.com
DNT: 1
Connection: keep-alive
Pragma: no-cache
Cache-Control: no-cache
`
Probalby just need the "`Accept-*`", maybe`Content-*`, and possibly `User-Agent` so the API doesn't decline an agentless request.

## Request body
see contents of "RequestBodyAnalysis.json".
**The Gist**:
An Example request:
```json
{"requests":[{"indexName":"Listing_production","params":"highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=90&filters=&page=1&maxValuesPerFacet=100&query=FTP"}]}
```
Some of the requests contents are HTML encoded, heres what the above request looks like fully decoded:
```json
{"requests":[{"indexName":"Listing_production","params":"highlightPreTag=<ais-highlight-0000000000>&highlightPostTag=</ais-highlight-0000000000>&hitsPerPage=90&filters=&page=1&maxValuesPerFacet=100&query=FTP"}]}
```
In the above two requests I am searching for "FTP" ("query=FTP"), and looking for 90 items ("hitsPerPage=90"). No idea what the other stuff means, but I don't think I need to know just yet.