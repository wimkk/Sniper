require('dotenv').config()

const express = require('express');
const app = express();

app.use(express.static(__dirname + '/public'));

app.get('/', async (req, res) => {
    res.sendFile(__dirname + '/public/html/index.html');

})


app.get('/github', async (req, res) => {
    res.statusCode = 301;
    res.setHeader("Location", process.env.GITHUB);
    res.end();
});



app.listen(parseInt(process.env.PORT), () => console.log('[+] Server started on port  ' + process.env.PORT))