"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
let app = express();
const PORT = 5000;
// middleware
app.use(function (req, res, next) {
    console.log('middleware called');
    next();
});
app.listen(PORT, () => {
    console.log('Server is running at port: ', PORT);
});
app.get('/login', (req, res, next) => {
    // const data = [{firstName:"Prafful", lastName:"Sinha"}]
    const data1 = [{ firstName: "Prafful", lastName: "Sinha" }];
    req.user = data1;
    next();
    //res.send('success');
    // res.send(data);
    // res.status(404).send('success');
    /* res.json({
         firstName:"Prafful",
         lastName:"Sinha"
     })*/
}, (req, res, next) => {
    res.send(req.user);
    console.log('called another middleware');
});
