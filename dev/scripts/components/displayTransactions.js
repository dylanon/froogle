import React from 'react';

export default class DisplayTransactions extends React.Component {
    render() {
        return (
            <div className="transactions-list">
                <h2>Transactions</h2>
                <ul>
                    <li>A froogle transaction</li>
                    <li>A froogle transaction</li>
                    <li>A froogle transaction</li>
                    <li>A froogle transaction</li>
                    <li>A froogle transaction</li>
                    <li>A froogle transaction</li>
                </ul>
            </div>
        )
    }
}