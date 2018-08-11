import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom'

import fbase from '../../config/firebase';

import './registration.css';

class Registration extends Component {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);

        this.signup = this.signup.bind(this);

        this.state = {
            email: '',
            password: '',
            passwordRepeat: '',
            redirectToHome: false
        };
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value });
    }

    signup(e) {
        e.preventDefault();

        if (this.state.password !== this.state.passwordRepeat) {
            alert('Oh no! Something went wrong.');
            return;
        }

        fbase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then((u) => { console.log(u) })
            .then((u) => { 
                this.setState({ redirectToHome: true });
            }).catch((error) => {
                alert('Oh no! Something went wrong.');
            });
    }

    render() {
        if (this.state.redirectToHome) {
            return <Redirect to='/home' />
        }

        return (
            <div id='registration-overlay'>
                <form id='registration-form'>
                    <h1>Register</h1>
                    <p>Please fill in this form to create an account.</p>
                    <hr className='hr-top' />

                    <label>Email</label>
                    <input type='text' placeholder='Enter email' name='email' id='email'
                        onChange={this.handleChange} value={this.state.email}
                        className='no-radius' required />

                    <label>Password</label>
                    <input type='password' placeholder='Enter password' name='password' id='password'
                        onChange={this.handleChange} value={this.state.password}
                        className='no-radius' required />

                    <label>Repeat Password</label>
                    <input type='password' placeholder='Repeat password' name='passwordRepeat' id='passwordRepeat'
                        onChange={this.handleChange} value={this.state.passwordRepeat}
                        className='no-radius' required />

                    <hr className='hr-bottom' />

                    <button type='submit' className='blue' onClick={this.signup}>Register</button>

                    <div className='signin center-text'>
                        <p>Already have an account? <Link style={{ color: 'blue' }} to='/home'>Sign in.</Link></p>
                    </div>
                </form>
            </div>
        );
    }
}

export default Registration;
