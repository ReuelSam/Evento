import React, { Component } from 'react'
import { signup } from '../auth';
import { Link } from 'react-router-dom';

const tagNames = ["Environmental", "Social", "Educational", "Sport",  "Recreational",  "Music", "Political", "Festive"]

export default class Signup extends Component {
    constructor()
    {
        super()
        this.state = {
            name: "",
            email: "",
            password: "",
            repassword: "",
            tags: [0,0,0,0,0,0,0,0],
            error: ""
        }
    }

    // higher order function: function that returns another function. This function takes the 'event'
    handleChange = (name) => event => {
        this.setState({error: ""});
        this.setState({open: false});                   // if change is made, remove success message
        this.setState({ [name]: event.target.value });
    };

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

    clickSubmit = event => {
        // browser reloads page by defualt on submit. therefore, we need to prevent default behavior
        event.preventDefault();
        const {name, email, password, repassword} = this.state;
        let arr = this.state.tags;
        arr.map((value, index) => {
            if (value === 0)
            {
                arr[index] = 0.25;
            }
            return null;
        })
        if (password !== repassword)
        {
            this.setState({error: "Entered Passwords do not match"});
            return;
        }
        const user = {                                  // or       const user = {             
            name: name,                                 //              name,
            email: email,                               //              email,
            password: password,                          //              password
            tags: arr
        };                                              //          };
        // console.log(user);
        signup(user)
        // checking for error response
        .then(data => {
            console.log(data);
            if (data.error)
            {
                this.setState({error: data.error})
            }
            else
            {
                this.setState({
                    error: "",
                    name: "",
                    email: "",
                    password: "",
                    repassword: "",
                    tags: [0,0,0,0,0,0,0,0],
                    open: true              // set to true so that success message is displayed
                })

            }
        })
    };


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
            <label className="text-muted">Interested Tags</label>
            <br />
            <div className="button-group ml-5 mr-5" >
                
                {this.createCheckboxes()}

            </div>
        </div>
    )


    signupForm = (name, email, password, repassword) => (
        <form>
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={this.handleChange("name")} type="text" className="form-control" value={name}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <input onChange={this.handleChange("email")} type="email" className="form-control" value={email}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Password</label>
                <input onChange={this.handleChange("password")} type="password" className="form-control" value={password}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Re-enter Password</label>
                <input onChange={this.handleChange("repassword")} type="password" className="form-control" value={repassword}/>
            </div>
            
            {this.tagsForm()}

            <center>
                <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Submit</button>
            </center>
        </form>
    )

    render() {
        const {name, email, password, repassword, error, open} = this.state;
        return (
            <div className="container mt-3" style={{backgroundColor:"#ffffff"}}>
                <br />
                <h2 className="">Signup</h2>

                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
                    {error}        
                </div>

                <div className="alert alert-info" style={{display: open ? "" : "none"}}>
                    New Account has been created successfully. Please proceed to <Link to="/signin">Sign In.</Link>
                </div>

                {this.signupForm(name, email, password, repassword)}
            
                <br />
            </div>
        )
    }
}
