import React from 'react';
import Firebase from '../../config/firebase';
import Message from '../message/message';
import './chat.css';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            userName: 'User',
            message: '',
            list: [],
            chatTarget: {}
        };

        this.messageRef = Firebase.database().ref().child('messages');
        this.listenMessages = this.listenMessages.bind(this);
    }
    
    componentWillReceiveProps(props) {
        if (props.user && props.user.email) {
            this.setState({ userName: props.user.email, chatTarget: props.chatTarget },
                          () => { this.listenMessages() });
        }
    }

    handleChange(event) {
        this.setState({ message: event.target.value });
    }

    handleSend() {
        if (this.state.message) {
            this.messageRef.push({
                userName: this.state.userName,
                chatTarget: this.state.chatTarget,
                message: this.state.message
            });

            this.setState({ message: '' });
        }
    }

    handleKeyPress(event) {
        if (event.key !== 'Enter') {
            return;
        }

        this.handleSend();
    }

    listenMessages() {
        this.messageRef
            .on('value', message => {
                message = Object.values(message.val());
                if (!message) {
                    return;
                }

                message = message.filter(msg => {
                    if (!this.state.chatTarget || !this.state.chatTarget.email) {
                        return !msg.chatTarget;
                    } else if (msg.chatTarget && msg.chatTarget.email) {
                        return (msg.chatTarget.email === this.state.chatTarget.email) ||
                               (msg.chatTarget.email === this.state.userName &&
                                    this.state.chatTarget.email === msg.userName)
                    }

                    return false;
                });

                this.setState({
                    list: message
                });
            });
    }

    render() {
        return (
            <div className='form_chat'>
                <div className='form_message'>
                    {this.state.list.map((item, index) =>
                        <Message key={index} message={item} currentUser={this.state.userName} />
                    )}
                    <div>Chatting with: {this.state.chatTarget.email}</div>
                </div>
                <div className='form_row'>
                    <input className='form_input'
                           type='text'
                           placeholder='Type message'
                           value={this.state.message}
                           onChange={this.handleChange.bind(this)}
                           onKeyPress={this.handleKeyPress.bind(this)} />
                    <button className='form_button'
                            onClick={this.handleSend.bind(this)}
                    >send</button>
                </div>
            </div>
        );
    }
}
