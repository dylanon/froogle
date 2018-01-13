import React from 'react';

export default class Categories extends React.Component {
    render() {
        const budgetsArray = this.props.budgets;
        return (
            <ul>
                {budgetsArray.map(budget => {
                    return <li key={budget.key}>#{budget.category}</li>
                })}
            </ul>
        )
    }
}