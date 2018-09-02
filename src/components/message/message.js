import React from 'react';

import './message.css';

export default class extends React.Component {
    render() {
        let type;
        (this.props.message.userName === this.props.currentUser)
            ? type = 'sent'
            : type = 'recieved';

        return (
            <div className={'message ' + type} >
                <span className='author'>
                    {this.props.message.userName}:
                </span>
                {this.props.message.message}
            </div>
        );
    }
}
