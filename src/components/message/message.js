import React from 'react';
import './message.css';

export default class extends React.Component {
    render() {
        let source = 'recieved';
        if (this.props.message.userName === this.props.currentUser) {
            source = 'sent';
        }

        return (
            <div className={'message ' + source} >
                <span className='author'>
                    {this.props.message.userName}:
                </span>
                {this.props.message.message}
            </div>
        );
    }
}
