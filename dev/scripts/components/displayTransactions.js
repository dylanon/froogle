import React from 'react';
import moment from 'moment';
import firebase from '../firebase';

export default class DisplayTransactions extends React.Component {
    handleDelete(e, transaction) {
        e.preventDefault();
        // Build database reference
        const uid = this.props.uid;
        const key = transaction.key;
        const dbRef = firebase.database().ref(`users/${uid}/transactions/${key}`);
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
        let content;

        if (transactionsArray.length > 0) {
            // If there are transactions to display, sort and display
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
            // Build the content
            content = (
                <ul className="display-transactions__list">
                    {transactionsArray.map(transaction => {
                        return (
                            <li className="display-transactions__item" key={transaction.key}>
                                <div className="display-transactions__item-column display-transactions__item-date">{moment(transaction.date, 'YYYY-MM-DD').format('MMM DD')}</div>
                                <div className="display-transactions__item-column display-transactions__item-description">{transaction.description}</div>
                                <div className="display-transactions__item-column display-transactions__item-amount">{transaction.amount}</div>
                                <div className="display-transactions__item-column display-transactions__item-category">#{transaction.category}</div>
                                <div className="display-transactions__item-column display-transactions__item-delete">
                                    <a href="#" onClick={(e) => this.handleDelete(e, transaction)}><i title="Delete this transaction" className="fas fa-trash-alt"></i></a>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            )
        } else {
            // If there are no transactions to display, show some instructions
            content = (
                <div className="no-transactions">
                    <p className="no-transactions__lead">No transactions to show 🤑</p>
                    <p>Create one by typing one or more details into the box below:</p>
                    <ul className="fa-ul">
                        <li>
                            <span className="fa-li"><i className="fas fa-calendar"></i></span>
                            <span className="no-transactions__emphasize">Date</span> (<code>jan21</code> or <code>Jan 21</code> will both work)
                        </li>
                        <li>
                            <span className="fa-li"><i className="fas fa-dollar-sign"></i></span>
                            <span className="no-transactions__emphasize">Amount</span> (<code>$5.00</code>, <code>$5</code>, or even just <code>5</code>)
                        </li>
                        <li>
                            <span className="fa-li"><i className="fas fa-font"></i></span>
                            <span className="no-transactions__emphasize">Description</span> (Some text like <code>Chicken soup and apple pie</code>)
                        </li>
                        <li>
                            <span className="fa-li"><i className="fas fa-hashtag"></i></span>
                            <span className="no-transactions__emphasize">Category</span> (<code>#fun</code>, <code>#groceries</code>, <code>#dogstuff</code>)
                        </li>
                    </ul>
                    <p>Don't worry - I'll create some default values for info you don't provide!</p>
                </div>
            )
        }

        return (
            <section className="display-transactions">
                <h2>Transactions</h2>
                {content}
            </section>
        )
    }
}