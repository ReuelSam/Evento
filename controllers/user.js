const { extend } = require('lodash');
const _ = require('lodash');
const User = require("../models/user");
const formidable = require('formidable');
const fs = require('fs');                   // file system module
const kmeans = require('node-kmeans');


exports.userById = (req, res, next, id) => {
    User.findById(id)
    // populate followers and following users array
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec((err, user) => {
        // error handling
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        };

        req.profile = user;                              // adds profile object in request with user info
        next();
    })
};


exports.hasAuthorization = (req, res, next) => {
    //console.log(typeof(String(req.profile._id)));
    //console.log(typeof(req.auth._id));
    
    const authorized = req.profile && req.auth && String(req.profile._id) === req.auth._id;
//                              or
//  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;    
    if (!authorized){
        return res.status(403).json({
            error: "User is not authorized to perform this action"
        });
    }
    next();
};


exports.allUsers = (req, res) => {
    User.find((err, users) => {
        // handle error
        if (err) {
            return res.status(400).json({
                error: err
            });
        };
        res.json(users);
    })
    .select("name email tags updated created");
};


exports.getUser = (req, res) => {
    req.profile.hashed_password = undefined;
    req.profile.salt = undefined;
    
    return res.json(req.profile);
};


exports.updateUser = (req, res, next) => {
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
        // save user
        let user = req.profile;
        user = _.extend(user, fields);                      // (object-you-want-to-extend, what-you-want-to-apply)
                                                            //  extend() - mutate the source object
        // update date
        user.updated = Date.now();

        // populate user model
        if(files.photo)
        {
            user.photo.data = fs.readFileSync(files.photo.path);
            user.photo.contentType = files.photo.type;
        }
                                                        
        // save user
        user.save( (err, result) => {
            if (err){
                return res.status(400).json({
                    error: err
                });
            };
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        })
    })
}

exports.userPhoto = (req, res, next) => {
    if (req.profile.photo.data) {
        res.set("Content-Type", req.profile.photo.coden)
        return res.send(req.profile.photo.data);
    }
    next();
};

exports.deleteUser = (req, res, next) => {
    let user = req.profile;
    user.remove((err, user) => {                            // remove method already part of node

        // handle error
        if(err){
            return res.status(400).json({
                error: err
            });
        };
        // return deleted user
       
        res.json({message: "User deleted successfully"});

    });
};


// follow 
exports.addFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, {$push: {following: req.body.followId}}, (err, result) => {
        if (err)
        {
            return res.status(400).json({error: err})
        }
        next();
    })
}

exports.addFollower = (req, res, next) => {

    User.findByIdAndUpdate(req.body.followId, {$push: {followers: req.body.userId}}, {new: true} )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec( (err, result) => {
        if (err) {
            return res.status(400).json({error: err})
        }
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result)

    })
};


// unfollow
exports.removeFollowing = (req, res, next) => {
    User.findByIdAndUpdate(req.body.userId, {$pull: {following: req.body.unfollowId}}, (err, result) => {
        if (err)
        {
            return res.status(400).json({error: err})
        }
        next();
    })
}

exports.removeFollower = (req, res) => {

    User.findByIdAndUpdate(req.body.unfollowId, {$pull: {followers: req.body.userId}}, {new: true} )
    .populate('following', '_id name')
    .populate('followers', '_id name')
    .exec( (err, result) => {
        if (err) {
            return res.status(400).json({error: err})
        }
        result.hashed_password = undefined;
        result.salt = undefined;
        res.json(result)

    })
};

// recommendation system would have to be fitted in here
exports.findPeople = (req, res, next) => {
    console.log("FIND PEOPLE ENTERED");
    let following = req.profile.following;
    following.push(req.profile._id);
    
    console.log(typeof following[0]._id);
    console.log(typeof req.recommendedUsers[0]._id);
    let recommendedUsers = req.recommendedUsers;

    recommendedUsers.map((ruser, rindex) => {
        following.map((fuser, findex) => {
            if (JSON.stringify(ruser._id) === JSON.stringify(fuser._id))
            {
                recommendedUsers.splice(rindex);
            }
        })
    })

    console.log(recommendedUsers);

    return res.json(recommendedUsers);
    // next();
    
    // User.find({_id: {$nin: following}}, (err, users) => {
    //     if (err)
    //     {
    //         return res.status(400).json({error: err})
    //     }
    //     console.log(users);
    //     res.json(users);
    // }).select("_id name");
}


exports.cluster = (req, res, next) => {

    const tagNames = ["Environmental", "Social", "Educational", "Sport",  "Recreational",  "Music", "Political", "Festive"];
    let recommendedUsers = new Array();
    let correct_cluster = [];
    var flag = false;
    User.find((err, users) => {
        // handle error
        if (err) {
            return res.status(400).json({
                error: err
            });
        };
        const allUsers = users;
        //console.log(allUsers);
    })
    .select("_id name tags")
    .then( (allUsers) => {
        let vectors = new Array();
        for (let i = 0 ; i < allUsers.length ; i++) 
        {
            vectors[i] = allUsers[i]['tags'];
        }
        // for (let i = 0 ; i < allUsers.length ; i++) 
        // {
        //     console.log(i + ":  " + allUsers[i]['name']);
        // }
        console.log("Vectors array: ", vectors);
        console.log("\n\n");
        
        kmeans.clusterize(vectors, {k: 3}, (err,res) => 
        {
            if (err) 
            {
                console.error(err);
            }
            else
            {
                // console.log('%o',res);
                for ( index = 0; index < res.length; index++ )
                {
                    var cluster = res[index]; 
                    // console.log(cluster.clusterInd);
                    // console.log(allUsers[cluster.clusterInd[0]]['name']);

                    console.log("Cluster " + index + ":  ");

                    for (let j = 0; j < cluster.clusterInd.length; j++)
                    {
                        console.log("\t" + allUsers[cluster.clusterInd[j]]['name']);
                        const tags = allUsers[cluster.clusterInd[j]]['tags'];
                        tags.map((value, index) => {
                            if (value > 0.5)
                            {
                                console.log("\t\t" + tagNames[index]);
                            }
                        })
                    }
                    for (let j = 0; j < cluster.clusterInd.length; j++)
                    {
                        console.log(allUsers[cluster.clusterInd[j]]['_id'], req.profile._id);
                        console.log(typeof allUsers[cluster.clusterInd[j]]['_id'])
                        console.log(typeof req.profile._id);
                        if ( JSON.stringify(allUsers[cluster.clusterInd[j]]['_id']) === JSON.stringify(req.profile._id))
                        {
                            console.log("Correct Cluster is " + index + ": \n\t\t");
                            console.log(cluster.clusterInd);
                            correct_cluster = cluster.clusterInd;
                            flag = true;
                            break;
                        }
                    }
                    if (flag == true)
                    {
                        break;
                    }
                }
                for (let j = 0, k = 0; j < correct_cluster.length; j++)
                {
                    

                    if ( !(JSON.stringify(allUsers[cluster.clusterInd[j]]['_id']) === JSON.stringify(req.profile._id)))
                    {
                        recommendedUsers[k] =  { "_id": allUsers[correct_cluster[j]]['_id'], "name": (allUsers[correct_cluster[j]]['name']) };
                        k++;
                    }

                }
                console.log("Recommdended users: \n\t\t");
                console.log(recommendedUsers);

                req.recommendedUsers = recommendedUsers;
                next();
            }
        });
    })

}


exports.test = () =>
{
    const arr = 
    [
    { _id: '6050d39752aecf01e0f616be', name: 'Steven Frederick Gilbert' },
    { _id: '605306cb11fa7d40447ec601', name: 'Suryaa' },
    { _id: '60531d2511fa7d40447ec603', name: 'Karthik' },
    { _id: '606237a9007e202aa0f72f89', name: 'Angshuk' }
    ]

    const found = arr.find({'name': 'Suryaa'}, (err, users) => {
        if (err)
        {
                console.log(err);
        }
            else
            {
                console.log(users);
            }
        });
}









exports.updateTags = (req, res) => {

    //console.log(req.body.userTags);
    for(let index = 0; index < req.body.userTags.length; index++)
    { 
        req.body.userTags[index] = (req.body.userTags[index] > 1) ? 1: req.body.userTags[index];
        req.body.userTags[index] = (req.body.userTags[index] < 0) ? 0: req.body.userTags[index];
    }
    //console.log(req.body.userTags);

    User.findByIdAndUpdate(req.body.userId, {tags: req.body.userTags}, (err) => {
        if (err)
        {
            return res.status(400).json({error: err});
        }
        return res.status(200);
    })
    
}

exports.attend = (req, res) => {
    User.findByIdAndUpdate(req.body.userId, {$push: {attending: req.body.postId}}, {new: true})
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

exports.unattend = (req, res) => {
    User.findByIdAndUpdate(req.body.userId, {$pull: {attending: req.body.postId}}, {new: true})
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

exports.getPostAttend = (req, res) => {
    User.findById(req.profile._id)
    .populate('attending', '_id title body postedBy created photo tags')
    .exec((err, user) => {
        // error handling
        if (err || !user) {
            return res.status(400).json({
                error: "User not found"
            });
        };
        return res.json(user.attending);
    })
};