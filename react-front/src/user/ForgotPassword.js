import React, { Component } from "react";
import { forgotPassword } from "../auth";
import { Link } from 'react-router-dom';
 
class ForgotPassword extends Component {
    state = {
        email: "",
        message: "",
        error: ""
    };
 
    forgotPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });
        forgotPassword(this.state.email).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message });
            }
        });
    };
 
    render() {
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Password Reset</h2>
 
                {this.state.message && (
                    <div className="alert alert-success">
                        {this.state.message}        
                    </div>
                )}
                {this.state.error && (
                    <div className="alert alert-danger">
                        {this.state.error}       
                    </div>
                )}
 
                <form>
                    <div className="form-group mt-5">
                        <input
                            type="email"
                            className="form-control"
                            placeholder="Enter your Email Address"
                            value={this.state.email}
                            name="email"
                            onChange={e =>
                                this.setState({
                                    email: e.target.value,
                                    message: "",
                                    error: ""
                                })
                            }
                            autoFocus
                        />
                    </div>
                    
                    <p>
                        <button onClick={this.forgotPassword} className="btn btn-raised btn-primary mr-3 mt-3">Send Password Reset Link</button>
                        <Link to="/signin" className="btn btn-raised btn-success mt-3">{" "}Back To Signin</Link>
                    </p>
                </form>
            </div>
        );
    }
}
 
export default ForgotPassword;