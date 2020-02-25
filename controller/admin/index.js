const express = require('express');
const model = require('../../model/admin');

const router = express.Router();

router.post('/register',async (req,res,next) => {
    try{
    console.log("controller"+req.body.a_username);
       let results = await model.registerAdmin(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/login',async (req,res,next) => {
    try{
       let results = await model.loginAdmin(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.get('/viewAllSchedules',async (req,res,next) => {
    try{
       let results = await model.getAllSchedules();
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/view_All_Schedules_for_date',async (req,res,next) => {
    try{
       let results = await model.getAllSchedules_forDate(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/all_flights',async (req,res,next) => {
    try{
       let results = await model.getAllFlights();
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.get('/gateNumbers',async (req,res,next) => {
    try{
       let results = await model.getGateNumber(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/passenger_Detail_For_Schedule',async (req,res,next) => {
    try{
       let results = await model.getPassengerDetails(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/passengers_below_18_For_Schedule',async (req,res,next) => {
    try{
       let results = await model.getPassengerDetailsBelow18(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.get('/passengers_above_18_For_Schedule',async (req,res,next) => {
    try{
        console.log("controller AWA")
       let results = await model.getPassengerDetailsAbove18(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/getAllAirportCodes',async (req,res,next) => {
    try{
       let results = await model.getAllAirportCodes();
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/getPassengerCountFor_givenDestination',async (req,res,next) => {
    try{
       let results = await model.getPassenger_arrival_dateRange(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/getPassengerCount_of_classes',async (req,res,next) => {
    try{
       let results = await model.getPassenger_count_class(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/getPastFlightData',async (req,res,next) => {
    try{
       let results = await model.getPastFlightDetails(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/getTotRevenue_models',async (req,res,next) => {
    try{
       let results = await model.getTotRevenueModels();
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/getAllPlanes',async (req,res,next) => {
    try{       
       let results = await model.getAllPlanes();
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/insertSchedule',async (req,res,next) => {
    try{       
       let results = await model.insertNewSchedule(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/changeSchedule',async (req,res,next) => {
    try{      
        console.log(req.body); 
       let results = await model.changeSchedule(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});




module.exports = router;