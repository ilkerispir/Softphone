const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true })); 
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(expressLayouts);
app.use(cookieParser());

app.get('/login', (req, res) =>{ 
    let url = "https://smartkontak.musterihizmetleri.com/api/?function=ping&session=" + req.cookies.aloTechSession;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.success){
            res.redirect('softphone');
        }else{
            var message = "";
            res.render('login', {message: message});
        }
    });
});

app.post('/login', (req, res) => {
    let inputEmail = req.body.inputEmail;
    let inputPassword = req.body.inputPassword;

    let url = "https://smartkontak.musterihizmetleri.com/api/?function=login&email="+ inputEmail +"&password="+ inputPassword;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.login){
            res.cookie('aloTechMail', req.body.inputEmail);
            res.cookie('aloTechSession', json.session);
            res.redirect('softphone');
        }else{
            var message = "Kullancı adı veya Şifre Hatalı";
            res.render('login', {message:message});
        }
    });
});

app.get('/softphone', (req, res) => {   
    let url = "https://smartkontak.musterihizmetleri.com/api/?function=ping&session=" + req.cookies.aloTechSession;
    let settings = { method: "Get" };

    fetch(url, settings)
    .then(res => res.json())
    .then((json) => {
        if(json.success){           
            res.render('softphone');   
        }else{
            res.redirect('login');
        }
    });
});

const server = app.listen(process.env.PORT || 3000, () => {
    const host = server.address().address;
    const port = server.address().port;
});

