
// This class does an AJAX request to get the name of the champion
// and return an image.
var Champion = React.createClass({
  getInitialState: function() {
    return {championName: '',
            championImage: ''};
  },
  componentDidMount: function() {
    if (this.props.championId) {
      $.ajax({
        url: getChampionUrl(this.props.championId),
        dataType: 'json',
        type: 'GET',
        success: function(result) {
          this.setState({championName: result["name"],
                         championImage: result["image"]["full"]});
        }.bind(this),
        error: function(xhr, status, err) {
          console.error(this.props.url, status, err.toString());
        }.bind(this)
      });
    }
  },
  getImage: function() {
    if (this.state.championImage != '')
      return <img alt={this.state.championName} src={"http://ddragon.leagueoflegends.com/cdn/5.14.1/img/champion/" + this.state.championImage} />;
    else
      return false;
  },
  render: function() {
    return <span>{this.getImage()}</span>;
  }
});

// This class returns information about a game.
var Game = React.createClass({
  wonOrLost: function() {
    if (this.props.game.win) {
      return (<span><strong>WON</strong></span>);
    } else {
      return (<span>LOST</span>);
    }
  },
  backgroundColor: function() {
    if (this.props.game.win) {
      return ("col s12 m7 teal");
    } else {
      return ("col s12 m7 red lighten-3");
    }
  },
  render: function() {
    return (
      <div id={this.props.game.gameId} style={cardStyle} className={this.backgroundColor()} >
          <div className="card horizontal">
              <div className="card-image"> 
                  <Champion championId={this.props.game.championId} />
              </div>
              <div className="card-stacked">
                  <div style={divStyle}> 
                      <ul>
                          <li>{this.wonOrLost()}</li>
                          <li>kills:   {this.props.game.kills}</li>
                          <li>Assists: {this.props.game.assists}</li>
                          <li>Deaths:  {this.props.game.deaths}</li>
                      </ul>
                  </div>
              </div>
          </div>
      </div>
    );
  }
});

const divStyle = {
  paddingLeft: '8px'
};

const cardStyle = {
  marginTop: '8px'
};

// This class does an AJAX request to get a list of recent games.
var GameList = React.createClass({
  getInitialState: function() {
    return {games: []};
  },
  getListOfGames: function(accountId) {
    $.ajax({
      url: getListOfGamesUrl(accountId),
      dataType: 'json',
      type: 'GET',
      success: function(result) {
        this.setState({games: result});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  componentDidMount: function() {
    this.getListOfGames(this.props.accountId);
  },
  componentWillReceiveProps: function(nextProps) {
    this.getListOfGames(nextProps.accountId);
  },
  render: function() {
    var games = this.state.games.map(function(game) {
      return (
        <Game game={game} key={game.gameId}/>
      );
    });
    return (
      <div className="gameList row">
        {games}
      </div>
    );
  }
});

// This class shows some information about a player 
// and will show a GameList.
var PlayerInfo = React.createClass({
  renderPlayer: function() {
    if (this.props.name) {
      return (
        <div id="myPlayer">
          <h3>{this.props.name} ({this.props.summonerId})</h3>
          <ul>
            <li>Profile icon id: {this.props.profileIconId}</li>
            <li>Summoner level: {this.props.summonerLevel}</li>
            <li>Revision date: {this.props.revisionDate}</li>
            <li>Account id: {this.props.accountId}</li>
            <li>Game history:</li>
          </ul>
          <GameList accountId={this.props.accountId}/>
        </div>);
    } else {
      return false;
    }
  },
  render: function() {
    return (
      <div id={this.props.summonerId} >
        {this.renderPlayer()}
      </div>
    );
  }
});

// This class displays a form to search by name.
var NameForm = React.createClass({
  getInitialState: function() {
    return {player: ''};
  },
  handlePlayerChange: function(e) {
    this.setState({player: e.target.value});
  },
  handleSubmit: function(e) {
    e.preventDefault();
    var player = this.state.player.trim();
    if (!player) {
      return;
    }
    this.props.onNameSubmit({player: player});
    this.setState({player: ''});
  },
  render: function() {
    return (
      <form className="NameForm" onSubmit={this.handleSubmit}>
        <input placeholder="Summoner name" value={this.state.player} id="player" type="text" onChange={this.handlePlayerChange}/>
        <input type="submit" value="Submit" />
      </form>
    );
  }
});

// Main class
var PlayerBox = React.createClass({
  getInitialState: function() {
    return {summonerId: '',
            name: '',
            profileIconId: '',
            summonerLevel: '',
            revisionDate: '',
            accountId: '',
           };
  },
  // action when the user click on submit.
  handlePlayerSubmit: function(player) {
    this.serverRequest = $.ajax({
      url: getSummonerUrl(player.player),
      dataType: 'json',
      type: 'GET',
      success: function(result) {
        // yay! We received information about the summoner.
        var summoner = result;
        this.setState({summonerId: summoner.id,
                       name: summoner.name,
                       profileIconId: summoner.profileIconId,
                       summonerLevel: summoner.summonerLevel,
                       revisionDate: summoner.revisionDate,
                       accountId: summoner.accountId});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
        this.setState({ name: '' });
      }.bind(this)
    });
  },
  componentWillUnmount: function() {
    this.serverRequest.abort();
  },
  render: function() {
    return (
      <div className="PlayerBox">
        <NameForm onNameSubmit={this.handlePlayerSubmit} />
        <PlayerInfo summonerId={this.state.summonerId} 
                    name={this.state.name} 
                    profileIconId={this.state.profileIconId} 
                    summonerLevel={this.state.summonerLevel} 
                    revisionDate={this.state.revisionDate}
                    accountId={this.state.accountId} />
      </div>
    );
  }
});


ReactDOM.render(
  <PlayerBox />,
  document.getElementById('content')
);


function getSummonerUrl(summonerName) {
  return '/summoner/' + summonerName;
}

function getListOfGamesUrl(summonerId) {
  return '/games/' + summonerId;
}

function getChampionUrl(championId) {
  return '/champion/' + championId;
}

