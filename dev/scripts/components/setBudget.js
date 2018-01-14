import React from 'react';
import firebase from '../firebase';

export default class SetBudget extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            formIsOpen: false,
            userInputtedBudget: ''
        }
        this.handleChange = this.handleChange.bind(this);
        this.openForm = this.openForm.bind(this);
        this.closeForm = this.closeForm.bind(this);
    }

    handleChange(e) {
        this.setState({
            userInputtedBudget: e.target.value
        });
    }

    handleSubmit(e, categoryKey) {
        e.preventDefault();
        if (Number(this.state.userInputtedBudget) > 0) {
            // Create the database reference
            const categoryRef = firebase.database().ref(`users/${this.props.uid}/categories/${categoryKey}`);
            const userBudgetToTwoDecimals = Number(this.state.userInputtedBudget).toFixed(2);
            categoryRef.update({
                budget: userBudgetToTwoDecimals
            });
            console.log('submitted form');
        }
        this.closeForm();
        // Clear the value from state
        this.setState({
            userInputtedBudget: ''
        });
    }

    openForm(e) {
        e.preventDefault();
        this.setState({
            formIsOpen: true
        });
    }

    closeForm() {
        this.setState({
            formIsOpen: false
        });
    }

    render() {
        const currentCategoryObject = this.props.currentCategoryObject;
        const categoryKey = currentCategoryObject.key;
        let content;
        if (this.state.formIsOpen) {
            content = (
                <form onSubmit={(e) => this.handleSubmit(e, categoryKey)}>
                    <label htmlFor="budget-amount-input">Enter budget</label>
                    <input type="number" id="budget-amount-input" value={this.state.userInputtedBudget} placeholder="0.00" step="0.01" onChange={this.handleChange} />
                    <label htmlFor="submit-budget-amount">Submit budget</label>
                    <input type="submit" className="button" id="submit-budget-amount" value="Set" />
                </form>
            )
        } else {
            content = <a href="#" onClick={this.openForm}>Set budget</a>;
        }
        return (
                <div>
                    {content}
                </div>
        )
    }
}