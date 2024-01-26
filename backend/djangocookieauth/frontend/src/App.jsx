import React from 'react';
import Cookies from 'universal-cookie'

const cookies = new Cookies();

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      username: "",
      password: "",
      error:"",
      is_authenticated: false,
    };
  }

  componentDidMount = () =>{
    fetch("/api/session/", {
      credentials: "same-origin"
    })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      if (data.is_authenticated){
        this.setState({ is_authenticated: true });
      }else{
        this.setState({is_authenticated: false});
      }
    })
    .catch((error) =>{
      console.log(error);
    })
  }

  whoami = () => {
    fetch('/api/whoami/',{
      headers: {
        "Content-Type": 'application/json',
      },
      credentials: "same-origin",
    })
    .then((res) => res.json())
    .then((data) => {
      console.log("You are logged in as: " + data.username);
      this.setState({username: data.username});

    })
    .catch((error) => {
      console.log(error)
    });
  }

  handlePasswordChange = (event) => {
    this.setState({password: event.target.value});
  }

  handleUserNameChange = (event) => {
    this.setState({username: event.target.value});
  }

  ifResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    }else{
      throw  Error(response.statusText);
    }
  }

  login = (event) => {
    event.preventDefault();
    // Make a POST request to login view in api
    fetch('api/login/', {
      method: "POST", 
      headers: {
        'Content-Type': "application/json",
        "X-CSRFToken": cookies.get("csrftoken"),
      },
      credentials: "same-origin",
      body: JSON.stringify({
        username: this.state.username,
        password: this.state.password,
      }),
    })
      .then(this.ifResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({
          is_authenticated: true,
          username: "",
          password: "",
          error: ""
        });
      })
      .catch((error) => {
        console.log(error);
        this.setState({error:  "Wrong Username or Password"});
      })
  }

  logout = () => {
    fetch('/api/logout/', {
      credentials: "same-origin"
    })
    .then(this.ifResponseOk)
    .then((data) => {
      console.log(data);
      this.setState({is_authenticated: false});
    })
    .catch((error) => {
      console.log(error);
    })
  }

  render(){
    if (!this.state.is_authenticated) {
      return(
        <div className="container mt-3">
          <h1>Cookie Authentication</h1>
          <form onSubmit={this.login}>
            <div className="form-control">
              <label htmlFor="username"> User Name: </label>
              <input className='form-control' type="text" onChange={this.handleUserNameChange} value={this.state.username} id='username' />
            </div>
            <div className="form-control mt-4">
              <label htmlFor="password"> User Password: </label>
              <input className='form-control' type="password" onChange={this.handlePasswordChange} value={this.state.password} id='password' />
            </div>
            <button type='submit' className="btn btn-primary mt-2">Login</button>
          </form>
          <div>
            {this.state.error && 
            <small className="text-danger">{this.state.error}</small>
            }
          </div>
        </div>

      )
    }
    return(
      <div className="container mt-3">
        <h1>React Cookie Authenticator</h1>
        <h1>You are logged in</h1>
        <div className="row mt-5">
          <button onClick={this.logout} className="btn btn-danger">LogOut</button>
        </div>
      </div>
    )
  }
}

export default App;