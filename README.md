# lol-react

Small project to play with [React](https://facebook.github.io/react/) and [Sinatra](http://www.sinatrarb.com).

It displays information about the summoner name submited (see example.png).

### 
### Installation

First you need a API key from Riot: https://developer.riotgames.com/

Create a file **config/secret.rb** and write your API key in it:
```
$API_KEY="xxxx"
```

Run these commands:
```
$ bundle install
$ rackup
```

Open your browser and go to http://localhost:9292
