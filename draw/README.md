# socketless draw example

Live demo at https://draw.socketless.org/

# Directory structure

## app

* `api` - serverless lambdas using [socketless-client](https://github.com/socketless/socketless-client)
* `index.{js,html}` - client (browser) bundle
* `now.json` - Now v2 config for `draw.socketless.org`

## server

* `index.js` - runs [socketless-server](https://github.com/socketless/socketless-server)
* `now.json` - Now v1 config for `sls.draw.socketless.org`

# Project notes

Collaborative drawing is always fun to show base latency.  As you can see it works great!

I'd note however that serverless is probably not the best way to do this type of project.  It would be cheaper to have multiple (serverful) servers and route all users on the same drawing to the same server.  (Assuming you have high numbers of simultaneous and actively drawing users).

# TODO

* Allow different drawings per URL
* Clear button.  Colors?
