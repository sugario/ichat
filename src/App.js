import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import fbase from './config/firebase';

import Login from './components/login/login'
import Home from './components/home/home'
import Registration from './components/registration/registration'

import './App.css';

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
            <div className='App'>
                <Router>
                    <Switch>
                        <Route exact path='/' render={() => <Redirect to='/home' />} />
                        <Route path='/home' render={() => {
                            return (
                                <div>
                                    {this.state.user ? <div /> : <Login />}
                                    <Home />
                                </div>
                            );
                        }} />
                        <Route path='/registration' component={Registration} />
                    </Switch>
                </Router>
            </div>
        );
    }
}

export default App;
