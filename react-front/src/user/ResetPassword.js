import React, { Component } from "react";
import { resetPassword } from "../auth";
import { Link } from 'react-router-dom';
 
class ResetPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newPassword: "",
            rePassword: "",
            message: "",
            error: ""
        };
    }
 

    resetPassword = e => {
        e.preventDefault();
        this.setState({ message: "", error: "" });

        const newPassword = this.state.newPassword;
        const rePassword = this.state.rePassword;

        if (rePassword !== newPassword)
        {
            this.setState({error: "Entered Passwords do not match"});
            return false;
        }

        resetPassword({
            newPassword: this.state.newPassword,
            resetPasswordLink: this.props.match.params.resetPasswordToken
        }).then(data => {
            if (data.error) {
                console.log(data.error);
                this.setState({ error: data.error });
            } else {
                console.log(data.message);
                this.setState({ message: data.message, newPassword: "" });
            }
        });
    };
 
    render() {
        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Reset Your Password</h2>
 
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
                        <input type="password" className="form-control mb-5" placeholder="Your new password" value={this.state.newPassword} name="newPassword"
                            onChange={e => this.setState({newPassword: e.target.value, message: "", error: ""})} autoFocus
                        />

                    <input type="password" className="form-control" placeholder="Re-Enter new password" value={this.state.rePassword} name="rePassword"
                            onChange={e => this.setState({rePassword: e.target.value, message: "", error: ""})} 
                        />
                    </div>


                    <p>
                        <button onClick={this.resetPassword} className="btn btn-raised btn-primary mt-3 mr-3">Reset Password</button>
                        <Link to="/signin" className="btn btn-raised btn-success mt-3">{" "}Back To Signin</Link>
                    </p>
                </form>
            </div>
        );
    }
}
 
export default ResetPassword;