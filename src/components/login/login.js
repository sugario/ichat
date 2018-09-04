import React from 'react';
import { Link } from 'react-router-dom';

import Color from '../constants/color';
import Firebase from '../../config/firebase';

import './login.css';

/*
 *  Default user:       admin@admin.com
 *  Default password:   adminadmin
 */

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: ''
        };

        this.handleChange = this.handleChange.bind(this);
        this.applyErrorText = this.applyErrorText.bind(this);
        this.invalidEmail = this.invalidEmail.bind(this);
        this.wrongPassword = this.wrongPassword.bind(this);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    applyErrorText(text) {
        this.errorParagraph.style.color = Color.RED;
        this.errorParagraph.textContent = text;
        this.errorParagraph.style.marginBottom = '25px';
    }

    invalidEmail() {
        this.emailInput.style.borderColor = Color.RED;
        this.passwordInput.style.borderColor = Color.GREEN;

        this.applyErrorText('The email address is badly formatted.');
    }

    wrongPassword() {
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
        Firebase.auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .catch(error => {
                this.handleLoginError(error);
            });
    }

    recoverAccount(e) {
        e.preventDefault();
        Firebase.auth()
            .sendPasswordResetEmail(this.state.email)
            .then(() => {
                this.applyErrorText('Check your mail!');
                this.errorParagraph.style.color = Color.GREEN;
            }).catch(error => {
                this.applyErrorText('The email address is badly formatted or account does not exist.');
            });
    }

    render() {
        return (
            <div id='login-overlay'>
                <form id='login-form'>
                    <p className='center-text'>Welcome to iChat!</p>
                    <img id='avatar'
                         src={require('../../images/avatar.png')}
                         alt='avatar' />

                    <input type='email' name='email' id='email'
                           value={this.state.email}
                           onChange={this.handleChange}
                           ref={element => { this.emailInput = element; }}
                           placeholder='Enter email' />

                    <input type='password' name='password' id='password'
                           value={this.state.password}
                           onChange={this.handleChange}
                           ref={element => { this.passwordInput = element; }}
                           placeholder='Enter password' />

                    <p id='error-text'
                       ref={element => { this.errorParagraph = element; }} />

                    <button className='green'
                            type='submit'
                            onClick={this.login.bind(this)}>
                                Login
                    </button>
                    <button className='blue'
                            type='submit'
                            onClick={this.recoverAccount.bind(this)}>
                                Recover your account
                    </button>

                    <Link className='center-text' to='/registration'>Sign up</Link>
                </form>
            </div>
        );
    }
}
