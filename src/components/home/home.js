import React from 'react';
import Firebase from '../../config/firebase';

import Chat from '../chat/chat';
import FriendList from '../friendList/friendList';
import './home.css';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            search: '',
            searchResult: [],
            searchFocused: false,
            friendList: [],
            chatTarget: {}
        };

        this.usersRef = Firebase.database().ref().child('users');
        this.handleAddFriend = this.handleAddFriend.bind(this);
        this.handleRemoveFriend = this.handleRemoveFriend.bind(this);
        this.selectNewChatTarget = this.selectNewChatTarget.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState({ ...props },
                      this.startFriendlistListener);
    }

    handleChange(e) {
        this.setState({ [e.target.name]: e.target.value },
                      this.handleSearchKeyPress);
    }

    startFriendlistListener() {
        if (!this.state.user) {
            return;
        }

        this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .on('value', currentUser => {
                currentUser.forEach(user => {
                    this.setState({ friendList: user.val().friendList });
                });
            });
    }

    handleSearchKeyPress() {
        if (this.state.search === '') {
            this.setState({ searchResult: [] });
            return;
        }

        this.usersRef
            .orderByChild('email')
            .startAt(this.state.search)
            .endAt(this.state.search + '\uf8ff')
            .limitToFirst(5)
            .on('value', snapshot => {
                let searchResult = [];
                snapshot.forEach(user => {
                    searchResult.push(user.val());
                });

                this.setState({ searchResult: searchResult });
            });
    }

    logout() {
        Firebase.auth().signOut();
    }

    handleAddFriend(user) {
        let friendList = this.state.friendList;
        if (!friendList) {
            friendList = [];
        }

        for (let friend in friendList) {
            if (friendList[friend].email === user.email) {
                return;
            }
        }

        friendList.push(user);
        this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .once('child_added', currentUser => {
                currentUser.ref.update({ friendList: friendList });
            });
    }

    handleRemoveFriend(user) {
        let friendList = this.state.friendList;
        if (!friendList) {
            return;
        }

        for (let index in friendList) {
            if (friendList[index].email === user.email) {
                friendList.splice(index, 1);
                return;
            }
        }

        this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .once('child_added', currentUser => {
                currentUser.ref.update({ friendList: friendList });
            });
    }

    selectNewChatTarget(targetUser) {
        this.setState({ chatTarget: targetUser });
    }

    render() {
        return (
            <div className='site'>
                <div className='item header'>
                    <img alt='logo'
                         src={require('../../images/logo.png')}
                         className='logo' />
                    <button onClick={this.logout.bind(this)}>Logout</button>
                </div>
                <div className='item friend-list'>
                    <input name='search'
                           type='text'
                           placeholder='Search people'
                           value={this.state.search}
                           onChange={this.handleChange.bind(this)}
                           ref={(element) => { this.searchInput = element; }} />
                    {
                        (this.state.search !== '')
                            ? <FriendList data={this.state.searchResult}
                                          buttonText='Add'
                                          handleButtonClick={this.handleAddFriend}
                                          handleFriendSelect={this.selectNewChatTarget} />
                            : <div />
                    }
                    {
                        (this.state.search === '')
                            ? <FriendList data={this.state.friendList}
                                          buttonText='Remove'
                                          handleButtonClick={this.handleRemoveFriend}
                                          handleFriendSelect={this.selectNewChatTarget} />
                            : <div />
                    }
                </div>
                <div className='item main'>
                    <Chat user={this.state.user}
                          chatTarget={this.state.chatTarget} />
                </div>
            </div>
        );
    }
}
