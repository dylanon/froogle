import React from 'react';
import SetBudget from './setBudget.js';

export default class CategoryBudget extends React.Component {
    render() {
        const currentCategoryObject = this.props.currentCategoryObject;
        // Build category text
        let categoryText;
        if (currentCategoryObject) {
            categoryText = <p>Category: #{currentCategoryObject.category}</p>
        } else {
            categoryText = <p>Viewing all transactions</p>
        }
        // Build budget content
        let budgetContent;
        if (currentCategoryObject === undefined) {
            // If not filtering by category, show the total budget
            budgetContent = <p>Total budget for this month: $XXXX.XX</p>
        } else if (Number(currentCategoryObject.budget) > 0) {
            // If in a category && budget set to over 0, show the budget
            budgetContent = (
                <React.Fragment>
                    <p>Budget: ${currentCategoryObject.budget}</p>
                    <SetBudget currentCategoryObject={currentCategoryObject} uid={this.props.uid} />
                </React.Fragment>
            )
        } else {
            // If in a category && no budget set (or budget === 0), show a component that allows us to set it
            budgetContent = <SetBudget currentCategoryObject={currentCategoryObject} uid={this.props.uid} />
        }

        return (
            <section>
                <h3>Budget</h3>
                {categoryText}
                {budgetContent}
            </section>
        )
    }
}