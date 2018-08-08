import React, { Component } from 'react';
import { Link } from 'react-router-dom'

import './registration.css';

class Registration extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id='registration-overlay'>
                <form id='registration-form'>
                    <h1>Register</h1>
                    <p>Please fill in this form to create an account.</p>
                    <hr className='hr-top' />

                    <label htmlFor='email'>Email</label>
                    <input type='text' placeholder='Enter email' name='email' className='no-radius' required />

                    <label htmlFor='password'>Password</label>
                    <input type='password' placeholder='Enter password' name='password' className='no-radius' required />

                    <label htmlFor='password-repeat'>Repeat Password</label>
                    <input type='password' placeholder='Repeat password' name='password-repeat' className='no-radius' required />

                    <hr className='hr-bottom' />

                    <button type='submit' className='blue'>Register</button>

                    <div className='signin center-text'>
                        <p>Already have an account? <Link style={{ color: 'blue' }} to='/home'>Sign in.</Link></p>
                    </div>
                </form>
            </div>
        );
    }
}

export default Registration;
