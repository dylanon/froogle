import React from 'react';
import ReactDOM from 'react-dom';
import AddTransaction from './components/addTransaction';

class App extends React.Component {
    render() {
      return (
        <div className="app-wrapper">
          <AddTransaction />
        </div>
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
// - Check if the category exists
//   - If yes, do nothing
//   - If no, create a new category in the database
// - Store the transaction in the database
// - Retrieve all transactions for this month and display
// - Allow editing and deletion of transactions