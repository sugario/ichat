import React from 'react';
import FriendListElement from './friendListElement';
import './friendList.css';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: props.data,
            buttonText: props.buttonText,
            handleButtonClick: props.handleButtonClick,
            handleFriendSelect: null
        };
    }

    componentDidMount() {
        this._isMounted = true;
    }

    componentWillUnmount() {
        this._isMounted = false;
    }

    componentWillReceiveProps(props) {
        if (this._isMounted) {
            this.setState({
                ...props
            });
        }
    }

    render() {
        if (!this.state.data) {
            return <div />
        }

        return (
            <div className='friend-container'>
                {
                    this.state.data.map((element, i) => {
                        return <FriendListElement key={i}
                                                  user={element}
                                                  buttonText={this.state.buttonText}
                                                  buttonEvent={this.state.handleButtonClick}
                                                  handleFriendSelect={this.state.handleFriendSelect} />
                    })
                }
            </div>
        );
    }
}
