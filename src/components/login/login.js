import React, { Component } from 'react';
import fbase from '../../config/firebase';

import Color from '../constants/color';

import './logis.css'

/*
 *  Default user:       admin@admin.com
 *  Default password:   adminadmin
 */

class Login extends Component {
    constructor(props) {
        super(props);

        this.applyErrorText = this.applyErrorText.bind(this);

        this.invalidEmail = this.invalidEmail.bind(this);
        this.wrongPassword = this.wrongPassword.bind(this);
        this.handleLoginError = this.handleLoginError.bind(this);

        this.login = this.login.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.signup = this.signup.bind(this);

        this.state = {
            email: '',
            password: ''
        };
    }
    
    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }
    
    applyErrorText = (text) => {
        this.errorParagraph.textContent = text;
        this.errorParagraph.style.marginBottom = '25px';
    }

    invalidEmail = () => {
        this.emailInput.style.borderColor = Color.RED;
        this.passwordInput.style.borderColor = Color.GREEN;

        this.applyErrorText('The email address is badly formatted.');
    }

    wrongPassword = () => {
        this.emailInput.style.borderColor = Color.GREEN;
        this.passwordInput.style.borderColor = Color.RED;

        this.applyErrorText('The password is invalid or the user is not recognized.');
    }

    handleLoginError(error) {
        switch (error.code) {
            case 'auth/invalid-email':
                this.invalidEmail();
                break;
            case 'auth/user-not-found':
            case 'auth/wrong-password':
                this.wrongPassword();
                break;
            default:
                alert('OH NO! Something went wrong!');
        }
    }

    login(e) {
        e.preventDefault();
        fbase.auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((u) => { })
            .catch((error) => {
                this.handleLoginError(error);
            });
    }

    signup(e) {
        e.preventDefault();
        fbase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((u) => { })
            .then((u) => { console.log(u) })
            .catch((error) => {
                console.log(error);
            });
    }

    render() {
        return (
            <div id='login-overlay'>
                <form id='login-form'>
                    <p className='center-text'>Welcome to iChat!</p>

                    <img id='avatar' src={ require( '../../images/avatar.png') } alt='avatar' />

                    <input type="email" name="email" id="email"
                           value={ this.state.email } onChange={ this.handleChange }
                           ref={(element) => { this.emailInput = element; }}
                           placeholder="Enter email" />

                    <input type="password" name="password" id="password"
                           value={ this.state.password } onChange={ this.handleChange }
                           ref={(element) => { this.passwordInput = element; }}
                           placeholder="Enter password" />

                    <p id='error-text' ref={(element) => { this.errorParagraph = element; }} />

                    <button className="green" type="submit" onClick={ this.login }>Login</button>
                    <button className="blue" type="submit" value={ this.state.email }>Recover your account</button>

                    <a className='center-text' onClick={ this.signup } href=''>Sign up</a>
                </form>
            </div>
        );
    }
}

export default Login;
