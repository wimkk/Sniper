require('dotenv').config()
const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const fs = require("fs")

app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    theme='Default'
    if(req.cookies.theme){
        if(fs.existsSync('public/css/'+theme)){
            theme=req.cookies.theme
        }
    }
    if (!req.query.key) {
        res.render('index.ejs', {
            theme:theme,
            type:'index',
            version:process.env.VERSION
        })
    } else if(/[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(req.query.key)){
        res.cookie('key',req.query.key, { maxAge: 900000, httpOnly: true });
        res.render('started.ejs', {
            theme:theme,
            type:'started',
            version:process.env.VERSION
        })
    }else{
        res.redirect('/')
    }
    
})

app.get('/github', async (req, res) => {
    res.statusCode = 301;
    res.setHeader("Location", process.env.GITHUB);
    res.end();
});

app.listen(parseInt(process.env.PORT), () => console.log('[+] Server started on port  ' + process.env.PORT))