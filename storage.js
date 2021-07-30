const express = require('express');
const fs = require('fs');
const hbs = require('hbs');
const { v4: uuidv4 } = require("uuid");
const en = require("dotenv").config();
var app = express();
app.use(express.urlencoded());
app.use(express.json());
app.set("view engine", "hbs");
app.set('views', "./public/views");
hbs.registerPartials("./public/views/partials")
app.use(express.static("./public"));
var port = process.env.Port || 8000;
app.get("/", (req, res) => {
    res.render("home", { error: "" })
})
app.post("/makeurl", (req, res) => {




    if (req.body.password == process.env.password && req.body.userid == process.env.userid) {
        fs.readFile("./storage/links.txt", "utf-8", (err, data) => {
            if (err) {
                console.log('err');

            }
            else {
                data = JSON.parse(data);
                req.body.password = undefined;
                req.body.userid = undefined;
                req.body.viewers = [];
                req.body.goto = `/${uuidv4()}`
                data.push(req.body)
                fs.writeFile("./storage/links.txt", JSON.stringify(data), () => {
                    console.log('ok');
                    res.send(`${req.body.goto}`);
                })
            }
        })
    }

    else
        res.end("ERROR")
})

app.post("/gotodata", (req, res) => {
    var objsend;
    
    if (req.body.password == process.env.password && req.body.userid == process.env.userid)
        objsend = { status: true, userid: req.body.userid, password: req.body.password, name: "Ramji Nishad", data:` {"name": "ashu" , "class": "jk"}` }
    else {
        objsend = { status: false }
        res.render("home", { error: "invailed login detail." });
    }

    res.render("student", objsend);
})
app.post("/gotofile", (req, res) => {

    if (req.body.name && req.body.school && req.body.key) {
        var obj2 = { student: req.body.name, school: req.body.school, date: new Date().getDate() + "/" + (new Date().getMonth() + 1) + '/' + new Date().getFullYear(), time: new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds() };
    //    console.log(obj);
    //    res.end("if you ther its a ERROR");
        // res.send()
        fs.readFile("./storage/links.txt", "utf-8", (err, data) => {
            if (err) {
                console.log('err');

            }
            else {
                data = JSON.parse(data);
                req.body.time = new Date().getTime();
                for (let index = 0; index < data.length; index++) {
                    let element = data[index];
                    if (element.goto == req.body.key) {
                        data[index].viewers.push(obj2)

                     fs.writeFile("./storage/links.txt" , JSON.stringify(data) , (err)=>{

                     })
                        res.redirect(element.urloffile)

                    }
                }

            } 
        })
    }
})
app.get("*", (req, res) => {
    fs.readFile("./storage/links.txt", "utf-8", (err, data) => {
        data = JSON.parse(data);
        for (let index = 0; index < data.length; index++) {
            let element = data[index];
            if (element.goto == req.url) {
                res.render("show", element);
            }
        }
    })
})
app.listen(port, (err) => {
    console.log('http://localhost:' + port);

})