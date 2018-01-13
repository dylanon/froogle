import React from 'react';

export default class Categories extends React.Component {
    render() {
        const categoriesArray = this.props.categories;
        return (
            <ul>
                <li>
                    <a href="#">View all</a>
                </li>
                {categoriesArray.map(category => {
                    return (
                        <li key={category.key}>
                            <div>
                                <a href="#">#{category.category}</a>
                            </div>
                            <div>
                                <a href="#">Set budget</a>
                            </div>
                            {/* <a href="#">Remove</a> */}
                        </li>
                    )
                })}
            </ul>
        )
    }
}