import React from 'react';

export default class Categories extends React.Component {
    render() {
        const categoriesArray = this.props.categories;
        return (
            <nav className="categories-nav">
                <ul className="categories-list">
                    <li className="categories-list__item categories-list__item--view-all">
                        <a href="#" onClick={(e) => this.props.filterTransactionsByCategory(e, '')}>View all</a>
                    </li>
                    {categoriesArray.map(category => {
                        return (
                            <li key={category.key} className="categories-list__item">
                                <div>
                                    <a href="#" onClick={(e) => this.props.filterTransactionsByCategory(e, category.category)}>#{category.category}</a>
                                </div>
                                {/* <a href="#">Remove</a> */}
                            </li>
                        )
                    })}
                </ul>
            </nav>
        )
    }
}