# SWGOH Guild Inspector
## Example ally codes => 

 -   979-382-945
 -   841-626-362
 -   291-422-326
 - 427-513-365

## How it works?

 1. You submit an ally-code, this is passed over to the api to process.
 2. The api hit's a public api to get all the information about that ally-code (returns a list of all of the ally-codes in that guild. (This can take a few minutes due to the massive amount of traffic on the public api)
 3. The api fetches all of the data for all of the members of that guild.
 4. The api processes all of the information, searching each member for the 'meta' squads that they have and sorts the squads based on the highest power.
 5. The api caches this data in a redis database for 6 hours to avoid spamming the public api.
 6. The react app displays all of this information.

## What is used?
- Socket.io for the api (so that user-feedback can be implemented due to requests taking multiple minutes at peek times, noting I can do)
- Redis for caching all the data
- Express.js for the HTTP server
- React.js for the website
- Material-ui for most of the components
- Sass for styling
