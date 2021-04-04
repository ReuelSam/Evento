const Post = require('../models/post');
const formidable = require('formidable');
const fs = require('fs');                   // file system module
const _ = require('lodash');
const { update } = require('lodash');

// default status sent be express framework is 200. no need to specify it
// find() method fetches posts from db. We can specify a querry. Done later
// select() method used to select the fields we want

exports.postById = (req, res, next, id) => {
    Post.findById(id)
    .populate("postedBy", "_id name")
    .populate("comments", 'text created')
    .populate("comments.postedBy", '_id name')
    .select("_id title body venue dateAndTime tags created photo likes notInterested")
    .exec((err, post) => {
        if (err || !post) {
            return res.status(400).json({
                error: err
            });
        }
        req.post = post;
        next();
    });
};


exports.getPosts = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 3;
    let totalItems;

    const posts = await Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
            .skip((currentPage - 1) * perPage)
            .populate("postedBy", "_id name")           // to get information of who posted
            .populate("comments", 'text created')
            .populate("comments.postedBy", '_id name') 
            .select("_id title body venue dateAndTime tags created photo likes notInterested")
            .sort({created: -1 })
            .limit(perPage)
    })
    .then((posts) => {
        res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
    })
    .catch(err => console.log(err));
};


exports.getPostsOldest = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 3;
    let totalItems;

    const posts = await Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
            .skip((currentPage - 1) * perPage)
            .populate("postedBy", "_id name")           // to get information of who posted
            .populate("comments", 'text created')
            .populate("comments.postedBy", '_id name') 
            .select("_id title body venue dateAndTime tags created photo likes notInterested")
            .sort({created: 1 })
            .limit(perPage)
    })
    .then((posts) => {
        res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
    })
    .catch(err => console.log(err));
};


exports.getPostsPopular = async (req, res) => {
    // get current page from req.query or use default value of 1
    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 3;
    let totalItems;

    const posts = await Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find()
            .skip((currentPage - 1) * perPage)
            .populate("postedBy", "_id name")           // to get information of who posted
            .populate("comments", 'text created')
            .populate("comments.postedBy", '_id name') 
            .select("_id title body venue dateAndTime tags created photo likes notInterested")
            .sort({likes: -1 })
            .limit(perPage)
    })
    .then((posts) => {
        res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
    })
    .catch(err => console.log(err));
};


// exports.getPostsOldest = (req, res) => {
//     console.log("getPostsOldest");
//     const posts = Post.find()
//     .populate("postedBy", "_id name")           // to get information of who posted
//     .populate("comments", 'text created')
//     .populate("comments.postedBy", '_id name') 
//     .select("_id title body venue dateAndTime tags created photo likes notInterested")
//     .sort({created: 1 }) 
//     .then((posts) => {
//         res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
//     })
//     .catch(err => console.log(err));
// };

// exports.getPostsPopular = (req, res) => {
//     console.log("getPostsOldest");
//     const posts = Post.find()
//     .populate("postedBy", "_id name")           // to get information of who posted
//     .populate("comments", 'text created')
//     .populate("comments.postedBy", '_id name') 
//     .select("_id title body venue dateAndTime tags created photo likes notInterested")
//     .sort({likes: -1 }) 
//     .then((posts) => {
//         res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
//     })
//     .catch(err => console.log(err));
// };

exports.createPost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        // check for error
        if (err){
            return res.status(400).json({
                error: "Image could not be uploaded."
            });
        };
        let post = new Post(fields);         //  create a post with the fields coming with req. Similar to req body?
        // res.json(req.profile);
        req.profile.hashed_password = undefined;
        req.profile.salt = undefined;
        post.postedBy = req.profile;
        
        // file handling
        if (files.photo) {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        };

        // convert post tags being sent from front end to proper format
        // example:
        //      incoming data: ["1,1,1,0,1,1,0,0"]
        //      required: [1,1,1,0,1,1,0,0]
        post.tags = post.tags[0].split(',').map(Number);
        
        
        // save post
        post.save((err, result) => {
            if (err){
                return res.status(400).json({
                    error: err
                });
            };
            res.json(result);
        })
    });
};


exports.postsByUser = (req, res) => {
    Post.find({postedBy: req.profile._id})
        .populate("postedBy", "_id name")           // we use populate and not select because postedBy points to another object of User Model
        .select("_id title")
        .sort("created")
        .exec((err, posts) => {
            // error handling
            if (err){
                return res.status(400).json({
                    error: err
                });
            }
            res.json(posts);
        });
};

exports.isPoster = (req, res, next) => {
    //console.log(typeof(req.post.postedBy._id));
    //console.log(typeof(req.auth._id));

    let isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
    if(!isPoster) {
        return res.status(403).json({
            error: "User is not authorized"
        });
    }
    next();
};

/*
exports.updatePost = (req, res, next) => {
    let post = req.post;
    post = _.extend(post, req.body);
    post.updated = Date.now();
    post.save(err => {
        if (err){
            return res.status(400).json({
                error: err
            });
        }
        res.json(post);
    });
};
*/

exports.updatePost = (req, res, next) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
        // error
        if (err)
        {
            return res.status(400).json({
                error: "Photo could not be uploaded"
            })
        }
        // save post
        let post = req.post;
        post = _.extend(post, fields);                      // (object-you-want-to-extend, what-you-want-to-apply)
                                                            //  extend() - mutate the source object
        // update date
        post.updated = Date.now();

        console.log(post.tags);
        if (post.tags.length == 1)
        {
            post.tags = post.tags[0].split(',').map(Number);
        }
        
        // populate post model
        if(files.photo)
        {
            post.photo.data = fs.readFileSync(files.photo.path);
            post.photo.contentType = files.photo.type;
        }
                                                        
        // save post
        post.save( (err, result) => {
            if (err){
                return res.status(400).json({
                    error: err
                });
            };
            
            res.json(post);
        })
    })
}


exports.deletePost = (req, res) => {
    let post = req.post;
    post.remove((err, post) => {
        if (err) {
            return res.status(400).json({error: err});
        }
        res.json({
            message: "Post deleted successfully"
        });
    });
};

exports.photo = (req, res, next) => {
    res.set("Content-Type", req.post.photo.contentType)
    return res.send(req.post.photo.data)
}

exports.singlePost = (req, res) => {
    return res.json(req.post);
}

exports.like = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {$push: {likes: req.body.userId}}, {new: true})
    .exec((err, result) => {
        if (err)
        {
            return res.status(400).json(
                {error: err}
                )
        }
        else
        {
            res.json(result);
        }
    })
}

exports.unlike = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {$pull: {likes: req.body.userId}}, {new: true})
    .exec((err, result) => {
        if (err)
        {
            return res.status(400).json(
                {error: err}
                )
        }
        else
        {
            res.json(result);
        }
    })
}

exports.notInterested = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {$push: {notInterested: req.body.userId}}, {new: true})
    .exec((err, result) => {
        if (err)
        {
            return res.status(400).json(
                {error: err}
                )
        }
        else
        {
            res.json(result);
        }
    })
}

exports.undoNotInterested = (req, res) => {
    Post.findByIdAndUpdate(req.body.postId, {$pull: {notInterested: req.body.userId}}, {new: true})
    .exec((err, result) => {
        if (err)
        {
            return res.status(400).json(
                {error: err}
                )
        }
        else
        {
            res.json(result);
        }
    })
}

exports.comment = (req, res) => {
    let comment = req.body.comment;
    comment.postedBy = req.body.userId;
    Post.findByIdAndUpdate(req.body.postId, {$push: {comments: comment}}, {new: true})
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
        if (err)
        {
            return res.status(400).json(
                {error: err}
                )
        }
        else
        {
            res.json(result);
        }
    })
}

exports.uncomment = (req, res) => {
    let comment = req.body.comment;
    
    Post.findByIdAndUpdate(req.body.postId, {$pull: {comments: { _id: comment._id} } }, {new: true})
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((err, result) => {
        if (err)
        {
            return res.status(400).json(
                {error: err}
                )
        }
        else
        {
            res.json(result);
        }
    })
}



exports.getPostsFollow = async (req, res) => {

    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 3;
    let totalItems;

    console.log("getPostsFollow");
    let following = req.profile.following;
    const posts = await Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find({postedBy: {$in: following}})
            .skip((currentPage - 1) * perPage)
            .populate("postedBy", "_id name")           // to get information of who posted
            .populate("comments", 'text created')
            .populate("comments.postedBy", '_id name') 
            .select("_id title body venue dateAndTime tags created photo likes notInterested")
            .sort({created: -1 }) 
            .limit(perPage)
    })    
    .then((posts) => {
        res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
    })
    .catch(err => console.log(err));
};

exports.getPostsFollowOldest = async (req, res) => {

    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 3;
    let totalItems;

    console.log("getPostsFollow");
    let following = req.profile.following;
    const posts = await Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find({postedBy: {$in: following}})
            .skip((currentPage - 1) * perPage)
            .populate("postedBy", "_id name")           // to get information of who posted
            .populate("comments", 'text created')
            .populate("comments.postedBy", '_id name') 
            .select("_id title body venue dateAndTime tags created photo likes notInterested")
            .sort({created: 1 }) 
            .limit(perPage)
    })    
    .then((posts) => {
        res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
    })
    .catch(err => console.log(err));
};

exports.getPostsFollowPopular = async (req, res) => {

    const currentPage = req.query.page || 1;
    // return 3 posts per page
    const perPage = 3;
    let totalItems;

    console.log("getPostsFollow");
    let following = req.profile.following;
    const posts = await Post.find()
    .countDocuments()
    .then(count => {
        totalItems = count;
        return Post.find({postedBy: {$in: following}})
            .skip((currentPage - 1) * perPage)
            .populate("postedBy", "_id name")           // to get information of who posted
            .populate("comments", 'text created')
            .populate("comments.postedBy", '_id name') 
            .select("_id title body venue dateAndTime tags created photo likes notInterested")
            .sort({likes: -1 }) 
            .limit(perPage)
    })    
    .then((posts) => {
        res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
    })
    .catch(err => console.log(err));
};

// exports.getPostsFollowOldest = (req, res) => {
//     console.log("getPostsFollowOldest");
//     let following = req.profile.following;
//     const posts = Post.find({postedBy: {$in: following}})
//     .populate("postedBy", "_id name")           // to get information of who posted
//     .populate("comments", 'text created')
//     .populate("comments.postedBy", '_id name') 
//     .select("_id title body venue dateAndTime tags created photo likes notInterested")
//     .sort({created: 1 }) 
//     .then((posts) => {
//         res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
//     })
//     .catch(err => console.log(err));
// };

// exports.getPostsFollowPopular = (req, res) => {
//     console.log("getPostsFollowPopular");
//     let following = req.profile.following;
//     const posts = Post.find({postedBy: {$in: following}})
//     .populate("postedBy", "_id name")           // to get information of who posted
//     .populate("comments", 'text created')
//     .populate("comments.postedBy", '_id name') 
//     .select("_id title body venue dateAndTime tags created photo likes notInterested")
//     .sort({likes: -1 }) 
//     .then((posts) => {
//         res.json(posts);               // here key and value are the same {posts: posts}. This can be replaced with just { post }
//     })
//     .catch(err => console.log(err));
// };