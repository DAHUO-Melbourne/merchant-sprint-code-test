# Merchant Code Test

## How to run
1. First install all packages using `npm install` in root folder
1. Then run `npm run dev`
1. open `http://localhost:3000/`

## How to test
1. First install all packages using `npm install` in root folder
1. Then run `npm run test`

## Thinkings
1. add loading skeleton to improve user experience
1. add debounce to save web performance when user keeps clicking on paginations to turn to next page
1. kept the stores info list in cache in nodejs server to save server performance

## what's next?
there is a performance issue, but I don't have enough time to finish it, if I get time, I will do the following:
1. use docker to start a mysql/PostgreSQL server
1. create order table 
1. use mysqlimport tool to import the csv into the orders table and then query the data from a proper database
1. add an index to the frequently queried column to increase the query speed
