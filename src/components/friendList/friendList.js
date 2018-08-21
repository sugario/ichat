import React from 'react';
import './friendList.css';
export default class extends React.Component {
    render() {
        return (
            <div class="friend-container">
                {
                    this.props.data.map((element, i) => {
                        console.log(element);
                        return (
                            <div class="friend">
                                <div>{element}</div>
                                <div class="status">(Online)</div>
                                <button class="add-button">Add</button>
                            </div>
                        )
                    })
                }
            </div>
        );
    }
}
