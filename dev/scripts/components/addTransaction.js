import React from 'react';

export default class AddTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userString: ''
        }
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({
            userString: e.target.value
        });
    }

    render() {
        return (
            <form className="add-transaction__form">
                <label htmlFor="add-transaction__input">Add Transaction</label>
                <input type="text" id="add-transaction__input" onChange={this.handleChange} value={this.state.userString} />
                <input type="submit" value="Add"/>
                <p>{this.state.userString}</p>
            </form>
        )
    }
}