import React from 'react';

export default class TotalSpent extends React.Component {
    render() {
        const transactions = this.props.transactions;
        // Compute the total spent this month
        const total = transactions.reduce((accumulator, transaction) => {
            return accumulator += Number(transaction.amount);
        }, 0);

        // Generate text to describe spending context
        const currentCategoryObject = this.props.currentCategoryObject;
        let spendingContext;
        if (currentCategoryObject) {
            spendingContext = `this Month in #${currentCategoryObject.category}`;
        } else {
            spendingContext = 'this Month';
        }
        
        return <h2>Total Spent {spendingContext}: {total.toFixed(2)}</h2>
    }
}