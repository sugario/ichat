import React from 'react';
import Firebase from '../../config/firebase';
import Chat from '../chat/chat';
import './home.css'

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            search: ''
        };

        this.usersRef = Firebase.database().ref().child('users');
    }

    componentWillReceiveProps(props) {
        this.setState({ user: props.user });
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value },
                      this.handleSearchKeyPress);
    }

    handleSearchKeyPress() {
        this.usersRef
            .orderByChild('email')
            .startAt(this.state.search)
            .endAt(this.state.search + '\uf8ff')
            .limitToFirst(10)
            .on('value', snapshot => {
                snapshot.forEach(user => {
                    console.log(user.val());
                });
            });
    }

    logout() {
        Firebase.auth().signOut();
    }

    render() {
        return (
            <div className='App'>
                <div className='site'>
                    <div className='item header'>Header</div>
                    <div className='item friend-list'>
                        <input name='search'
                               type='text'
                               placeholder='Search people'
                               value={this.state.search}
                               onChange={this.handleChange.bind(this)}
                        />
                    </div>
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
