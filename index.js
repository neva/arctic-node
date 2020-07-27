const router = require("express").Router();
const cookieParser = require("cookie-parser");
const axios = require("axios");

const serverAddress = "http://arcticxyz.ddns.net"

const getUser = async (userAuthToken, appToken) => {
    const response = await axios.post(serverAddress + "/app/user", {
        userAuthToken,
        appToken
    })
    return response.data;
}

module.exports = (appToken) => {
    
    router.use(cookieParser())
    
    router.use(async (req, res, next) => {
    
        const queryAuthToken = req.query.authToken;
        const cookieAuthToken = req.cookies.authToken;

        res.authenticate = (appID, callbackURL) => res.redirect(serverAddress + "/login?action=authenticate&app=" + appID + "&redirect=" + callbackURL)

        if(queryAuthToken == undefined && cookieAuthToken == undefined) {
            req.authenticated = false;
            next();
            return;
        }
        if(cookieAuthToken == undefined && queryAuthToken) {
            res.cookie("authToken", queryAuthToken);
        }
        if(queryAuthToken) {
            res.cookie("authToken", queryAuthToken);
            req.authToken = queryAuthToken;
        } else if(cookieAuthToken) {
            req.authToken = req.cookies.authToken;
        } else {
            req.authToken = null;
        }
    
        const data = await getUser(req.authToken, appToken);

        if(data.error != false) {
            req.error = true;
            next();
            return;
        }

        req.user = {
            email: data.data.email,
            name: data.data.name,
            authToken: req.authToken
        }
        req.authenticated = true
        next();
    
    })

    return router;
    
};