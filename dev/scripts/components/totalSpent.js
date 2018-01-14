import React from 'react';

export default class TotalSpent extends React.Component {
    render() {
        const transactions = this.props.transactions;
        // Compute the total spent
        const total = transactions.reduce((accumulator, transaction) => {
            return accumulator += Number(transaction.amount);
        }, 0);
        
        return (
            <div className="total-spent">
                <p>Total spent: ${total.toFixed(2)}</p>
            </div>
        )
    }
}