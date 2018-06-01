import React, { Component } from 'react';
import '../App.css';
import { FormGroup, FormControl, InputGroup, Glyphicon } from 'react-bootstrap';
import Profile from './Profile';
import Gallery from './Gallery';
// import Authorize from './Authorize';

class App extends Component {
  constructor(props) {
    super(props);
    const params = this.getHashParams();
    const token = params.access_token;
    this.state = {
      query: '',
      artist: null,
      tracks: [],
      token
    }
  }

  // componentDidMount() {
  //   browserHistory.push("http://localhost:8888/login");
  //   const params = this.getHashParams();
  //   const token = params.access_token;
  //   console.log('Logged in');
  //   console.log('Access token:', token);
  // }

  getHashParams() {
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while (e) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q);
    }
    return hashParams;
  }

  search() {
    console.log('this.state', this.state);
    const BASE_URL = 'https://api.spotify.com/v1/search?';
    let FETCH_URL = `${BASE_URL}q=${this.state.query}&type=artist&limit=1`;
    const ALBUM_URL = 'https://api.spotify.com/v1/artists/';
    const params = this.getHashParams();
    const accessToken = params.access_token;
    console.log('Access token:', accessToken);

    var myHeaders = new Headers();

    var myOptions = {
      method: 'GET',
      headers:  {
        'Authorization': 'Bearer ' + accessToken
     },
      mode: 'cors',
      cache: 'default'
    };


      fetch(FETCH_URL, myOptions)
      .then(response => response.json())
      .then(json => {
        const artist = json.artists.items[0];
        this.setState({artist});

        FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`
        fetch(FETCH_URL, myOptions)
        .then(response => response.json())
        .then(json => {
          console.log('artist\'s top tracks:', json);
          const { tracks } = json;
          this.setState({tracks});
        })
      });

    // fetch(FETCH_URL, myOptions)
    // .then(response => response.json())
    // .then(json => {
    //   const artist = json.artists.items[0];
    //   this.setState({artist});
    //
    //   FETCH_URL = `${ALBUM_URL}${artist.id}/top-tracks?country=US&`
    //   fetch(FETCH_URL, myOptions)
    //   .then(response => response.json())
    //   .then(json => {
    //     console.log('artist\'s top tracks:', json);
    //     const { tracks } = json;
    //     this.setState({tracks});
    //   })
    // });
  }

  render() {
    if (this.state.token) {
    return (
      <div className="App">
        <div className="App-title">
          <img className="react-logo" src="reactlogo.png" />  with
          <img className ="spotify-logo" src="spotify.png" />
        </div>
        <FormGroup>
          <InputGroup>
            <FormControl
              type="text"
              placeholder="Search for an Artist"
              value={this.state.query}
              onChange={event => {this.setState({query: event.target.value})}}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.search()
                }
              }}
            />
            <InputGroup.Addon onClick={() => this.search()}>
              <Glyphicon glyph="search"></Glyphicon>
            </InputGroup.Addon>
          </InputGroup>
        </FormGroup>
        {
          this.state.artist !== null
          ?
            <div>
              <Profile
                artist={this.state.artist}
              />
              <Gallery
                tracks={this.state.tracks}
              />
            </div>
          : <div></div>
        }

      </div>
    )
  } else {
    return (
      <div className="App">
        <div className="App-title">
          <img className="react-logo" src="reactlogo.png" />  with
          <img className ="spotify-logo" src="spotify.png" />
        </div>
        <button className="btn btn-success">
          <a href='https://mcmanus-spotify-auth-server.herokuapp.com/login'> Log in to Spotify</a>
        </button>
      </div>
    )
  }
  }
}

export default App;
