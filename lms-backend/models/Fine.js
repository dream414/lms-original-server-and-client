const mongoose = require("mongoose");


const fineSchema = new mongoose.Schema(

{

student:{
type:mongoose.Schema.Types.ObjectId,
ref:"User",
required:true
},

issue:{
type:mongoose.Schema.Types.ObjectId,
ref:"IssueBook",
required:true
},

amount:{
type:Number,
default:0
},

daysLate:{
type:Number,
default:0
},

status:{
type:String,
enum:["Unpaid","Paid"],
default:"Unpaid"
},

paidDate:{
type:Date
}

},

{timestamps:true}

);





module.exports = mongoose.model("Fine", fineSchema);