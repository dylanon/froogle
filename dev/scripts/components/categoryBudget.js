import React from 'react';
import SetBudget from './setBudget.js';

export default class CategoryBudget extends React.Component {
    render() {
        const currentCategoryObject = this.props.currentCategoryObject;
        // Build budget content
        let budgetContent;
        if (currentCategoryObject === undefined) {
            // If not filtering by category, calculate and show the total budget
            const monthlyBudget = this.props.categories.reduce((total, category) => {
                if (category.budget) {
                    return total + Number(category.budget);
                } else {
                    return total;
                }
            }, 0);
            budgetContent = <p>Total budgeted: ${monthlyBudget}</p>
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
            <div className="category-budget">
                {budgetContent}
            </div>
        )
    }
}