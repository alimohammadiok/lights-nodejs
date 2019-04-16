var app = require('express')();
var http = require('http').createServer(app);
const axios = require('axios')
var io = require('socket.io')(http);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');
  }); 

io.on('connection', function(socket){
   
  var lightlar = null;
  axios.get('http://localhost:3005/api/lights/')  
  .then((res) => {
    //console.log(`statusCode: ${res.statusCode}`)
    //console.log(res)
    lightlar = res.data
    io.emit('light', lightlar);
    
  })
  .catch((error) => {
    console.error(error)
  })

    socket.on('light',function(light){
      var light = {id:light.id, state:light.state}
      axios.post('http://localhost:3005/api/lights/'+light.id+'/replace', {
        state:light.state
      })
      .then((res) => {
        console.log(`statusCode: ${res.statusCode}`)
        //console.log(res)
        //console.log(res.data.id)
      })
      .catch((error) => {
        console.error(error)
      })
        
       //ends here
      console.log(light);
     
     
    })

    
  });
  

http.listen(3000, function(){
  console.log('listening on *:3000');
});