import './App.css';
import React from 'react';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-tsparticles';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

let requestOptions;

const particlesOptions = {
  fpsLimit: 60,
  particles: {
    color: {
      value: '#ffffff',
    },
    links: {
      color: '#ffffff',
      distance: 150,
      enable: true,
      opacity: 0.5,
      width: 1,
    },
    collisions: {
      enable: true,
    },
    move: {
      direction: 'none',
      enable: true,
      outMode: 'bounce',
      random: false,
      speed: 2,
      straight: false,
    },
    number: {
      density: {
        enable: true,
        area: 2000,
      },
      value: 80,
    },
    opacity: {
      value: 0.5,
    },
    shape: {
      type: 'circle',
    },
    size: {
      random: true,
      value: 5,
    },
  },
  detectRetina: true,
};

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
        name: '',
        email: '',
        entries: 0,
        joined: '',
      },
    };
  }

  loadUser = (data) => {
    this.setState({
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        entries: data.entries,
        joined: data.joined,
      },
    });
  };

  calculateFaceLocation = (data) => {
    const clarifaiFace =
      data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = +image.width;
    const heigth = +image.height;
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * heigth,
      rightCol: width - clarifaiFace.right_col * width,
      bottomRow: heigth - clarifaiFace.bottom_row * heigth,
    };
  };

  displayFaceBox = (box) => {
    this.setState({ box: box });
  };

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  };

  onSubmit = () => {
    if (this.state.input) {
      requestOptions = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          Authorization: 'Key 069d152bff724312b51b149dea3d255d',
        },
        body: JSON.stringify({
          user_app_id: {
            user_id: 'iv0qxjeyzac0',
            app_id: '3d107acf0a9c483a832b213bd2461a60',
          },
          inputs: [
            {
              data: {
                image: {
                  url: this.state.input,
                },
              },
            },
          ],
        }),
      };
      this.setState({ imageUrl: this.state.input });
      fetch(
        'https://api.clarifai.com/v2/models/f76196b43bbd45c99b4f3cd8e8b40a8a/versions/45fb9a671625463fa646c3523a3087d5/outputs',
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          if (result) {
            fetch('http://localhost:3000/image', {
              method: 'put',
              headers: { 'content-type': 'application/json' },
              body: JSON.stringify({
                id: this.state.user.id,
              }),
            })
              .then((response) => response.json())
              .then((count) => {
                this.setState(
                  Object.assign(this.state.user, { entries: count })
                );
              });
          }
          this.displayFaceBox(this.calculateFaceLocation(result));
        })
        .catch((error) => console.log('error', error));
    } else {
      this.setState({
        box: {},
        imageUrl: '',
      })
    }
  };

  onRouteChange = (route) => {
    if (route === 'signout') {
      this.setState({ isSignedIn: false });
    } else if (route === 'home') {
      this.setState({
        box: {},
        imageUrl: '',
        input: '',
      });
      this.setState({ isSignedIn: true });
    }
    this.setState({ route: route });
  };

  render() {
    const { isSignedIn, imageUrl, route, box } = this.state;
    return (
      <div className='App'>
        <Particles
          className='particles'
          id='tsparticles'
          options={particlesOptions}
        />
        <Navigation
          onRouteChange={this.onRouteChange}
          isSignedIn={isSignedIn}
        />
        {route === 'home' ? (
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
            />
            <ImageLinkForm
              onInputChange={this.onInputChange}
              onSubmit={this.onSubmit}
            />
            <FaceRecognition box={box} imageUrl={imageUrl} />
          </div>
        ) : this.state.route === 'signin' ? (
          <SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        ) : (
          <Register
            loadUser={this.loadUser}
            onRouteChange={this.onRouteChange}
          />
        )}
      </div>
    );
  }
}

export default App;
