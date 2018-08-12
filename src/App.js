import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect
} from 'react-router-dom'

import Firebase from './config/firebase';
import Login from './components/login/login';
import Home from './components/home/home';
import Registration from './components/registration/registration';
import './App.css';

export default class App extends React.Component {
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
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user });
            } else {
                this.setState({ user: null });
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
                                    <Home user={this.state.user} />
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
