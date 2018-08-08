import React, { Component } from 'react';
import './App.css';

import fbase from './config/firebase';

import Login from './components/login/login'
import Home from './components/home/home'

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null
        }
    }

    componentDidMount() {
        this.authListener();
    }

    authListener() {
        fbase.auth().onAuthStateChanged((user) => {
            console.log(user);
            if (user) {
                this.setState({ user });
                localStorage.setItem('user', user.uid);
            } else {
                this.setState({ user: null });
                localStorage.removeItem('user');
            }
        });
    }

    render() {
        return (
            <div className="App">
                <Home />
                {
                    this.state.user
                        ? <div />
                        : <Login />

                }
            </div>
        );
    }
}

export default App;
