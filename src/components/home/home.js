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

    handleAddFriend(e) {
        e.preventDefault();

        this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .once('child_added', currentUser => {
                let friendList = currentUser.child('friendList').val();
                if (!friendList) {
                    friendList = [];
                }

                if (this.state.search && friendList.indexOf(this.state.search) < 0) {
                    friendList.push(this.state.search);
                    friendList.sort();
                    currentUser.ref.update({ friendList: friendList });
                }
            });
    }

    handleRemoveFriend(e) {
        e.preventDefault();

        this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .once('child_added', currentUser => {
                let friendList = currentUser.child('friendList').val();
                if (!friendList || !this.state.search) {
                    return;
                }

                const friendIndex = friendList.indexOf(this.state.search);
                if (friendIndex > -1) {
                    friendList.splice(friendIndex, 1);
                    currentUser.ref.update({ friendList: friendList });
                }
            });
    }

    async logFriendsData(e) {
        e.preventDefault();

        let friendList;
        await this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .once('child_added', currentUser => {
                friendList = currentUser.child('friendList').val();
            });

        friendList.forEach(friend => {
            this.usersRef
                .orderByChild('email')
                .equalTo(friend)
                .once('value', user => {
                    console.log(user.val());
                });
        });
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
                        <button onClick={this.handleAddFriend.bind(this)}>Add friend</button>
                        <button onClick={this.handleRemoveFriend.bind(this)}>Remove friend</button>
                        <button onClick={this.logFriendsData.bind(this)}>Log friends</button>
                    </div>
                    <div className='item main'>
                        <Chat user={this.state.user} />
                        <button onClick={this.logout.bind(this)}>Logout</button>
                    </div>
                </div>
            </div>
        );
    }
}
