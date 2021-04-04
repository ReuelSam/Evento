import React, { Component } from 'react';
import { Link, Redirect} from 'react-router-dom';
import {signin, authenticate} from '../auth';
import SocialLogin from './SocialLogin';
import {updateTags} from '../user/apiUser';


const tagNames = ["Environmental", "Social", "Educational", "Sport",  "Recreational",  "Music", "Political", "Festive"];


export default class Signin extends Component {
    constructor()
    {
        super()
        this.state = {
            email: "",
            password: "",
            error: "",
            redirectToReferer: false,
            loading: false,
            showTags: false,
            tags: [0,0,0,0,0,0,0,0]
        }
    }


    // higher order function: function that returns another function. This function takes the 'event'
    handleChange = (name) => event => {
        this.setState({error: ""});
        this.setState({ [name]: event.target.value });
    };

    clickSubmit = event => {
        // browser reloads page by defualt on submit. therefore, we need to prevent default behavior
        event.preventDefault();
        this.setState({loading: true});
        const {email, password} = this.state;
        const user = {                                  // or       const user = {             
            email: email,                               //              email,
            password: password                          //              password
        };                                              //          };
        // console.log(user);
        signin(user)
        // checking for error response
        .then(data => {
            if (data.error)
            {
                this.setState({error: data.error, loading: false})
            }
            else
            {
                // if successful login, redirect to new page
                // authenticate user 
                    authenticate(data, () => {
                        this.setState({redirectToReferer: true})
                    })
                // and then redirect
                
            }
        })
    };

 
    showTags = (flag, data) => {
        this.setState({ showTags: flag, data: data});
    }

    createCheckbox = label => (
        <label className="btn btn-primary" key={tagNames.indexOf(label)}>
            <input type="checkbox" className="form-check-input" onChange={this.tagChecked(label)} checked={!!(this.state.tags[tagNames.indexOf(label)])} />
                {label}
        </label>
    )

    createCheckboxes = () => (
        tagNames.map(this.createCheckbox)
    )
    
    tagsForm = () => (
        <div className="form-group">
            <label className="text-muted">New User! Choose your interested Tags</label>
            <br />
            <div className="button-group ml-5 mr-5" >
                
                {this.createCheckboxes()}

            </div>

            <button onClick={this.submitTags} className="btn btn-raised btn-primary">Submit Tags</button>
            
        </div>
    )

    submitTags = () => {
        const {data} = this.state;
        const token = data.token;
        const userId = data.user._id;
        let arr = this.state.tags;
        arr.map((value, index) => {
            if (value === 0)
            {
                arr[index] = 0.25;
            }
            return null;
        })
        updateTags(userId, token, arr).then(data => {
            if (data.error)
            {
                console.log(data.error);
            }
            else
            {
                ;
            }
        })
        authenticate(data, () => {
            this.setState({redirectToReferer: true})
        })

    }
    

    tagChecked = (name) => event => {
        this.setState({open: false});
        
        console.log(name + event.target.checked);
        let flag = event.target.checked;
        let index = tagNames.indexOf(name);
        //console.log(index);
        let arr = this.state.tags;
        arr[index] = flag ? 0.75 : 0;
        this.setState({ tags: arr });
        // console.log("Tags: " + this.state.tags);
    }


    signinForm = (email, password) => (

        <form>
            
            <div className="form-group" style={{width: "40%", margin:"auto"}}>
                <label className="text-muted">Email</label>
                <input onChange={this.handleChange("email")} type="email" className="form-control" value={email}/>
            </div>

            <div className="form-group" style={{width: "40%", margin:"auto"}}>
                <label className="text-muted">Password</label>
                <input onChange={this.handleChange("password")} type="password" className="form-control" value={password}/>
            </div>
            
            <br />
            <center>
                <button onClick={this.clickSubmit} className="btn btn-raised btn-primary d-inline">Submit</button>
            </center>

        </form>
    )


    render() {
        const {email, password, error, redirectToReferer, loading} = this.state;
        if (redirectToReferer) {
            return <Redirect to="/" />
        }
        return (
            <div className="container mt-3" style={{backgroundColor:"#ffffff"}}>
                <br />
                <h2 className="">Sign In</h2>

                <hr />
                <br />

                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
                    {error}        
                </div>

                { loading ? <div className="jumbotron text-center"><h2>Loading...</h2> </div> : "" }

                {!this.state.showTags && this.signinForm(email, password)}
            
                {!this.state.showTags && (
                    <>
                        <center>
                        <p>
                            <Link to="/forgot-password" className="btn btn-raised btn-danger d-inline">{" "}Forgot Password</Link>
                        </p>
                        </center>
                                
                                        <center>
                            <br />
                            <h4 className="text-muted"> OR </h4>
                            <br />
                            <SocialLogin getTags={this.showTags}/>
                        </center>
                    </>   
                )}

                
                { this.state.showTags && this.tagsForm()}


                <br />
                <br />
                <br />
            </div>
        )
    }
}
