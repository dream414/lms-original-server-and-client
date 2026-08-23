const mongoose = require("mongoose");



const issueSchema = new mongoose.Schema(
    
    {
        
        student:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        },

book:{
type:mongoose.Schema.Types.ObjectId,
ref:"Book",
required:true
},

request:{
type:mongoose.Schema.Types.ObjectId,
ref:"BookRequest"
},

issueDate:{
type:Date,
required:true
},

dueDate:{
type:Date,
required:true
},

status:{
type:String,
enum:["Issued","Returned"],
default:"Issued"
}

},

{timestamps:true}

);

module.exports = mongoose.model("IssueBook", issueSchema);
