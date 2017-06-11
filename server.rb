require 'sinatra'
require 'open-uri'
require 'json'
require './config/secret'

class MySinatraApp < Sinatra::Base
  
  get "/" do
    erb :index
  end
  
  get "/summoner/:summonerName" do
    content_type :json
    result = JSON.parse(open("https://na.api.pvp.net/api/lol/na/v1.4/summoner/by-name/#{params['summonerName']}?api_key=#{$API_KEY}").read)
    result.to_json
  end
  
  get "/games/:summonerId" do
    content_type :json
    result = JSON.parse(open("https://na.api.pvp.net/api/lol/na/v1.3/game/by-summoner/#{params['summonerId']}/recent?api_key=#{$API_KEY}").read)
    result.to_json
  end
  
  get "/champion/:championId" do
    content_type :json
    result = JSON.parse(open("https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion/#{params['championId']}?champData=image&api_key=#{$API_KEY}").read)
    result.to_json
  end
end

