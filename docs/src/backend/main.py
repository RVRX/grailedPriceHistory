import os
import json


# Pulls the json file from Grailed by Spoofing Firefox user-agent
#   args:
#       (query); the search term to send to the api
#       (hits); the amount of item/object results to pull from the API. Keep it low, Default on site is 39.
def get_json_by_query_unix(query, hits):
    result = os.popen("curl 'https://mnrwefss2q-dsn.algolia.net/1/indexes/*/queries?x-algolia-agent=Algolia%20for%20JavaScript%20(3.35.1)%3B%20Browser%3B%20react%20(16.13.1)%3B%20react-instantsearch%20(6.6.0)%3B%20JS%20Helper%20(3.1.2)&x-algolia-application-id=MNRWEFSS2Q&x-algolia-api-key=a3a4de2e05d9e9b463911705fb6323ad' \
  -H 'Connection: keep-alive' \
  -H 'accept: application/json' \
  -H 'User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36' \
  -H 'content-type: application/x-www-form-urlencoded' \
  -H 'Origin: https://www.grailed.com' \
  -H 'Sec-Fetch-Site: cross-site' \
  -H 'Sec-Fetch-Mode: cors' \
  -H 'Sec-Fetch-Dest: empty' \
  -H 'Accept-Language: en-US,en;q=0.9' \
  --data-raw '{\"requests\":[{\"indexName\":\"Listing_production\",\"params\":\"highlightPreTag=%3Cais-highlight-0000000000%3E&highlightPostTag=%3C%2Fais-highlight-0000000000%3E&hitsPerPage=" + hits + "&filters=&page=1&maxValuesPerFacet=100&query=" + query + "\"}]}\' \
  --compressed").read()
    return result

#Gets the JSON info for a specific ID
def get_json_by_id(identification_number):
    # will return to later, leaving to do work on newfound grailed.com API
    return identification_number

# main
if __name__ == '__main__':
    print('Starting Application')

    searchFor = "Kappa"
    itemCount = "5"
    JSONResponse = get_json_by_query_unix(searchFor, itemCount)
    # print(JSONResponse)
    response_dict = json.loads(JSONResponse)
    # print(response_dict)
    # response = response_dict['results']
    responseToSave = response_dict['results']
    responseToSave = responseToSave[0]
    responseToSave = responseToSave['hits']
    print("There are " + str(len(responseToSave)) + " items/hits in the list, which should correspond to the requested amount, " + itemCount + ".")
    # print(response_dict[0])
    # print(response_dict['results'])
    with open('json_export.json', 'w') as outfile:
        json.dump(responseToSave, outfile)
        print("JSON data saved to json_export.json")
        outfile.close()

    # Loop through all elements of the list, get
    for i in responseToSave:
        print(str(i['id']) + " <- ID     |       Price -> " + str(i["price"]))