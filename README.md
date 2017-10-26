# Web Scraper for www.brainyquote
## Get and Store all the quotes
### By Francesco Saverio Zuppichini

## Quick Start

In order to run the scraper, go inside its directory and install all dependencies

```
npm install
npm run 
```

It will generate a `quotes.json file with all the quotes information. The following snippet shows an example:

```
[
    ...
    {
    "text": "It is the supreme art of the teacher to awaken joy in creative expression and knowledge.",
    "author": "Albert Einstein",
    "topic": "art",
    "tags": ["Teacher", "Knowledge", "Joy"]
   }
  ...
]
```

For each quote the tags, topic and author is stored.