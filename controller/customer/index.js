const express = require('express');
const model = require('../../model/customer');

const router = express.Router();


router.post('/register',async (req,res,next) => {
    try{
        console.log(req.body.first_name);
       let results = await model.register(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/login',async (req,res,next) => {
    try{
       let results = await model.login(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});



router.post('/search_flight',verifyToken,async (req,res,next) => {
    try{
    
       let results = await model.searchFlight(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.post('/flight_details',verifyToken,async (req,res,next) => {
    try{
    
       let results = await model.flightDetails(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
// #######################
router.post('/make_reservation',verifyToken,async (req,res,next) => {
    try{
       let results = await model.makeReservation(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/changeSeat',verifyToken,async (req,res,next) => {
    try{
       let results = await model.makeReservation(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//##########################
router.post('/availableSeats',verifyToken,async (req,res,next) => {
    try{
       let results = await model.available_seats(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.post('/receiveAirport',verifyToken,async (req,res,next) => {
    try{
       let results = await model.getAllAirports(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/changeSeat',verifyToken,async (req,res,next) => {
    try{
       let results = await model.changeSeat(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.post('/removeReservation',verifyToken,async (req,res,next) => {
    try{
       let results = await model.loginAdmin(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.post('/customereditBook',verifyToken,async (req,res,next) => {
    try{
       let results = await model.loginAdmin(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});





router.get('/',async (req,res,next) => {
    try{
       let results = await model.all();
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.get('/:id',async (req,res,next) => {
    try{
       let results = await model.one(req.params.id);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});


//verify token
function verifyToken(req,res,next){
    
    // console.log(req.body.headers['Authorization']);
    const bearerHeader = req.headers['authorization']; 
    // console.log(req.headers);
    // console.log("veee")
    // const bearerHeader = req.body.headers['Authorization'];
    // console.log("variable :"+bearerHeader);
    if(typeof bearerHeader!=='undefined'){
        console.log('inside if');
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        console.log('inside else');
        res.sendStatus(403);
    }
}
module.exports = router;