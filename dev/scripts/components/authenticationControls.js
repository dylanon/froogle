import React from 'react';
import firebase from 'firebase';

export default class AuthenticationControls extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            accountAlreadyInUse: false
        }
        this.linkAccountWithGoogle = this.linkAccountWithGoogle.bind(this);
    }

    linkAccountWithGoogle(e) {
        e.preventDefault();
        const provider = new firebase.auth.GoogleAuthProvider();
        console.log('Current user is:', firebase.auth().currentUser);
        firebase.auth().currentUser.linkWithPopup(provider)
        .then(res => {
            console.log('Accounts linked.');
            console.log('Current user:', res.user);
            this.props.updateUser();
        })
        .catch(error => {
            console.log(`Error linking accounts. Code ${error.code}: ${error.message}`);
            if (error.code === 'auth/credential-already-in-use') {
                this.setState({
                    accountAlreadyInUse: true
                });
            }
        });
    }

    signInWithGoogle(e) {
        e.preventDefault();
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

    signOut(e) {
        e.preventDefault();
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
        // Build controls markup
        let controls;
        if (this.props.isAnonymous) {
            if (this.state.accountAlreadyInUse) {
                controls = (
                    <React.Fragment>
                        <li className="button--authentication">
                            <a href="#" onClick={this.signInWithGoogle}>Account in Use - Click to Sign In</a>
                        </li>
                        <li>or</li>
                        <li className="button--authentication">
                            <a href="#" onClick={this.linkAccountWithGoogle}>Save to Different Account</a>
                        </li>
                    </React.Fragment>
                )
            } else {
                controls = (
                    <React.Fragment>
                        <li className="button--authentication">
                            <a href="#" onClick={this.linkAccountWithGoogle}>Save Data with Google</a>
                        </li>
                        <li>or</li>
                        <li className="button--authentication">
                            <a href="#" onClick={this.signInWithGoogle}>Sign In</a>
                        </li>
                    </React.Fragment>
                )
            }
        } else {
            controls = (
                <li className="button--authentication">
                    <a href="#" onClick={this.signOut}>Sign Out</a>
                </li>
            )
        }

        return (
            <ul className="authentication-controls">
                {controls}
            </ul>
        )
    }
}