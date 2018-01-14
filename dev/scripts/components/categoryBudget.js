import React from 'react';

export default class CategoryBudget extends React.Component {
    render() {
        const currentCategoryObject = this.props.currentCategoryObject;
        let content;
        if (currentCategoryObject) {
            content = <p>Category: #{currentCategoryObject.category}</p>
        } else {
            content = <p>Viewing all transactions</p>
        }
        return (
            <section>
                <h3>Budget</h3>
                {content}
                {this.currentCategoryObject && this.currentCategoryObject.budget
                    ? <p>This category has a budget</p>
                    : <p>No budget yet</p>
                }
            </section>
        )
    }
}