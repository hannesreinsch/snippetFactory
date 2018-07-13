//requiring mongoose and mongoose schema so we can use it in the file
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//schema for the model
const snippetSchema = new mongoose.Schema({  
  code: {
    type: String,
    required: true
  },
  heading: {
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
  _comments: [{ 
    type: Schema.Types.ObjectId,
    ref: "Comment" ,
    default: []
  }],
});


//set timestamps for the snippet schema
snippetSchema.set("timestamps", true);


//create Snippet model with snippetSchema
const Snippet = mongoose.model('Snippet', snippetSchema);


//export the model so we can use it in other files
module.exports = Snippet;