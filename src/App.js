import React, { Component } from 'react';
import './App.css';
import Clarifai from 'clarifai'
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

// initialize with your api key. This will also work in your browser via http://browserify.org/

const app = new Clarifai.App({
 apiKey: 'cb3d1f48489b4b8cbfeb084e6a67ba5e'
});

const particlesOption={
    particles: {
      number: {
        value: 40,
        density: {
          enable: true,
          value_area: 300
        }
      }
    }
}

class App extends Component {
  constructor(){
    super();
    this.state ={
      input:'',
      imageUrl:'',
      box: {},
      route:'signin',
      isSigned: false,
    }
  }

  calculateFaceLocation = (data)=>{
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box
    const image = document.getElementById('imageId');
    const width = Number(image.width);
    const height = Number(image.height);
    console.log(width,height,clarifaiFace)
    return{
      topRow: height * clarifaiFace.top_row,
      leftCol: width * clarifaiFace.left_col,
      bottomRow: height-height*clarifaiFace.bottom_row,
      rightCol: width- width * clarifaiFace.right_col
    }
  }

  showFaceBox = (box)=>{
    this.setState({box:box});
  }

  onRouteChange=(routes)=>{
    if(routes === "signout"){
      this.setState({isSigned:false})
    }else if(routes === "home"){
      this.setState({isSigned:true})
    }
    this.setState({route:routes})
  }


  onInputChange=(event)=>{
    this.setState({input:event.target.value});
  }

  onDetectClick=()=>{
    this.setState({imageUrl: this.state.input})
    app.models.predict(
      Clarifai.FACE_DETECT_MODEL, 
      this.state.input)
    .then( response => this.showFaceBox(this.calculateFaceLocation(response)) )
    .catch(err => console.log(err))
  }

  render() {
    const {route,box,imageUrl,isSigned}=this.state;
    return (
      <div className="App">
      <Particles className='particles'
          params={particlesOption}/>
          <Navigation isSigned={isSigned} onRouteChange={this.onRouteChange} />
          {
            route === "home"?
            <div>
              <Logo />
              <Rank />
              <ImageLinkForm onDetectClick={this.onDetectClick} onInputChange={this.onInputChange}/>
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          :
          (
            route === "signin"
            ?<SignIn onRouteChange={this.onRouteChange}/>
            :<Register onRouteChange={this.onRouteChange}/>
          )
        }
      </div>  
    );
  }
}

export default App;
