const cheerio = require('cheerio')
const axios = require('axios')
const fs = require('fs');

var quotes = []
const MAX_QUOTES = 400

async function getAllTopics() {
  const data = await axios.get('https://www.brainyquote.com/quotes/topics.html')

  const $ = cheerio.load(data.data)

  const allRefs = $('.bqLn > a.topicIndexChicklet').toArray().map(el => $(el).attr('href'))

  return allRefs
}

async function getQuotes() {
  const refs = await getAllTopics()
  const qutoes = await getQuotesFromTopics(refs)
}

async function getQuotesFromTopics(refs) {
  var promises = []

  refs.forEach(ref => {
    var url = `https://www.brainyquote.com${ref}`
    for (i = 0; i < 9; i++) {
      temp = url.replace('.html', `${i}.html`)
      console.log(temp);

      promises.push(axios.get(temp).then(({
        data
      }) => storeInformationFrom(data)))
    }
    console.log(url);

  })

  Promise.all(promises).then(data => writeQuotes())
  .catch(e => writeQuotes())
}

getQuotes()

function writeQuotes() {
  fs.writeFile("./quotes-all.json", JSON.stringify({
    quotes
  }), function (err) {
    if (err) {
      return console.log(err);
    }
    console.log(`${quotes.length} quotes saved!`);
  });
}

function storeInformationFrom(page) {
  const $ = cheerio.load(page)

  const quotesText = $(".b-qt")
  const authors = $(".bq-aut")
  const tags = $(".kw-box")

  for (let i = 0; i < quotesText.length; i++) {
    let quote = {}
    quote.text = $(quotesText[i]).text()
    quote.author = $(authors[i]).text()

    quote.tags = []
    // weird stuff. Extract all the tags name
    $(tags[i]).children('a').each(function () {
      quote.tags.push(($(this).text()))
    })
    // console.log(quote);

    quotes.push(quote)
  }
  console.log(`saved ${quotes.length} quotes...`)

}
