require('dotenv').config()
const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    res.set('Access-Control-Allow-Origin','*')
    if(!req.query.key){
        res.render('index.ejs', {})
    }else{
        if (/[0-9a-z]{8}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{4}-[0-9a-z]{12}/.test(req.query.key)){
            res.render('started.ejs', {})
        } else{
            res.redirect('/')
        }
    }
})

app.get('/github', async (req, res) => {
    res.statusCode = 301;
    res.setHeader("Location", process.env.GITHUB);
    res.end();
});

app.listen(parseInt(process.env.PORT), () => console.log('[+] Server started on port  ' + process.env.PORT))