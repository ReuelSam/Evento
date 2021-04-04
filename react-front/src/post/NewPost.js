import React, { Component } from 'react';
import { isAuthenticated } from '../auth';
import { create } from './apiPost';
import { Redirect } from 'react-router-dom';
import DefaultPost from '../images/event.jpg';

const tagNames = ["Environmental", "Social", "Educational", "Sport",  "Recreational",  "Music", "Political", "Festive"];

class NewPost extends Component {
    constructor() {
        super()
        this.state = {
            title: "",
            body: "",
            photo: "",
            venue: "",
            dateAndTime: "",
            error: "",
            fileSize: 0,
            loading: false,
            redirectToProfile: false,
            tagCheck: false,
            open: false,
            tags: [0,0,0,0,0,0,0,0],
            defaultImage: true,
            imagePath: "",
            user: {}
        }
    }

    

    componentDidMount() {
        //console.log("User ID from route params: ", this.props.match.params.userId);
        this.postData = new FormData();                 // API
        this.setState({
            user: isAuthenticated().user 
        })
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
        this.postData.set(name, value);
        this.setState({ [name]: value, fileSize, error: "" });
    };

    tagChecked = (name) => event => {
        this.setState({tagCheck: true, open: false});
        
        let flag = event.target.checked;
        let index = tagNames.indexOf(name);
        //console.log(index);
        let arr = this.state.tags;
        arr[index] = flag ? 1:0;
        this.setState({ tags: arr });
        this.postData.set("tags", arr);
    }

    //check if input fields are valid
    isValid = () => {
        const { title, body, fileSize } = this.state;
        
        if (fileSize > 200000)      // 100KB
        {
            this.setState({error: "File size should be less 200KB"});
            return false;
        }
        
        if (title.length === 0 || body.length === 0)
        {
            this.setState({error: "Title and Body is required."});
            return false;
        }

        // email@domain.com
        // eslint-disable-next-line
        
        return true;
    }

    clickSubmit = event => {
        // browser reloads page by defualt on submit. therefore, we need to prevent default behavior
        event.preventDefault();
        // console.log("post ", this.postData);
     
        if (this.state.tagCheck && this.isValid())
        {
            this.setState({loading: true});
            const userId = isAuthenticated().user._id;
            const token = isAuthenticated().token;
            
            create(userId, token, this.postData)
            // checking for error response
            .then(data => {
                if (data.error)
                {
                    this.setState({error: data.error})
                }
                else
                {
                    this.setState({
                        loading: false,
                        title: "",
                        body: "",
                        photo: "",
                        tags: [0,0,0,0,0,0,0,0],
                        redirectToProfile: true,
                    })
                    
                }
            })
        }
        else
        {
            this.setState({open: true})
        }
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
            <label className="text-muted">Event Tags</label>
            <br />
            <div className="button-group ml-5 mr-5" >
                
                {this.createCheckboxes()}

            </div>
        </div>
    )


    newPostForm = (title, body, venue, dateAndTime) => (

        <form>
            <div className="form-group">
                <label className="text-muted">Image</label>
                <input onChange={this.handleChange("photo")} type="file" className="form-control" accept="image/*"/>
            </div>
            
            <div className="form-group">
                <label className="text-muted">Title</label>
                <input onChange={this.handleChange("title")} type="text" className="form-control" value={title}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Description</label>
                <textarea onChange={this.handleChange("body")} type="text" className="form-control" value={body}/>
            </div>
            
            <div className="form-group">
                <label className="text-muted">Venue</label>
                <input onChange={this.handleChange("venue")} type="text" className="form-control" value={venue}/>
            </div>

            <div className="form-group">
                <label className="text-muted">Date and Time</label>
                <input onChange={this.handleChange("dateAndTime")} type="text" className="form-control" value={dateAndTime}/>
            </div>
            
            {this.tagsForm()}

            <button onClick={this.clickSubmit} className="btn btn-raised btn-primary">Create Post</button>

            

        </form>
    )

    render() {
        const { title, body, venue, dateAndTime,user, loading, error, redirectToProfile, open, defaultImage, imagePath } = this.state;

        if (redirectToProfile)
        {
            return <Redirect to={`/user/${user._id}`} />
        }

        // const photoUrl = id ? `${process.env.REACT_APP_API_URL}/user/photo/${id}?${new Date().getTime()}` : DefaultProfile;

        return (
            <div className="container">
                <h2 className="mt-5 mb-5">Create New Event</h2>

                <div className="alert alert-danger" style={{display: error ? "" : "none"}}>
                    {error}        
                </div>

                <div className="alert alert-danger" style={{display: open ? "" : "none"}}>
                    Please Choose tags related to your Event        
                </div>


                { loading ? <div className="jumbotron text-center"><h2>Loading...</h2> </div> : "" }

                {
                    defaultImage ? 
                        (
                            <figure className="figure">
                                <img style={{height: "200px", width:"auto"}} 
                                    className="figure-img img-fluid rounded" 
                                    src={DefaultPost}                     
                                    alt={title} 
                                />
                                <figcaption className="figure-caption">Default Image for an Event</figcaption>
                            </figure>
                        )
                        :
                        (
                            <figure className="figure">
                                <img style={{height: "200px", width:"auto"}} 
                                    className="figure-img img-fluid rounded" 
                                    src={imagePath}                
                                    alt={title} 
                                />
                                <figcaption className="figure-caption">Image to be uploaded</figcaption>
                            </figure>  
                        )
                }   

                {this.newPostForm(title, body, venue, dateAndTime)}

            </div>
        )
    }
}

export default  NewPost;