import React, { Component } from 'react';

import fbase from '../../config/firebase';

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
            <div>
                <h1>Welcome to iChat!</h1>
                <button onClick={ this.logout }>Logout</button>
            </div>
        );
    }
}

export default Home;
