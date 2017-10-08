const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs');


var currentPage = 1

var quotes = []



const MAX_QUOTES = 400

// const data = {"typ":"home_page","langc":"en","v":"7.0.3:2440334","ab":"b","pg":1,"id":"null","vid":"343dbd599aeceab78596c7b436c5b453","m":0}, maxPages:"5" },
// const stuff = [{ 
//     data:{"typ":"home_page","langc":"en","v":"7.0.3:2440334","ab":"b","pg":1,"id":"null","vid":"343dbd599aeceab78596c7b436c5b453","m":0}, maxPages:"5" },
// {data:{"typ":"topic","langc":"en","v":"7.0.3:2440334","ab":"b","pg":9,"id":"t:132565","vid":"5b2e63d43c7a299bdac46aff06ee972f","m":0},
// maxPages:"50"
//  },
//  {data:{"typ":"topic","langc":"en","v":"7.0.3:2440334","ab":"b","pg":2,"id":"t:132683","vid":"f012ef26b3f4c34a73ca31e658ec4a77","m":0},
//  maxPages:"50"
//   },
//   {data:
//   {"typ":"topic","langc":"en","v":"7.0.3:2440334","ab":"b","pg":2,"id":"t:132649","vid":"042d48c8e4e26cdad77851ad77c6bcd4","m":0},  
//   maxPages: "50"
//    }
// ]

var body = {"typ":"home_page","langc":"en","v":"7.0.3:2440334","ab":"b","pg":1,"id":"null","vid":"343dbd599aeceab78596c7b436c5b453","m":0}

function writeQuotes(){
    fs.writeFile("./quotes-all.json", JSON.stringify({ currentPage, quotes }), function(err) {
        if(err) {
            return console.log(err);
        }
        console.log(`${quotes.length} quotes saved!`);
    }); 
}

function getNextPage(body, cb) {
    body.pg = currentPage

    axios.post('https://www.brainyquote.com/api/inf', body)
        .then(({ data }) => {
            currentPage += 1
            
            if(quotes.length < MAX_QUOTES) { 
                console.log(`currentPage: ${currentPage}`);
                console.log(`${quotes.length} quotes processed!`);
                cb(data)
                getNextPage(body,cb) 
            }
            else {
                // currentPage = 0
                writeQuotes()
            }
        })
        .catch( e => writeQuotes())
}

function storeInformationFrom(page) {    
    const $ = cheerio.load(page)

    const quotesText = $(".b-qt")
    const authors = $(".bq-aut")
    const tags = $(".kw-box")

    for(let i = 0; i < quotesText.length; i++){
        let quote = {}
        quote.text = $(quotesText[i]).text()
        quote.author = $(authors[i]).text()

        quote.tags = []
        // weird stuff. Extract all the tags name
        $(tags[i]).children('a').each(function(){ quote.tags.push(($(this).text())) } )
        console.log(quote);
        quotes.push(quote)
    }
}

getNextPage(body,storeInformationFrom)
// function start(){
//     stuff.forEach(data => getNextPage(data))
// }


// start()
// getNextPage(storeInformationFrom)

