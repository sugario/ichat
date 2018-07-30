import React, { Component } from 'react';
// import { Link } from 'react-router-dom';

import fbase from '../../config/firebase';

/*
 *  Default user:       admin@admin.com
 *  Default password:   adminadmin
 */

class Login extends Component {
    constructor(props) {
        super(props);

        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);

        this.state = {
            email: '',
            password: ''
        }
    }

    login(e) {
        e.preventDefault();
        fbase.auth()
                .signInWithEmailAndPassword(this.state.email, this.state.password)
                .then((u) => {})
                .catch((error) => {
                    console.log(error);
                });
    }

    signup(e) {
        e.preventDefault();
        fbase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((u) => { })
            .then((u) => {console.log(u)})
            .catch((error) => {
                console.log(error);
            });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    render() {
        return (
            <div>
                <form>
                    <div>
                        <label>Email address</label>
                        <input type="email"
                               name="email"
                               id="email"
                               value={ this.state.email }
                               onChange={ this.handleChange }
                               placeholder="Enter email" />
                    </div>
                    <div>
                        <label>Password</label>
                        <input type="password"
                               name="password"
                               id="password"
                               value={ this.state.password }
                               onChange={ this.handleChange }
                               placeholder="Enter password" />
                    </div>


                    <button type="submit" onClick={ this.login }>Login</button>
                    <button onClick={ this.signup }>Signup</button>
                </form>
            </div>
        );
    }
}

export default Login;
