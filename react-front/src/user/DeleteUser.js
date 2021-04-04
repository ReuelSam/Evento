import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { isAuthenticated, signout } from '../auth';
import { remove } from './apiUser';

class DeleteUser extends Component {

    state = {
        redirect: false
    }

    deleteAccount = () => {
        console.log("Delete Account")
        const token = isAuthenticated().token;
        const userId = this.props.userId;
        remove(userId,token)
        .then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                // signout user using signout() writtin in src/auth/index.js
                signout(() => console.log("User is deleted"));
                // redirect - we need state
                this.setState({ redirect: true})
            }
        })
    }

    deleteConfirmed = () => {
        let answer = window.confirm("Are you sure you wish to delete your account? This will delete all your details from our database.");
        if (answer)
        {
            this.deleteAccount();
        }
    }

    render() {
        if(this.state.redirect)
        {
            return <Redirect to="/" />
        }
        return (
            
                <button onClick={this.deleteConfirmed} className="btn btn-raised btn-danger">Delete Profile</button>
            
        )
    }
}


export default DeleteUser;