import React from 'react';
import './message.css';

export default class extends React.Component {
    render() {
        return (
            <div className='message'>
                <span className='author'>
                    {this.props.message.userName}:
                </span>
                {this.props.message.message}
            </div>
        );
    }
}
