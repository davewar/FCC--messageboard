const mongoose = require('mongoose');
require('dotenv').config();


const conn = process.env.MONGO_URI;

const connection = mongoose.createConnection(conn,{
  useNewUrlParser: true,       // surpress warning messages
    useUnifiedTopology: true       // surpress warning messages
})
//
const ReplySchema = new mongoose.Schema({
          // id: {type: String, trim:true},
          text: {type: String, trim:true},
          createdon: {type: String, trim:true},
          deletedon: {type: String, trim:true},
          reported: {type: Boolean, trim:true},
          // comments: {type: String, trim:true},
         
})

const BlogSchema = new mongoose.Schema({
          board: {type: String, trim:true},
          createdon: {type: String, trim:true},
          bumpedon: {type: String, trim:true},
          deletedon: {type: String, trim:true},
          reported: {type: Boolean, trim:true},
          text: {type: String, trim:true},
          replies: [ReplySchema],
          pw: {type: String, trim:true},
          replycount:{type: Number, trim:true}
})



//
const Blog = connection.model('Blog', BlogSchema);
const Reply = connection.model('Reply', ReplySchema);

module.exports = connection;