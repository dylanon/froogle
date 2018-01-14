import React from 'react';

export default class Title extends React.Component {
    render() {
        const styles = {
            backgroundColor: 'green'
        }

        let title;
        if (this.props.filterCategory.length > 0) {
            title = `#${this.props.filterCategory}`;
        } else {
            title = 'All Transactions';
        }
        return (
            <div className="view-title">
                <h2>{title}</h2>
            </div>
        )
    }
}