import React from 'react';

export default class Categories extends React.Component {
    render() {
        const categoriesArray = this.props.categories;
        return (
            <ul>
                {categoriesArray.map(category => {
                    return <li key={category.key}>#{category.category}</li>
                })}
            </ul>
        )
    }
}