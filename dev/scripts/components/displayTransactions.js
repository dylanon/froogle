import React from 'react';
import moment from 'moment';

export default class DisplayTransactions extends React.Component {
    render() {
        // Sort transactions reverse chronologically
        const transactionsArray = Array.from(this.props.transactions);
        transactionsArray.sort((a , b) => {
            const momentA = moment(a.date, 'YYYY-MM-DD');
            const momentB = moment(b.date, 'YYYY-MM-DD');
            if (momentB.isBefore(momentA, 'day')) {
                return -1;
            } else {
                return 1;
            }
        });
        
        return (
            <div className="display-transactions">
                <h2>Transactions</h2>
                <ul className="display-transactions__list">
                    {transactionsArray.map(transaction => {
                        return (
                            <li className="display-transactions__item" key={transaction.key}>
                                <div className="display-transactions__item-date">{moment(transaction.date, 'YYYY-MM-DD').format('MMM DD')}</div>
                                <div className="display-transactions__item-description">{transaction.description}</div>
                                <div className="display-transactions__item-amount">{transaction.amount}</div>
                                <div className="display-transactions__item-category">#{transaction.category}</div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}