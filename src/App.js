import React from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
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

        this.connectedRef = Firebase.database().ref().child('.info/connected');
        this.usersRef = Firebase.database().ref().child('users');

        this.updateStatus = this.updateStatus.bind(this);
    }

    componentDidMount() {
        this.authListener();
    }

    updateStatus(status) {
        if (!this.state.user) {
            return;
        }

        this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .once('child_added', currentUser => {
                currentUser.ref.update({ status: status });
            });
    }

    authListener() {
        Firebase.auth().onAuthStateChanged((user) => {
            if (user) {
                this.setState({ user }, () => this.updateStatus('online'));
            } else {
                this.updateStatus('offline');
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
