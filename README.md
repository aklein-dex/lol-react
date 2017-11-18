# lol-react

I could see many topics about [React](https://facebook.github.io/react/) on different
blogs so I was curious and wanted to play with it.

This project is a simple Website ([Sinatra](http://www.sinatrarb.com))
that shows the result of the last 10 games
played in [League of Legends](https://na.leagueoflegends.com/) for a specific player.

Riot is changing the API more frequently than I update this project. So it may
stop working. Here are 2 pictures to see the this project: example.png, example-class.png.

### Installation

First you need a API key from Riot: https://developer.riotgames.com/

Set an environment variable with your API key:
```
$ export RIOT_API_KEY=xxxx-xxxx-xxxx
```

Make sure you have all the Gems. This project is using Ruby 2.3.4 because
it was the latest version of Ruby supported on Heroku:
```
$ bundle install
```

And start the server:
```
$ rackup
```

Open your browser and go to http://localhost:9292

### Heroku

You can also easily deploy this project on Heroku:
```
$ wget -qO- https://cli-assets.heroku.com/install-ubuntu.sh | sh
$ heroku login
$ heroku create
$ heroku config:set RIOT_API_KEY=xxxx-xxxxx-xxxx
$ git push heroku master
$ heroku open
```

### Limitation

If you don't register your project with Riot, then you API key is available just for a hours.

The number of requests to the API is limited. If the limit is exceeded then an error 429 is returned.

### Script

The React script file is here: [public/javascripts/lol-react.js](https://github.com/aklein-dex/lol-react/blob/master/public/javascripts/lol-react.js)

