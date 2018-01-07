import React from 'react';
import moment from 'moment';

export default class AddTransaction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userString: '',
            detectedDate: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.detectDate = this.detectDate.bind(this);
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

    detectDate(transactionString) {
        // Store list of months (3 characters each)
        const months = moment.monthsShort();
        // Loop through months, match strings like 'Dec 31' and 'jan   1'
        const matches = [];
        months.forEach(month => {
            const reString = `(?:^|\\s)(${month})\\s*(\\d{1,2})(?:\\s|$)`;
            const re = new RegExp(reString, 'i');
            if (transactionString.match(re)) {
                matches.push(transactionString.match(re));
            }
        });
        // Store the transaction string to be passed on for further processing
        let newTransactionString = transactionString;
        // If there are matches, pick the first one that is a valid date
        if (matches.length > 0) {
            // Sort by index to order how they were actually entered
            matches.sort((a, b) => {
                return a.index - b.index;
            });
            // Loop through the matches until we find the first valid date
            let firstValidMatch;
            let firstValidDate;
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
            // Remove the matched text from the string we'll be passing on
            if (firstValidMatch) {
                const matchIndex = firstValidMatch.index;
                const matchText = firstValidMatch[0];
                const matchInput = firstValidMatch.input;
                newTransactionString = matchInput.slice(0, matchIndex) + matchInput.slice(matchIndex + matchText.length);
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
        } else {
            // Reset state if there was a match, but there is no longer one
            this.setState({
                detectedDate: ''
            });
        }
        // Pass on the string to look for a dollar value
        this.detectAmount(newTransactionString);
    }

    detectAmount(transactionString) {
        console.log('Checking for dollar amount in:', transactionString);
        
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
            </div>
        )
    }
}