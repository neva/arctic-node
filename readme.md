# Arctic

## What is Arctic?
Arctic is a new authentication service that aims to be practical and first of all easy to use.

## Notices
If you catch any errors feel free to write a mail `paul.hanneforth.o@gmail.com` or create an issue on GitHub.

## Implementation
To implement Arctic Authentication, simply install `arctic-node`
```sh
npm install arctic-node
```
Now you can drop arctic-node into any express application using `app.use("/", arcticNode(appToken))`.
Once the user has been logged in, the user information will be stored in `req.user`. If you want to log your user in, simply call `res.authenticate(your-appID, callback)`, where `your-appID` should be replaced with your appID and `callback` with the URL the user should be redirected to when he's logged in.
### Example
```js
// import express and arcticNode
const express = require("express");
const arcticNode = require("arctic-node");

const app = express();
const port = 4000;

const appID = "[your-appID]"
const appToken = "[your-app-token]"

app.use("/", arcticNode(appToken))

app.get("/login", (req, res) => {
    // authenticate user and then redirect the user to /
    res.authenticate(appID, "http://localhost:4000/")
}
app.get("/", (req, res) => {

    // check if user is already authenticated
    if(!req.authenticated) {
        // if not than authenticate the user
        res.authenticate(appID, "http://localhost:4000/")
    }
    // if the user is authenticated then you're ready to access the user information
    res.send("Hello! " + req.user.name + " " + req.user.email);

})

app.listen(port, () => {
    console.log("Server started!")
})
```
