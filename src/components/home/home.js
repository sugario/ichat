import React from 'react';
import Firebase from '../../config/firebase';
import Chat from '../chat/chat';
import FriendList from '../friendList/friendList';
import './home.css'

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            user: '',
            search: '',
            searchResult: [],
            searchFocused: false,
            friendList: []
        };

        this.usersRef = Firebase.database().ref().child('users');
    }

    componentWillReceiveProps(props) {
        this.setState({ user: props.user },
                      this.updateFriendlist);
    }

    async updateFriendlist() {
        if (!this.state.user) {
            return;
        }

        let friendList = [];
        let emailList = [];

        await this.usersRef
            .orderByChild('email')
            .equalTo(this.state.user.email)
            .once('child_added', currentUser => {
                emailList = currentUser.child('friendList').val();
            });

        for (let email of emailList) {
            await this.usersRef
                .orderByChild('email')
                .equalTo(email)
                .once('child_added', friend => {
                    friendList.push(friend.val());
                });
        }

        this.setState({ friendList: friendList });
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
                    this.setState({ friendList: friendList });
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
                    this.setState({ friendList: friendList });
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

        if (!friendList) {
            return
        }

        friendList.forEach(friend => {
            this.usersRef
                .orderByChild('email')
                .equalTo(friend)
                .once('value', user => {
                    console.log(user.val());
                });
        });
    }

    onBlur() {
        this.setState({ searchFocused: false });
    }

    onFocus() {
        this.setState({ searchFocused: true });
    }

    render() {
        return (
            <div className='App'>
                <div className='site'>
                    <div className='item header'>
                        <div className="logo">iChat</div>
                        <button onClick={this.logout.bind(this)}>Logout</button>
                    </div>
                    <div className='item fr iend-list'>
                        <input name='search'
                               type='text'
                               placeholder='Search people'
                               value={this.state.search}
                               onChange={this.handleChange.bind(this)}
                               onBlur={this.onBlur.bind(this)}
                               onFocus={this.onFocus.bind(this)}
                        />
                        {
                            (this.state.searchFocused && this.state.search !== '')
                                ? <FriendList data={this.state.searchResult} />
                                : <FriendList data={this.state.friendList} />
                        }

                        <button onClick={this.handleAddFriend.bind(this)}>Add friend</button>
                        <button onClick={this.handleRemoveFriend.bind(this)}>Remove friend</button>
                        <button onClick={this.logFriendsData.bind(this)}>Log friends</button>
                    </div>
                    <div className='item main'>
                        <Chat user={this.state.user} />
                    </div>
                </div>
            </div>
        );
    }
}
