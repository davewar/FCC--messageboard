/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');

chai.use(chaiHttp);
let id;
let replyId;
suite('Functional Tests', function() {

  suite('API ROUTING FOR /api/threads/:board', function() {
    
    

    suite('POST', function() {
      test('1 post', function(done){

           chai.request(server)
          .post('/api/threads/test')
          .send({
            board: 'test',
            text: 'abc',
            delete_password: '1'
          })
          .end((err,res)=>{            
            ///
          //  console.log("DW REDIRECT ", res.redirects[0])            
            assert.equal(res.status, 200);
            assert.include(res.redirects[0], "/b/test");
            
            done();
//
          })



      })
      
    });
    
    suite('GET', function() {
          test('2 get', function(done){

           chai.request(server)
          .get('/api/threads/test')
          .end((err,res)=>{ 
            // console.log(res.body)  
            assert.property(res.body[0], '_id');         
            assert.property(res.body[0], 'text');
            assert.property(res.body[0], 'createdon');
            assert.property(res.body[0], 'bumpedon');
            assert.property(res.body[0], 'replies');
            assert.property(res.body[0], 'replycount');
            // console.log("FFFF", res.body[0]._id)
            id = res.body[0]._id   //
            done();

          })



      })

 
    });
    
    suite('DELETE', function() {
         test('3 delete', function(done){

           chai.request(server)
          .delete('/api/threads/test')
          .send({
            board: 'test',
            thread_id: id,
            delete_password: '2'
          })
          .end((err,res)=>{ 
            assert.equal(res.status, 200);
          assert.include(res.text, 'incorrect password');


            done();

          })



      })
      
    });
    
        suite('PUT', function() {

                  test('4 put', function(done){

              chai.request(server)
              .put('/api/threads/test')
              .send({
                board: 'test',
                thread_id: id           
              })
              .end((err,res)=>{ 
                assert.equal(res.status, 200);
              assert.equal(res.body, 'success')


                done();

              })
          
          });
        

        });


  })
  
  suite('API ROUTING FOR /api/replies/:board', function() {
    
    suite('POST', function() {
          test('5 post', function(done){

           chai.request(server)
          .post('/api/replies/test')
          .send({
            board: 'test',
            thread_id: id,
            text: 'reply2',
            delete_password: '1'
          })
          .end((err,res)=>{            
            ////
                       
            assert.equal(res.status, 200);
            assert.include(res.redirects[0], "/b/test/" + id);
       
            // replyId = res.body.replies[0]._id;
           
		
            
            done();
//
          })



      })
      
    });
    
    suite('GET', function() {
                 test('6 get', function(done){

           chai.request(server)
          .get('/api/replies/test/')
          .query({
             thread_id: "5fa93768d326af0c7c6a2253"
          })
          .end((err,res)=>{ 
            let data = res.body.replies
            // console.log("FU", data)
            assert.property(data[0], 'text');
            assert.property(data[0], 'createdon'); 
            assert.property(data[0], 'deletedon'); 
            assert.property(data[0], 'reported');        
             replyId = data[0]._id;
            
               //
            done();

          })



      })



//







      
    });
    
    suite('PUT', function() {
                test('7 put', function(done){

           chai.request(server)
          .put('/api/replies/test')
          .send({
            board: 'test',
            thread_id: "5fa93768d326af0c7c6a2253",
            reply_id: "5fa9376bd326af0c7c6a2254"
            
          })
          .end((err,res)=>{            
            let data2 = res.body
                    console.log("data2", data2)   
            assert.equal(res.body, 'success');
            done();
///
          })



      })




      
    });
    
    suite('DELETE', function() {
                  
              test(' 8 delete', function(done){

           chai.request(server)
          .delete('/api/replies/test')
          .send({
            board: 'test',
            thread_id: id,
            reply_id: replyId,
           delete_password: '1'
          })
          .end((err,res)=>{ 
              let data1 = res.body
                    // console.log("data1", data1)   
            // assert.equal(res.status, 200);
           assert.equal(res.body, 'success');
            
            done();
//
          })


      
    });
    
    });

  })

});
