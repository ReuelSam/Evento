import React, { Component } from 'react';
import { list } from './apiUser';
import { Link } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

class Users extends Component {
    constructor() {
        super();
        this.state = {
            users: [],
            loading: true
        }
    }

    componentDidMount() {
        // list method written in src/user/apiUser.js
        list().then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                this.setState({users: data, loading: false});
            }
        })
    }   

    renderUsers = (users) => (
        <div className="row">
            {
                users.map((user , i) => (
                    <div className="card col-md-4 mt-3" key={i}>
                    
                        <div className="card-body">

                            <img 
                                style={{height: "300px", width:"100%"}} 
                                className="img-thumbnail" 
                                src={`${process.env.REACT_APP_API_URL}/user/photo/${user._id}`} 
                                onError={i => (
                                    i.target.src = `${DefaultProfile}`
                                    )} 
                                alt={user.name}> 
                            </img>

                            <h5 className="card-title">{user.name}</h5>
                            <p className="card-text">{user.email}</p>
                            <Link to={`/user/${user._id}`} className="btn btn-raised btn-primary btn-sm">View Profile</Link>
                        </div>
                    </div>
                )
            )}   
        </div>
    )

    render() {
        const {users, loading} = this.state;
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">All Users</h2>

                { loading ? <div className="jumbotron text-center"><h2>Loading...</h2> </div> : "" }


                {this.renderUsers(users)}

            </div>
        )
    }
}

export default  Users;