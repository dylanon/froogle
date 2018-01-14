import React from 'react';
import moment from 'moment';
import firebase from '../firebase';

export default class DisplayTransactions extends React.Component {
    handleDelete(e, transaction) {
        e.preventDefault();
        // Build database reference
        const uid = this.props.uid;
        const key = transaction.key;
        const transactionMoment = moment(transaction.date, 'YYYY-MM-DD');
        const year = transactionMoment.format('YYYY');
        const month = transactionMoment.format('MM');
        const dbRef = firebase.database().ref(`users/${uid}/${year}/${month}/transactions/${key}`);
        // Delete the transaction
        dbRef.remove()
        .catch(error => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.log(`Error! Code ${errorCode}: ${errorMessage}`);
        });
    }

    render() {
        const transactionsArray = Array.from(this.props.transactions);
        // Sort transactions reverse chronologically
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
                                <div className="display-transactions__item-delete">
                                    <a href="#" onClick={(e) => this.handleDelete(e, transaction)}>Delete</a>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        )
    }
}