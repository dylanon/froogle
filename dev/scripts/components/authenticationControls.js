import React from 'react';
import firebase from 'firebase';

export default class AuthenticationControls extends React.Component {
    linkAccountWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        console.log('Current user is:', firebase.auth().currentUser);
        firebase.auth().currentUser.linkWithPopup(provider)
        .then(res => {
            console.log('Accounts linked.');
            console.log('Current user:', res.user);
        })
        .catch(error => {
            console.log(`Error linking accounts. Code ${error.code}: ${error.message}`);
        });
    }

    signInWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider();
        firebase.auth().signInWithPopup(provider)
        .then(res => {
            console.log('Signed in with Google.');
            console.log('Current user:', res.user);
        })
        .catch(error => {
            console.log(`Error signing in with Google. Code ${error.code}: ${error.message}`);
        });
    }

    signOut() {
        firebase.auth().signOut()
        .then(res => {
            console.log('Signed out successfully.');
            document.location.reload(false);
        })
        .catch(error => {
            console.log(`Error signing out. Code ${error.code}: ${error.message}`);
        });
    }

    render() {
        return (
            <ul className="authentication-controls">
                <li><a href="#" onClick={this.linkAccountWithGoogle}>Save Data with Google</a></li>
                <li><a href="#" onClick={this.signInWithGoogle}>Sign In</a></li>
                <li><a href="#" onClick={this.signOut}>Sign Out</a></li>
            </ul>
        )
    }
}