//requiring mongoose and mongoose schema so we can use it in the file
const mongoose = require("mongoose");
const Schema = mongoose.Schema;



//schema for the model
const commentSchema = new mongoose.Schema({  
  text: {
    type: String,
    required: true
  },
  numberOfLikes: {
    type: Number,   
  },
  _owner: { 
    type: Schema.Types.ObjectId,
    ref: "User" 
  },
  // _snippet: { 
  //   type: Schema.Types.ObjectId,
  //   ref: "Snippet" 
  // },
});

//set timestamps for the comment schema
commentSchema.set("timestamps", true);


//create comment model with comment schema
const Comment = mongoose.model('Comment', commentSchema);


//export the model so we can use it in other files
module.exports = Comment;