import React from 'react';

export default class AddTransaction extends React.Component {
    render() {
        return (
            <form className="add-transaction__form">
                <label htmlFor="add-transaction__input">Add Transaction</label>
                <input type="text" id="add-transaction__input"/>
                <input type="submit" value="Add"/>
            </form>
        )
    }
}