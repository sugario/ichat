import React from 'react';
import Firebase from '../../config/firebase';
import './friendListElement.css';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: props.user,
            buttonText: props.buttonText,
            buttonEvent: props.buttonEvent,
            status: 'offline',
            handleFriendSelect: props.handleFriendSelect
        };

        this.usersRef = Firebase.database().ref().child('users');
        this.attachStatusListener = this.attachStatusListener.bind(this);
        this.refreshStatus = this.refreshStatus.bind(this);
    }

    componentDidMount() {
        this.refreshStatus();
        this.attachStatusListener();
    }

    refreshStatus() {
        this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .once('child_added', user => {
                const status = user.val().status;
                if (status) {
                    this.setState({ status: status });
                }
            });
    }

    attachStatusListener() {
        this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .on('child_changed', user => {
                this.setState({ status: user.val().status });
            });
    }

    render() {
        return (
            <div className='friend'>
                <div onClick={() => this.state.handleFriendSelect(this.state.user)}>{this.state.user.email}</div>
                <div className='status'>({this.state.status})</div>
                <button className='add-button' onClick={() => { this.state.buttonEvent(this.state.user) }}>
                    {this.state.buttonText}
                </button>
            </div>
        );
    }
}
