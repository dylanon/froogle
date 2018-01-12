import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';
import moment from 'moment';
import AddTransaction from './components/addTransaction';
import DisplayTransactions from './components/displayTransactions';

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        uid: '',
        transactions: []
      }
      this.listenForData = this.listenForData.bind(this);
    }

    componentDidMount() {
      // Check if the user is signed in and listen for changes to authorization
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log('User is signed in!');
          console.log(user);
          // Store user id in state
          this.setState({
            uid: user.uid
          });
          // Download data and listen for changes
          this.listenForData();
        } else {
          console.log('Not signed in.');
          this.signInAnonymously();
        }
      });
    }

    signInAnonymously() {
      firebase.auth().signInAnonymously()
        .then(res => {
          console.log('Signing in anonymously.')
          console.log(res);
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`Error! Code ${errorCode}: ${errorMessage}`);
        });
    }
    
    listenForData() {
      // Create the database reference
      const today = moment();
      const year = today.format('YYYY');
      const month = today.format('MM');
      const dbRef = firebase.database().ref(`users/${this.state.uid}/transactions/${year}/${month}`);
      // Download the current month's transactions, and listen for changes and new transactions
      dbRef.on('value', snapshot => {
        const rawTransactions = snapshot.val();
        // Store each transaction's unique database key on the transaction object
        const transactions = [];
        for (let transaction in rawTransactions) {
          const transactionObject = Object.assign({}, rawTransactions[transaction]);
          transactionObject.key = transaction;
          // Store the transaction object in the array
          transactions.push(transactionObject);
        };
        // Store the transactions array in state
        this.setState({
          transactions
        });
      });
    }

    render() {
      return (
        <React.Fragment>
          <DisplayTransactions />
          <AddTransaction uid={this.state.uid} />
        </React.Fragment>
      )
    }
}

ReactDOM.render(<App />, document.getElementById('app'));

// Pseudocode
// - Accept a transaction as a string
// - Interpret string (max one of each, min 1 of any):
//    1) a date (default is today)
//    2) a dollar amount (default is $0)
//    3) a category (default is #general)
//    4) a description (default is 'A froogle transaction')
// - Store the transaction in the database
// - Retrieve all transactions for this month and display
// - Allow editing and deletion of transactions