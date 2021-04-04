const mongoose = require("mongoose");
const {ObjectId} = mongoose.Schema;

const postSchema = new mongoose.Schema({
    title:  {
        type: String,
        required: true
    },
    body:   {
        type: String,
        required: true
    },
    photo: {
        data: Buffer,            // Buffer - binary data. Used because Photo may be large. Therefore, until it is fully recieved, it is stored in this buffer   
                                // stored in binary format in database
        contentType: String 
    },
    venue: {
        type: String,
        required: true
    },
    dateAndTime: {
        type: String,
        required: true
    },
    tags: {
        type: Array,
        required: true
    },
    // building relationship
    postedBy: { 
        type: ObjectId,         // from mongoose.Schema
        ref: "User"             // User Model
    },
    created: {
        type: Date,
        default: Date.now
    },
    updated: Date,                // store date of update
    likes: [{type: ObjectId, ref: "User"}],
    notInterested: [{type: ObjectId, ref: "User"}],
    comments: [
        {
            text: String,
            created: { type: Date, default: Date.now},
            postedBy: { type: ObjectId, ref: "User"}
        }
    ]


});


module.exports = mongoose.model("Post", postSchema);