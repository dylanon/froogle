import React from 'react';

export default class TotalSpent extends React.Component {
    render() {
        const transactions = this.props.transactions;
        // Compute the total spent this month
        const total = transactions.reduce((accumulator, transaction) => {
            return accumulator += Number(transaction.amount);
        }, 0);
        
        return <h2>Total Spent: {total.toFixed(2)}</h2>
    }
}