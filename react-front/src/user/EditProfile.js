import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { read, update, updateUser } from './apiUser';
import { Redirect } from 'react-router-dom';
import DefaultProfile from '../images/avatar.png';

class EditProfile extends Component {
    constructor() {
        super()
        this.state = {
            id: "",
            name: "",
            email: "",
            about: "",
            password: "",
            repassword: "",
            redirectToProfile: false,
            error: "",
            fileSize: 0,
            loading: false,
            defaultImage: true,
            imagePath: ''
        }
    }

    // to get userid from url

    init = (userId) => {
        const token = isAuthenticated().token;
        read(userId, token)
        .then(data => {
            if (data.error) 
            {
                this.setState({redirectToProfile: true});
            }
            else 
            {
                // console.log(data);
                this.setState({ id: data._id, name: data.name, email: data.email, error: "", about: data.about });
            }
        });
    }


    

    componentDidMount() {
        //console.log("User ID from route params: ", this.props.match.params.userId);
        this.userData = new FormData();                 // API
        const userId = this.props.match.params.userId;
        this.init(userId);
    }


    // higher order function: function that returns another function. This function takes the 'event'
    handleChange = (name) => event => {
        const value = name === "photo" ? event.target.files[0] : event.target.value;
        if (value === undefined)
        {
            this.setState({ defaultImage: true});
            return;
        }
        else if (name === "photo")
        {
            this.setState({ defaultImage: false, imagePath: URL.createObjectURL(event.target.files[0])});
            
        }

        const fileSize = name === "photo" ? event.target.files[0].size : 0;
        this.userData.set(name, value);
        this.setState({ [name]: value, fileSize, error: "" });
    };


    //check if input fields are valid
    isValid = () => {
        const {name, email, password, repassword, fileSize} = this.state;
        
        if (fileSize > 250000)      // 100KB
        {
            this.setState({error: "File size should be less 200KB"});
            return false;
        }
        
        if (name.length === 0)
        {
            this.setState({error: "Name is required."});
            return false;
        }

        // email@domain.com
        // eslint-disable-next-line
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) )
        {
            this.setState({error: "Valid Email is required."});
            return false;
        }
        if (password.length >= 1 && password.length <= 7)
        {
            this.setState({error: "Password must be atleast 8 characters in length."});

            return false;
        }

        if (password !== repassword)
        {
            this.setState({error: "Entered passwords do not match."});
            return false;
        }
        return true;
    }

    clickSubmit = event => {
        // browser reloads page by defualt on submit. therefore, we need to prevent default behavior
        event.preventDefault();
        

        if (this.isValid())
        {
            this.setState({loading: true});
            const userId = this.props.match.params.userId;
            const token = isAuthenticated().token;

            update(userId, token, this.userData)
            // checking for error response
            .then(data => {
                if (data.error)
                {
                    this.setState({error: data.error})
                }
                else
                {
                    updateUser(data, () => {
                        this.setState({
                            redirectToProfile: true
                        })
                    });
                    
                }
            })
        }
    };


    signupForm = (name, email, about, password, repassword) => (

        <form>
            <div className="form-group">
                <label className="text-muted">Profile Picture</label>
                <input onChange={this.handleChange("photo")} type="file" className="form-control" accept="image/*"/>
            </div>
            
            <div className="form-group">
                <label className="text-muted">Name</label>
                <input onChange={this.handleChange("name")} type="text" className="form-control" value={name}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Email</label>
                <label type="email" className="form-control font-italic" value={email}>{email}</label>
            </div>

            <div className="form-group">
                <label className="text-muted">About</label>
                <textarea onChange={this.handleChange("about")} type="text" className="form-control" value={about}/>
            </div>

            <div className="form-group">
                <label className="text-muted">New Password</label>
                <br />
                <label className="text-muted" style={{fontSize: "0.75em"}}>(Leave empty if you do not wish to update password)</label>
                
                <input onChange={this.handleChange("password")} type="password" className="form-control mb-3" value={password} />
                { password && (
                    <>
                        <label className="text-muted">Re-Enter Password</label>
                        <input onChange={this.handleChange("repassword")} type="password" className="form-control" value={repassword} />
                    </>    
                    )
                }
                
            </div>
            
            
            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Update</button>

        </form>
    )

    render() {
        const { id, name, email, password, repassword, redirectToProfile, error, loading, about, defaultImage, imagePath } = this.state;

        if (redirectToProfile)
        {
            return <Redirect to={`/user/${id}`} />
        }

        const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container" >
                <h2 className="mt-5 mb-5">Edit Profile</h2>

                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
                    {error}        
                </div>

                { loading ? <div className="jumbotron text-center"><h2>Loading...</h2> </div> : "" }

                {
                    defaultImage ? 
                        (
                            <figure className="figure">
                                <img style={{height: "200px", width:"auto"}} 
                                    className="figure-img img-fluid rounded" 
                                    src={photoUrl}
                                    alt={name}
                                    onError={i => i.target.src = `${DefaultProfile}`}                     
                                />
                                <figcaption className="figure-caption">Existing Event Image</figcaption>
                            </figure>
                        )
                        :
                        (
                            <figure className="figure">
                                <img style={{height: "200px", width:"auto"}} 
                                    className="figure-img img-fluid rounded" 
                                    src={imagePath}                
                                    alt={name} 
                                />
                                <figcaption className="figure-caption">Image to be uploaded</figcaption>
                            </figure>  
                        )
                } 

                {isAuthenticated().user.role === "admin" ||
                    (isAuthenticated().user._id === id &&
                        this.signupForm(name, email, about, password, repassword))}

            </div>
        )
    }
}

export default  EditProfile;