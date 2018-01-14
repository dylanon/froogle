import React from 'react';

export default class Header extends React.Component {
    render() {
        const styles = {
            backgroundColor: 'rebeccapurple'
        }
        return (
            <header style={styles}>
                <h1>Froogle</h1>
            </header>
        )
    }
}