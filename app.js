const express = require('express');
const app = express();


app.get('/', (req, res)=>{
    res.send('Server for HTML page')
})

app.listen(8080)