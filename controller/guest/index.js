const express = require('express');
const model = require('../../model/customer');

const router = express.Router();


// router.post('/register',async (req,res,next) => {
//     try{
//         console.log(req.body.first_name);
//        let results = await model.register(req);
//        res.json(results); 
//     }catch(e){
//         console.log(e);
//         res.sendStatus(500);
//     }
// });

// router.post('/login',async (req,res,next) => {
//     try{
//        let results = await model.login(req);
//        res.json(results); 
//     }catch(e){
//         console.log(e);
//         res.sendStatus(500);
//     }
// });



router.post('/search_flight',async (req,res,next) => {
    try{
    
       let results = await model.searchFlight(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.post('/flight_details',async (req,res,next) => {
    try{
    
       let results = await model.flightDetails(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
// #######################
router.post('/addPassengers',async (req,res,next) => {
    try{
       let results = await model.loginAdmin(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//##########################
router.post('/availableSeats',async (req,res,next) => {
    try{
       let results = await model.available_seats(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.post('/receiveAirport',async (req,res,next) => {
    try{
       let results = await model.getAllAirports(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.post('/changeSeat',async (req,res,next) => {
    try{
       let results = await model.changeSeat(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.post('/removeReservation',async (req,res,next) => {
    try{
       let results = await model.loginAdmin(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.post('/customereditBook',async (req,res,next) => {
    try{
       let results = await model.loginAdmin(req);
       res.json(results); 
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});





// router.get('/',async (req,res,next) => {
//     try{
//        let results = await model.all();
//        res.json(results); 
//     }catch(e){
//         console.log(e);
//         res.sendStatus(500);
//     }
// });
// router.get('/:id',async (req,res,next) => {
//     try{
//        let results = await model.one(req.params.id);
//        res.json(results); 
//     }catch(e){
//         console.log(e);
//         res.sendStatus(500);
//     }
// });



module.exports = router;