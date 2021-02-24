//Set up and require express
const express = require('express');
const app = express();

//require npm packages and applications
//bodyparser parsing incoming request bodies in a in a middleware before you handle it
const bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const fs = require('fs')
//The fs module is responsible for all the asynchronous or synchronous file I/O operations

const port = 8080;

//set up empty variables
let Cache = {};
let fileArr;
let i;


//================================//
// Setting up functions

// finding files within a directory

// fs. readdir() method is used to asynchronously read the contents of a given directory.
// The callback of this method returns an array of all the file names in the directory.
const readDir = (path) => {
    return new Promise((resolve, reject) => {
        fs.readdir(path, (error, files) => {
            fileArr = files;
            console.log("fileArr", fileArr)
            resolve(fileArr)
        });
    });
};

// updating the cache and list of items from the directory
const updateCache = () => {
    readDir('./uploaded').then((fileArr) => {
        for (i = 0; i < fileArr.length; i++) {
            Cache[i] = fileArr[i]
        };
        console.log(Cache);
    });
};

// function that given the name of the file, return that file
function getCache(fileName) {
    readDir('./uploaded').then((fileArr) => {

        let array = []
        for (i = 0; i < fileArr.length; i++) {
            if (fileArr[i].fileName === fileName) {
             array.push(fileArr[i])
            }
            return array
        };
    });
}
getCache("dropbox-outline.pdf")
// updateCache();

// An additional helper function that will allow you to add the files in uploaded into the cache on page load.

//================================//
// set up middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(fileUpload());
app.use('/assets', express.static(__dirname + '/assets'));
app.use(express.static('files'));

// making req to root to send index back to user
// fs. createReadStream() allows you to open up a readable stream in a very simple manner.
//All you have to do is pass the path of the file to start streaming in.
//It turns out that the response (as well as the request) objects are streams.
app.get('/', (req, res) => {
    fs.createReadStream(__dirname + '/index.html').pipe(res);
    console.log("index pg works")
});

// make a get req to root, so we can get a list of cached objects
app.get('filesdir', (req, res) => {
    res.send(Cache);
});

// route to handle the form that posts the file to our server
app.post('/upload', (req, res) => {
    console.log("trying to upload")
    if (req.files) {
        let file = req.files.foo;
        console.log(file)
        let filename = file.name;
        console.log("hi", filename)

        file.mv(__dirname + '/uploaded/' + filename, (error) => {
            if (error) {
                console.log(error);
                res.end()
            } else {
                // updateCache();
                console.log('works?')
                Cache[filename] = file
                console.log(Cache)

                let currentFiles  = getCache()

                res.send(currentFiles)

                res.redirect('/')

                console.log('upload successful')
            };
        });
    };
});

app.get('/download', (req, res)=>{
    res.send('I am just a string?!')
})

// create a div that renders all my files
// form that could
// downloading
app.get('/download/:name', (req, res) => {
    console.log("download")
    console.log(Cache)
    console.log(req.params.name)
    res.send(Cache[req.params.name].data)
});

// listening port
app.listen(port, () => {
    console.log(`Application listening at ${port}`)
});