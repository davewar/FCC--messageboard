/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

require('dotenv').config();
const connection = require('../config/database.js');
const mongoose = require('mongoose');

const Blog = connection.models.Blog;
const Reply = connection.models.Reply;

let bcrypt     = require('bcrypt')
let saltRounds = 12;




var expect = require('chai').expect;
//
module.exports = function (app) {
  
  // app.route('/api/threads/:board')

	
   app.post('/api/threads/:board', function(req, res){

    const blogBox = req.body.board
    const textBox = req.body.text
    const pw = req.body.delete_password

    const newPW = bcrypt.hashSync(pw, saltRounds) 
    let dte = new Date().toUTCString()


    let newBlog = new Blog({
          board: blogBox,
          createdon: dte,
          bumpedon: dte,
          reported: false,
          text: textBox,
          replies: [],
          pw: newPW

     
    })

    if(!blogBox || !textBox || !pw) {
        // return res.send('missing required inputs');
      } else 
        
          newBlog.save()
          .then((data)=>{

            
             return  res.redirect("/b/" + data.board)
          }).catch((err)=>{
                console.log("dw err", err.message);
                return res.status(404).json("dw err...." + err.message);
          });
        
    



  });    // <<< end of get
//

  app.put('/api/threads/:board', function (req,res){
            // console.log("here...")
             const thread_id = req.body.thread_id

            const update = { reported: true }     

        Blog.findByIdAndUpdate(thread_id, update, function(err,data){
                   

        if(err){
            //console.log("dw err", err.message);
              if (err instanceof mongoose.CastError){
                    return res.json("No record found for " + thread_id);
              } else {
                  return res.json("dw err...." + err.message);
              }
            
        } else{

            //  console.log("data",data)   
                return res.json("success")

        }

             

       })



  });  


//

 app.delete('/api/threads/:board', function (req,res){
          console.log("dw started..")
      const blogBox = req.body.board
      const thread_id = req.body.thread_id
        const pw = req.body.delete_password
        const newPW = bcrypt.hashSync(pw, saltRounds) 

//////

        Blog.findById(thread_id, function(err,data){

          if(err){
    
              if (err instanceof mongoose.CastError){
                 console.log("dw here 1..")
                    return res.json("could not Find record " + thread_id);
              } else {
                  return res.send("dw err...." + err.message);
              }
                        
           }

          if(data){
                        // console.log("DW a record exists")

                        // console.log("DW PW", newPW)
                        //         console.log("DW DB PW", data.pw)

                const result = bcrypt.compareSync(pw, data.pw)
                // console.log(result)



                      
                        // pw incorrect
                        if(!result){
                                //  console.log("DW eheheheh")
                                return res.json('incorrect password');

                        } else{
                              // delete record
                              Blog.findByIdAndRemove(thread_id, function(err,data){
                              if(err){ return console.log("dw err here...")}

                              return res.json('Success')


                              })  

                        }

          }


        })

          

});    /// end of delete thread



        app.post('/api/replies/:board', function(req, res){

                  const blogBox = req.body.board;
                  const thread_id = req.body.thread_id;
                  const textBox = req.body.text;
                  const pw = req.body.delete_password;

                  const newPW = bcrypt.hashSync(pw, saltRounds) ;
                  let dte = new Date().toString();

                  let newReply = new Reply({
                        id: thread_id,
                        board: blogBox,
                        text: textBox,      
                        createdon: dte,
                        deletedon: "",
                        replies:[],
                        reported: false  
                  })

                    // 
                    Blog.findById(thread_id, function(err,data){

                        if(err){
                  
                            if (err instanceof mongoose.CastError){
                              // console.log("dw here 1..")
                                  return res.json("could not Find record " + thread_id);
                            } else {
                                return res.json("dw err...." + err.message);
                            }
                                      
                        } else{

                                    const result = bcrypt.compareSync(pw, data.pw)

                                    if(!result){
                                      res.json("incorrect password'")
                                    } else {

                                          // add reply to Blog
                                          let dte = new Date().toUTCString()

                                         Blog.findByIdAndUpdate(thread_id, {$push: {replies: [newReply], bumbedon: dte}}, {new:true}, function(err,dataReply){

                                         
                                                if(err){
                                                  console.log("dwERR", err.message)
                                                  return res.json("DW err found")
                                                }

                                                // console.log("DW here ", dataReply)    
                                              //  return res.json('sucess dw')   
                                             return  res.redirect("/b/" + dataReply.board  + "/" + dataReply._id)
                                             
                                              

                                            });                                 
                                    
                                    }
             
                        }

                })     
 
      }) // end of post//

      app.put('/api/replies/:board', function (req,res){
            // console.log("here...")
             const thread_id = req.body.thread_id
             const reply_id = req.body.reply_id


        Blog.findById(thread_id, function(err,data){
                   

        if(err){
            //console.log("dw err", err.message);
              if (err instanceof mongoose.CastError){
                    return res.json("No record found for... " + thread_id);
              } else {
                  return res.json("dw err...." + err.message);
              }
            
        } else{

              // console.log("DW PUT", data)
              // console.log("DW PUT", data.reply[0].reported)
              // console.log("DW PUT", data.reply[0]._id)

              let recordFound = false;

              for(let i=0; i < data.replies.length; i++){
                     console.log("DW PUT", data.replies[i].reported)
                      console.log("DW PUT", data.replies[i]._id)
                      if(data.replies[i]._id == reply_id){                       
                                data.replies[i].reported = true
                              recordFound = true                         
                            break
                      }
                        

              }

              if(recordFound){
                           

                    data.save((err,data)=>{
                      if (err){return res.json('DW ERR' + err.message)}
                    //  return  res.redirect("/b/" + data.board + "/" + data.id )
                     return    res.json('success')
                     			

                    })

                 
             } else{
                    return  res.json('No record found for HERE ' + reply_id)
              } 
                    

        }

             

       })



  });   //end of put


  app.delete('/api/replies/:board', function (req,res){
          console.log("dw started..")

         const thread_id = req.body.thread_id
             const reply_id = req.body.reply_id

        const pw = req.body.delete_password
        const newPW = bcrypt.hashSync(pw, saltRounds) 

////////

        Blog.findById(thread_id, function(err,data){

          if(err){
    
              if (err instanceof mongoose.CastError){
                 console.log("dw here 1..")
                    return res.json("could not Find record " + thread_id);
              } else {
                  return res.send("dw err...." + err.message);
              }
                        
           }

          if(data){
                    
                    
                 const result = bcrypt.compareSync(pw, data.pw)
                // console.log(result)

                      
                        // pw incorrect
                        if(!result){
                                //  console.log("DW eheheheh")
                                return res.json('incorrect password');

                        } else{

                     let recordFound = false;
                      let dte = new Date().toUTCString();

                      for(let i=0; i < data.replies.length; i++){

                              // console.log("DW PUT", data.reply[i].reported)
                              // console.log("DW PUT", data.reply[i]._id)
                              if(data.replies[i]._id == reply_id){  

                                        data.replies[i].text = 'Deleted'
                                        data.replies[i].deletedon = dte
                                        recordFound = true                         
                                    break
                              }                    

                       }

                                  if(recordFound){
                                    
                                  // delete reply
                                  data.save((err,data)=>{
                                if (err){return res.json('DW ERR' + err.message)}
                                return    res.json('success')

                                })                

                          
                              } else{
                                      return  res.json('No record found for HERE ' + reply_id)
                                } 


                        }

          }


        })

          

    });    /// end of delete thread

 // get requests

 app.get('/api/threads/:board', (req, res) => {
   //       /api/threads/q
             console.log("I AM HERE")
              // Person.find({
              //             occupation: /host/,
              //             'name.last': 'Ghost',
         
              //           exec(callback);

              Blog.find({board: req.params.board})
                .sort({bumpedon_: 'desc'})
			          .limit(10)
			          .select('-pw -reported')
                .exec(function (err, data){
                  if(err){ return console.log("DW.ERR", err.message)}
                      
                      //  console.log("hehre", data)           
                       
                      data.forEach(item =>{
                            // console.log("reply counts", item.replies.length)
                                item.replycount = item.replies.length

                                if(item['replycount'] == "undefined"){
                                      item['replycount']  = 0
                                }
                              
                            // loop the reply and get in order
                              item.replies.sort((a,b)=>{
                                    return new Date(b.createdon)  - new Date(a.createdon)

                              })

                              item.replies = item.replies.slice(0,3)  

                      })

                    // console.log(data)

                    return res.json(data)


              })   
              
                  
                //  res.end("finished")
              })




// 

app.get('/api/replies/:board', (req, res) => {
 

              //   console.log("HERE", req.params)
              // // const board =  req.params  
              // console.log("HERE",req.query) 
               Blog.find({ _id: req.query.thread_id})
                 .select('-pw -reported')
                .exec(function (err, data){
                  if(err){ return res.json("No record found")}
                      
                      data.forEach(item =>{
                            // loop the reply and get in order
                              item.replies.sort((a,b)=>{
                                    return new Date(b.createdon)  - new Date(a.createdon)

                              })

                      })
                     
                     
                    //  console.log("HERE>>", data)
                        // return  res.redirect("/b/" + data.board + "/" + data._id )
                     return res.json(data[0])
                     
                   
                     


              })   

  })  /// end///


                 


       





}  /// <<< end of main app



