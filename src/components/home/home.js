import React, { Component } from 'react';

import fbase from '../../config/firebase';

import './home.css'

class Home extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout() {
        fbase.auth().signOut();
    }

    render() {
        return (
            <div className='App'>
                <div className='site'>
                    <div className='item header'>Header</div>
                    <div className='item friend-list'>Friend list</div>
                    <div className='item main'>
                        <button onClick={ this.logout }>Logout</button>
                    </div>
                    <footer className='item footer'>Footer</footer>
                </div>
            </div>
        );
    }
}

export default Home;
