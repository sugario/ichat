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
        if (!this.state.user || !this.state.user.email) {
            return;
        }

        this.refreshStatus();
        this.attachStatusListener();
    }

    componentWillReceiveProps(props) {
        this.setState({
            ...props
        });
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
            <div className='friend'
                 onClick={() => this.state.handleFriendSelect(this.state.user)}>
                <div className='name-and-status'>
                    <div className={this.state.status + ' status'}>
                    {
                        (!this.state.user.email)
                            ? ''
                            : '•'
                    }
                    </div>
                    <div className='friend-name'>
                    {
                        (!this.state.user.email)
                            ? 'Discussion Board'
                            : this.state.user.email
                    }
                    </div>
                </div>
                {
                    (!this.state.buttonText)
                        ? ''
                        : <button className='add-button green'
                                  onClick={() => { this.state.buttonEvent(this.state.user) }}>
                            {this.state.buttonText}
                          </button>
                }
                </div>
        );
    }
}
