import React from 'react';
import Firebase from '../../config/firebase';
import Chat from '../chat/chat';
import './home.css'

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: ''
        };
    }

    componentWillReceiveProps(props) {
        this.setState({ user: props.user });
    }

    logout() {
        Firebase.auth().signOut();
    }

    render() {
        return (
            <div className='App'>
                <div className='site'>
                    <div className='item header'>Header</div>
                    <div className='item friend-list'>Friend list</div>
                    <div className='item main'>
                        <Chat user={this.state.user} />
                        <button onClick={this.logout.bind(this)}>Logout</button>
                    </div>
                    <footer className='item footer'>Footer</footer>
                </div>
            </div>
        );
    }
}
