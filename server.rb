require 'sinatra'
require 'open-uri'
require 'json'

class MySinatraApp < Sinatra::Base
  
  API_KEY = ENV['RIOT_API_KEY']
  
  URL = "https://na1.api.riotgames.com/lol"
  
  get "/" do
    erb :index
  end
  
  get "/summoner/:summonerName" do
    content_type :json
    result = JSON.parse(open("#{URL}/summoner/v3/summoners/by-name/#{params['summonerName']}?api_key=#{API_KEY}").read)
    result.to_json
  end
  
  get "/games/:accountId" do
    content_type :json
    result = []
    matches = JSON.parse(open("#{URL}/match/v3/matchlists/by-account/#{params['accountId']}?endIndex=10&api_key=#{API_KEY}").read)
    
    # For each match, we need to do another request to get the statistic
    matches["matches"].each do |match|
      matchInfo = JSON.parse(open("#{URL}/match/v3/matches/#{match['gameId']}?api_key=#{API_KEY}").read)
      puts "--> #{match['gameId']}"
      participantId = 0
      puts "  accid: #{params['accountId']}" 
      
      # We need to know the participantId
      matchInfo["participantIdentities"].each do |participant|
        
        # Have to convert to string for comparaison
        if participant["player"]["accountId"].to_s == params['accountId'].to_s
          participantId = participant["participantId"]
          break
        end
      end
      
      # Now we can find the stats
      matchInfo["participants"].each do |participant|
        if participant["participantId"] == participantId
          result << {
            "gameId"     => match['gameId'],
            "championId" => participant["championId"],
            "kills"      => participant["stats"]["kills"],
            "assists"    => participant["stats"]["assists"],
            "deaths"     => participant["stats"]["deaths"],
            "win"        => participant["stats"]["win"]
          }
          break
        end
      end
    end
    
    result.to_json
  end
  
  get "/champion/:championId" do
    content_type :json
    result = JSON.parse(open("#{URL}/static-data/v3/champions/#{params['championId']}?locale=en_US&tags=image&api_key=#{API_KEY}").read)
    result.to_json
  end
end
