import React from 'react';
import ReactDOM from 'react-dom';
import firebase from './firebase';
import Header from './components/header';
import Title from './components/title';
import AddTransaction from './components/addTransaction';
import DisplayTransactions from './components/displayTransactions';
import TotalSpent from './components/totalSpent';
import Categories from './components/categories';
import CategoryBudget from './components/categoryBudget'

class App extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        uid: '',
        isAnonymous: true,
        transactions: [],
        categories: [],
        filterCategory: ''
      }
      this.listenForData = this.listenForData.bind(this);
      this.filterTransactionsByCategory = this.filterTransactionsByCategory.bind(this);
      this.updateUser = this.updateUser.bind(this);
    }

    componentDidMount() {
      // Check if the user is signed in and listen for changes to authorization
      firebase.auth().onAuthStateChanged(user => {
        if (user) {
          console.log('User is signed in!');
          console.log('onAuthStateChanged User:', user);
          // Store user id in state
          this.setState({
            uid: user.uid,
            isAnonymous: user.isAnonymous
          });
          // Download data and listen for changes
          this.listenForData();
        } else {
          this.signInAnonymously();
        }
      });
    }

    updateUser() {
      // Updates the user when transitioning from anonymous auth to Google auth
      // During that transition, onAuthStateChanged does not fire, so call this function to update the state
      const user = firebase.auth().currentUser;
      this.setState({
        uid: user.uid,
        isAnonymous: user.isAnonymous
      });
    }

    signInAnonymously() {
      firebase.auth().signInAnonymously()
        .then(res => {
          console.log('Signing in anonymously.')
        })
        .catch(error => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(`Error! Code ${errorCode}: ${errorMessage}`);
        });
    }
    
    listenForData() {
      // Create the database reference
      const dbRef = firebase.database().ref(`users/${this.state.uid}`);
      // Download the transactions, and listen for changes and new transactions
      dbRef.on('value', snapshot => {
        // Only proceed if we found some data
        if (snapshot.val()) {
          // Store the raw transactions
          const rawTransactions = snapshot.val().transactions;
          // Store each transaction's unique database key on the transaction object
          const transactions = [];
          for (let transaction in rawTransactions) {
            const transactionObject = Object.assign({}, rawTransactions[transaction]);
            transactionObject.key = transaction;
            // Store the transaction object in the array
            transactions.push(transactionObject);
          };
          // Store the raw categories (same code used to store transactions above)
          const rawCategories = snapshot.val().categories;
          // Store each category's unique database key on the category object
          const categories = [];
          for (let category in rawCategories) {
            const categoryObject = Object.assign({}, rawCategories[category]);
            categoryObject.key = category;
            // Store the category object in the array
            categories.push(categoryObject);
          };
          // Store the transactions and categories arrays in state
          this.setState({
            transactions,
            categories
          });
        } 
      });
    }

    filterTransactionsByCategory(e, categoryName) {
      e.preventDefault();
      this.setState({
        filterCategory: categoryName
      });
    }

    applyTransactionFilters(transactionsArray, filterCategory) {
      let transactions;
      if (filterCategory.length > 0) {
          // Filter by category
          transactions = transactionsArray.filter(transaction => {
              return transaction.category === filterCategory;
          });
      } else {
          // Display all transactions (no filtering)
          transactions = transactionsArray;
      }
      return transactions;
    }

    render() {
      // Apply filters, if any, to downloaded transactions
      const transactions = this.applyTransactionFilters(this.state.transactions, this.state.filterCategory);

      // Store the current category's object
      let currentCategoryObject;
      if (this.state.filterCategory.length > 0) {
        currentCategoryObject = this.state.categories.find(category => {
          return category.category === this.state.filterCategory;
        });
      }

      return (
        <React.Fragment>
          <Header isAnonymous={this.state.isAnonymous} updateUser={this.updateUser} />
          <div className="container">
            <div className="wrapper container-content">
              <aside className="sidebar">
                <h2>Filter transactions by category:</h2>
                <Categories categories={this.state.categories} filterTransactionsByCategory={this.filterTransactionsByCategory} />
              </aside>
              <main className="main">
                <div className="transaction-info">
                  <Title filterCategory={this.state.filterCategory} />
                  <section className="spending-stats">
                    <TotalSpent transactions={transactions} currentCategoryObject={currentCategoryObject} />
                    <CategoryBudget currentCategoryObject={currentCategoryObject} uid={this.state.uid} categories={this.state.categories} />
                  </section>
                  <DisplayTransactions transactions={transactions} uid={this.state.uid} />
                </div>
                <AddTransaction uid={this.state.uid} categories={this.state.categories} />
              </main>
            </div>
          </div>
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