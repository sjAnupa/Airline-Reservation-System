const express=require('express');
const app= express();
const bodyParser=require('body-parser');
const routes = require('./routes');
const path = require('path');

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', '*');
    res.setHeader("Access-Control-Allow-Credentials", true);
    next();
});
app.use('/public', express.static(path.resolve(__dirname, './public')));

app.use(bodyParser.json());

routes(app);

app.listen(process.env.PORT || 5000, () => {
    console.log(`Server is logged on port ${process.env.PORT || '5000'}`);
});

