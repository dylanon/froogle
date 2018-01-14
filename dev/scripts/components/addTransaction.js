import React from 'react';
import moment from 'moment';
import firebase from '../firebase';

export default class AddTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userString: '',
            detectedDate: '',
            detectedAmount: '',
            detectedCategory: '',
            detectedDescription: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.detectDate = this.detectDate.bind(this);
        this.detectCategory = this.detectCategory.bind(this);
        this.detectDescription = this.detectDescription.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearForm = this.clearForm.bind(this);
    }

    handleChange(e) {
        const userString = e.target.value
        // Capture user's input in state
        this.setState({
            userString
        });
        // Start processing the string
        this.detectDate(userString);
    }

    handleSubmit(e) {
        e.preventDefault();
        const transactionsRef = firebase.database().ref(`users/${this.props.uid}/transactions`);
        const transaction = {
            date: this.state.detectedDate,
            amount: this.state.detectedAmount,
            category: this.state.detectedCategory,
            description: this.state.detectedDescription
        };
        transactionsRef.push(transaction);
        // If this is a new category, store in database
        const categoriesArray = Array.from(this.props.categories);
        const duplicateCategories = categoriesArray.filter(category => {
            return category.category === this.state.detectedCategory;
        });
        if (duplicateCategories.length === 0) {
            const categoriesRef = firebase.database().ref(`users/${this.props.uid}/categories`);
            categoriesRef.push({
                category: this.state.detectedCategory
            });
        } else {
            console.log('Category already exists in the database.');
        }
        // Clear the user input (and any details stored in state)
        this.clearForm();
    }

    clearForm() {
        this.setState({
            userString: '',
            detectedDate: '',
            detectedAmount: '',
            detectedCategory: '',
            detectedDescription: ''
        });
    }

    createNextTransactionString(currentString, currentMatch) {
        // Returns a new string after a regex match - matched text is removed
        // If no match, returns the string unmodified
        let nextString = currentString;
        if (currentMatch) {
            const matchIndex = currentMatch.index;
            const matchText = currentMatch[0];
            const matchInput = currentMatch.input;
            nextString = matchInput.slice(0, matchIndex) + matchInput.slice(matchIndex + matchText.length);
        }
        return nextString;
    }

    removeSubstrings(currentString, arrayOfSubstrings) {
        let workingString = currentString;
        arrayOfSubstrings.forEach(substring => {
            const rePattern = new RegExp(substring, 'i');
            workingString = workingString.replace(rePattern, '');
        });
        return workingString; 
    }

    detectDate(transactionString) {
        // Store list of months (3 characters each)
        const months = moment.monthsShort();

        // Loop through months, match strings like 'Dec 31' and 'jan   1'
        const matches = [];
        months.forEach(month => {
            const reString = `(?:^|\\s)(${month})\\s*(\\d{1,2})(?=\\s|$)`;
            const re = new RegExp(reString, 'gi');
            // Look for a match (first time for this month)
            let matchedDate = re.exec(transactionString);
            // Since our regex pattern has the 'g' flag, we can call RegExp.prototype.exec() multiple times
            // Each time, it searched from the end of the last match, then update lastIndex on our RegExp object
            while (matchedDate != null) {
                // Store the match
                matches.push(matchedDate);
                // Run the search again
                matchedDate = re.exec(transactionString);
            }
        });
        
        // Initialize some variables to store the validated match
        let firstValidMatch;
        let firstValidDate;

        // If there are matches, find the first one that validates
        if (matches.length > 0) {
            // Sort by index to order how they were actually entered
            matches.sort((a, b) => {
                return a.index - b.index;
            });
            
            // Loop through the matches until we find the first valid date
            for (let i = 0; i < matches.length; i++) {
                // First regex capture group is the month (e.g. 'jan')
                const month = matches[i][1];
                // Second regex capture group is the day (e.g. 31)
                const day = matches[i][2];
                const momentObject = moment(`${month} ${day}`, 'MMM DD');
                if (momentObject._isValid) {
                    firstValidMatch = matches[i];
                    firstValidDate = momentObject.format('YYYY-MM-DD');
                    break;
                }
            }
        }

        // Store matched date in state
        if (firstValidDate) {
            this.setState({
                detectedDate: firstValidDate
            });
        } else {
            // Default to today's date
            this.setState({
                detectedDate: moment().format('YYYY-MM-DD')
            })
        }

        // Collect the matched substrings we need to remove before passing the string on for processing
        const matchSubstrings = [];
        for (let i = 0; i < matches.length; i ++) {
            const substring = matches[i][0];
            matchSubstrings.push(substring);
        }

        // Remove all dates from the string we'll be passing on
        const newTransactionString = this.removeSubstrings(transactionString, matchSubstrings);

        // Pass on the string to look for a dollar value
        this.detectAmount(newTransactionString);
    }

    detectAmount(transactionString) {
        const pattern = /(?:\$)?(\d*\.?\d+)(?=\s|$)/;
        const re = new RegExp(pattern, 'i');
        const match = transactionString.match(re);
        // Store amount in state
        if (match) {
            // The first capture group contains a string like '209.0394'
            const amount = Number(match[1]).toFixed(2);
            this.setState({
                detectedAmount: amount
            });
        } else {
            // Default to 0
            this.setState({
                detectedAmount: '0'
            });
        }
        // Update the string to match and pass on for category detection
        const newTransactionString = this.createNextTransactionString(transactionString, match);
        this.detectCategory(newTransactionString);
    }

    detectCategory(transactionString) {
        const pattern = /#([a-z]+)(?=\s|$)/;
        const re = new RegExp(pattern, 'i');
        const match = transactionString.match(re);
        // Store category in state
        if (match) {
            // The first capture group contains the category name
            const category = match[1].toLowerCase();
            this.setState({
                detectedCategory: category
            });
        } else {
            this.setState({
                detectedCategory: 'general'
            });
        }
        // Update the string to match and pass on for category detection
        const newTransactionString = this.createNextTransactionString(transactionString, match);
        this.detectDescription(newTransactionString);
    }

    detectDescription(transactionString) {
        // Remove whitespace from ends
        const description = transactionString.trim();
        if (description.length > 0) {
            // Store in state
            this.setState({
                detectedDescription: description
            });
        } else {
            // Set a default value
            this.setState({
                detectedDescription: 'A froogle transaction'
            });
        }
    }

    render() {
        return (
            <section className="add-transaction">
                <form className="add-transaction__form" onSubmit={this.handleSubmit}>
                    <label htmlFor="add-transaction__input">Enter transaction details</label>
                    <input type="text" id="add-transaction__input" onChange={this.handleChange} value={this.state.userString} />
                    <label htmlFor="add-transaction__submit">Add transaction</label>
                    <input type="submit" id="add-transaction__submit" value="Add"/>
                </form>
                <p>User entered: {this.state.userString}</p>
                <p>Detected date: {moment(this.state.detectedDate, 'YYYY-MM-DD').format('MMMM D, YYYY')}</p>
                <p>Detected amount: ${this.state.detectedAmount}</p>
                <p>Detected category: #{this.state.detectedCategory}</p>
                <p>Detected description: {this.state.detectedDescription}</p>
            </section>
        )
    }
}