import React from 'react';
import './friendList.css';

export default class extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    componentWillReceiveProps(props) {
        this.setState({ data: props.data });
    }

    render() {
        return (
            <div className='friend-container'>
                {
                    this.state.data.map((element, i) => {
                        return (
                            <div key={i} className='friend'>
                                <div>{element}</div>
                                <div className='status'>(Online)</div>
                                <button className='add-button'>Add</button>
                            </div>
                        );
                    })
                }
            </div>
        );
    }
}
