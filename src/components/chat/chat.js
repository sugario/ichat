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
        };

        this.messageRef = Firebase.database().ref().child('messages');
    }

    componentDidMount() {
        this.listenMessages();
    }

    componentWillReceiveProps(props) {
        if (props.user && props.user.email) {
            this.setState({ userName: props.user.email });
        }
    }

    handleChange(event) {
        this.setState({ message: event.target.value });
    }

    handleSend() {
        if (this.state.message) {
            this.messageRef.push({
                userName: this.state.userName,
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
            .limitToLast(10)
            .on('value', message => {
                message = message.val();
                if (message) {
                    this.setState({
                        list: Object.values(message)
                    });
                }
            });
    }

    render() {
        return (
            <div className='form_chat'>
                <div className='form_message'>
                    {this.state.list.map((item, index) =>
                        <Message key={index} message={item} />
                    )}
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
