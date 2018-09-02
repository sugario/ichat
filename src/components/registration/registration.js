import React from 'react';
import { Link, Redirect } from 'react-router-dom';

import Firebase from '../../config/firebase';

import './registration.css';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            password: '',
            passwordRepeat: '',
            redirectToHome: false
        };

        this.usersRef = Firebase.database().ref().child('users');
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

        Firebase.auth()
            .createUserWithEmailAndPassword(this.state.email, this.state.password)
            .then(user => {
                this.usersRef.push({
                    uid: user.user.uid,
                    email: user.user.email
                });
            }).then(_ => {
                Firebase.auth().signOut();
                this.setState({ redirectToHome: true });
            }).catch(_ => {
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
                    <input placeholder='Enter email'
                           name='email'
                           id='email'
                           className='no-radius'
                           type='text'
                           onChange={this.handleChange.bind(this)}
                           value={this.state.email}
                           required />

                    <label>Password</label>
                    <input placeholder='Enter password'
                           name='password'
                           id='password'
                           className='no-radius'
                           type='password'
                           onChange={this.handleChange.bind(this)}
                           value={this.state.password}
                           required />

                    <label>Repeat Password</label>
                    <input  placeholder='Repeat password'
                            name='passwordRepeat'
                            id='passwordRepeat'
                            className='no-radius'
                            type='password'
                            onChange={this.handleChange.bind(this)}
                            value={this.state.passwordRepeat}
                            required />

                    <hr className='hr-bottom' />

                    <button type='submit'
                            className='blue'
                            onClick={this.signup.bind(this)}>
                                Register
                    </button>

                    <div className='signin center-text'>
                        <p>
                            Already have an account?
                            <Link style={{ color: 'blue' }} to='/home'> Sign in.</Link>
                        </p>
                    </div>
                </form>
            </div>
        );
    }
}
