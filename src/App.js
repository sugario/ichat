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
                <div className="site">
                    <div className="item header">Header</div>
                    <div className="item friend-list">Friend list</div>
                    <div className="item main">Main</div>
                    <footer className="item footer">Footer</footer>
                </div>
            </div>
        );
    }
}

export default App;
