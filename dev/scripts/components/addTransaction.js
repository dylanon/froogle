import React from 'react';
import moment from 'moment';

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

    detectDate(transactionString) {
        // Store list of months (3 characters each)
        const months = moment.monthsShort();

        // Loop through months, match strings like 'Dec 31' and 'jan   1'
        // *** Problem here:
        // *** Only allows one matched date per month
        // *** If 'jan 17' and 'jan 28' are entered, only one of them is stored in the array
        const matches = [];
        months.forEach(month => {
            const reString = `(?:^|\\s)(${month})\\s*(\\d{1,2})(?=\\s|$)`;
            const re = new RegExp(reString, 'i');
            if (transactionString.match(re)) {
                matches.push(transactionString.match(re));
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
            this.setState({
                detectedDate: ''
            })
        }

        // Remove the matched text from the string we'll be passing on
        const newTransactionString = this.createNextTransactionString(transactionString, firstValidMatch);
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
            this.setState({
                detectedAmount: ''
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
            const category = match[1];
            this.setState({
                detectedCategory: category
            });
        } else {
            this.setState({
                detectedCategory: ''
            });
        }
        // Update the string to match and pass on for category detection
        const newTransactionString = this.createNextTransactionString(transactionString, match);
        this.detectDescription(newTransactionString);
    }

    detectDescription(transactionString) {
        // Remove whitespace from ends and store in state
        this.setState({
            detectedDescription: transactionString.trim()
        });
    }

    render() {
        return (
            <div className="add-transaction">
                <form className="add-transaction__form">
                    <label htmlFor="add-transaction__input">Add Transaction</label>
                    <input type="text" id="add-transaction__input" onChange={this.handleChange} value={this.state.userString} />
                    <input type="submit" value="Add"/>
                </form>
                <p>User entered: {this.state.userString}</p>
                <p>Detected date: {moment(this.state.detectedDate, 'YYYY-MM-DD').format('MMMM D, YYYY')}</p>
                <p>Detected amount: ${this.state.detectedAmount}</p>
                <p>Detected category: #{this.state.detectedCategory}</p>
                <p>Detected description: {this.state.detectedDescription}</p>
            </div>
        )
    }
}