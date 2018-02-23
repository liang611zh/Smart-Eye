import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';

import Particles from 'react-particles-js';
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';

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
const initialState = {
  input:'',
  imageUrl:'',
  box: {},
  route:'signin',
  isSigned: false,
  user: {
    id:"",
    name: "",
    password:"",
    email:"",
    entries:0,
    joined:"",
  }
}
class App extends Component {
  constructor(){
    super();
    this.state = initialState;
  }

  // componentDidMount(){
  //   fetch('http://localhost:3000')
  //   .then(response => console.log(response.json()))
  //   .then(console.log)
  // }

  loadUser = (data) => {
    this.setState({user:{
      id:data.id,
      name: data.name,
      password:data.password,
      email:data.email,
      entries:0,
      joined:data.joined,
    }})

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
      this.setState(initialState)
    }else if(routes === "home"){
      this.setState({isSigned:true})
    }
    this.setState({route:routes})
  }


  onInputChange = (event)=>{
    this.setState({input:event.target.value});
  }

  onDetectClick = () => {
    this.setState({imageUrl: this.state.input});
    fetch('https://powerful-hamlet-28666.herokuapp.com/imageurl',{
      method:'post',
      headers:{
      'Content-Type':'application/json'},
      body:JSON.stringify ({
        input:this.state.input
      })
    })
    .then(response=>response.json())
    .then( response => {
      if(response){
        fetch('https://powerful-hamlet-28666.herokuapp.com/image',{
          method:'put',
          headers:{
          'Content-Type':'application/json'},
          body:JSON.stringify ({
            id:this.state.user.id
          })
        })
        .then(response => response.json())
        .then(count => {
          this.setState(Object.assign(this.state.user, { entries: count}))
        })
        .catch(err => {
          console.log(err)
        })
      }
      this.showFaceBox(this.calculateFaceLocation(response))
    }) 

    .catch(err => console.log(err))
  }

  render() {
    const {route,box,imageUrl,isSigned,user,}=this.state;
    return (
      <div className="App">
      <Particles className='particles'
          params={particlesOption}/>
          <Navigation isSigned={isSigned} onRouteChange={this.onRouteChange} />
          {
            route === "home"?
            <div>
              <Logo />
              <Rank name={user.name} entries={user.entries} />
              <ImageLinkForm onDetectClick={this.onDetectClick} onInputChange={this.onInputChange}/>
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          :
          (
            route === "signin"
            ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
          )
        }
      </div>  
    );
  }
}

export default App;
