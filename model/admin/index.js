const pool=require('../../core/db_connection');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../config/env.config.json"), 'utf8'));
let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../core/response_format.json'), 'utf8'));

let admins= {};

admins.registerAdmin = (req) => {
    let a_username = req.body.a_username;
    let password = req.body.password;
    return new Promise((resolve,reject) => {
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,function(err,hash){
                const hashPwd=hash;
                console.log(hashPwd);
                let query = "insert into admin (a_username,password) values(?,?)"
                pool.query(query,[a_username,hashPwd],(err,results) => {
                    if(err){
                        console.log('error: ', err);
                        json_response['success'] = false;
                        json_response['message'] = 'error';
                        reject(err);
                        return reject(err);
                    }
                    json_response['success'] = true;
                    json_response['message'] = 'successfully registered';
                    resolve(json_response);
                    return resolve(results);
                });
            });
        });        
    });    
};

admins.loginAdmin = (req) => {
    let a_username = req.body.a_username;
    let password = req.body.password;
    return new Promise((resolve,reject) => {
        let query=`select * from admin where a_username='${a_username}'`;
        pool.query(query,(err,result) => {
            if(err || result.length == 0){
                console.log('error: ', err);
                json_response['success'] = false;
                json_response['message'] = err || "Admin not Found";
                json_response['token'] = '';
                reject(json_response);
                // pool.release();
                return reject(json_response);

            }else{
                bcrypt.compare(password,result[0]['password'],(err,res) =>{
                    if(err){
                        console.log('error: ', err);
                        json_response['success'] = false;
                        json_response['message'] = "Password Incorrect";
                        json_response['token'] = '';
                        return resolve(json_response);

                    }
                    if(res){
                        let a_id= result[0].a_id;
                        let token= jwt.sign({a_id:a_id, a_username:a_username},config.secret, config.options);
                        json_response['data'].push({ a_id: a_id,a_username:a_username })
                        json_response['success'] = true;
                        json_response['message'] = "Successfully Loggedin";
                        json_response['token'] = token;
                        // resolve(json_response);
                        // pool.release();
                        return resolve(json_response);
                    }else{
                        console.log(json_response);
                        json_response['success'] = false;
                        json_response['message'] = "Incorrect Password";
                        return resolve(json_response);

                    }
                });
            }
        });
               
    });
       
};

admins.getAllSchedules = () =>{
    return new Promise((resolve,reject) => {
        let query=`select plane_id,flight.departure,flight.arrival,date,departure_time,arrival_time,gate_no from schedule NATURAL join flight order BY date DESC`;
        let data={}
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err;
                return resolve(json_response);
            }else{
                console.log(results);
                json_response['success'] = true;
                json_response['message'] = "All the schedules";
                json_response['data']=[];
                for(let i=0;i < results.length ;i++ ){
                    data['plain_id']=results[i]['plain_id'];
                    data['departure']=results[i]['departure'];
                    data['arrival']=results[i]['arrival'];
                    data['date']=results[i]['date'];
                    data['departure_time']=results[i]['departure_time'];
                    data['arrival_time']=results[i]['arrival_time'];
                    data['gate_no']=results[i]['gate_no'];
                    json_response['data'].push(data);
                }
                
                return resolve(json_response);
                
            }

        });
    });

};

admins.getAllSchedules_forDate = (req) =>{
    let date=req.body.date;
    return new Promise((resolve,reject) => {
        let query=`select plane_id,flight.departure,flight.arrival,date,departure_time,arrival_time,gate_no from schedule NATURAL join flight where date='${date}' order BY date DESC`;
        let data={}
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err;
                return resolve(json_response);
            }else{
                console.log(results);
                json_response['success'] = true;
                json_response['message'] = "All the schedules";
                json_response['data']=[];
                for(let i=0;i < results.length ;i++ ){
                    data['plain_id']=results[i]['plain_id'];
                    data['departure']=results[i]['departure'];
                    data['arrival']=results[i]['arrival'];
                    data['date']=results[i]['date'];
                    data['departure_time']=results[i]['departure_time'];
                    data['arrival_time']=results[i]['arrival_time'];
                    data['gate_no']=results[i]['gate_no'];
                    json_response['data'].push(data);
                }
                
                return resolve(json_response);
                
            }

        });
    });

};

admins.getAllFlights = () =>{    
    return new Promise((resolve,reject) => {
        let query=`select departure,arrival from flight`;
        let data={}
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err;
                return resolve(json_response);
            }else{
                console.log(results);
                json_response['success'] = true;
                json_response['message'] = "All the Flights";
                json_response['data']=[];
                for(let i=0;i < results.length ;i++ ){
                    data['departure']=results[i]['departure'];
                    data['arrival']=results[i]['arrival'];
                    json_response['data'].push(data);
                }
                
                return resolve(json_response);
                
            }

        });
    });

};

admins.getGateNumber = (req) =>{   
    let airport_code=req.body.airport_code; 
    return new Promise((resolve,reject) => {
        let query=`select no_of_gate from airport where airport_code='${airport_code}' `;
        let data={}
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err;
                return resolve(json_response);
            }else{
                console.log(results);
                data['no_of_gate']=results[0]['no_of_gate'];
                json_response['success'] = true;
                json_response['message'] = "All the Flights";
                json_response['data'].push(data);   
                return resolve(json_response);                
            }
        });
    });

};

admins.getPassengerDetails = (req) =>{    
    let schedule_ID=req.body.schedule_ID;
    return new Promise((resolve,reject) => {
        let query=`select user_ID,passport_no,age,seat_number,class_name from reserve NATURAL JOIN passenger NATURAL JOIN seat NATURAL JOIN class where schedule_ID='${schedule_ID}'`;        
        json_response['data']=[];
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err || "Incorrect Schedule ID";
                return resolve(json_response);
            }else{
                console.log(results);
                json_response['success'] = true;
                json_response['message'] = "All the Passengers";                
                for(let i=0;i < results.length ;i++ ){
                    let data={}
                    data['user_ID']=results[i]['user_ID'];
                    data['passport_no']=results[i]['passport_no'];
                    data['age']=results[i]['age'];
                    data['seat_number']=results[i]['seat_number'];
                    data['class_name']=results[i]['class_name'];
                    console.log(i);
                    json_response['data'].push(data);
                }                
                return resolve(json_response);
                
            }

        });
    });

};

admins.getPassengerDetailsAbove18 = (req) =>{    
    let schedule_ID=req.body.schedule_ID;
    console.log("model AWA")
    return new Promise((resolve,reject) => {
        let query=`select user_ID,passport_no,age,seat_number,class_name from reserve NATURAL JOIN passenger NATURAL JOIN seat NATURAL JOIN class where schedule_ID='${schedule_ID}' AND age>=18`;        
        json_response['data']=[];
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err || "Incorrect Schedule ID";
                return resolve(json_response);
            }else{
                console.log("query eka wada");
                json_response['success'] = true;
                json_response['message'] = "All the Passengers above 18 for the schedule";                
                for(let i=0;i < results.length ;i++ ){
                    let data={}
                    data['user_ID']=results[i]['user_ID'];
                    data['passport_no']=results[i]['passport_no'];
                    data['age']=results[i]['age'];
                    data['seat_number']=results[i]['seat_number'];
                    data['class_name']=results[i]['class_name'];
                    console.log(i);
                    json_response['data'].push(data);
                }                
                return resolve(json_response);
                
            }

        });
    });

};

admins.getPassengerDetailsBelow18 = (req) =>{    
    let schedule_ID=req.body.schedule_ID;
    return new Promise((resolve,reject) => {
        let query=`select user_ID,passport_no,age,seat_number,class_name from reserve NATURAL JOIN passenger NATURAL JOIN seat NATURAL JOIN class where schedule_ID='${schedule_ID}' AND age<18`;        
        json_response['data']=[];
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err || "Incorrect Schedule ID";
                return resolve(json_response);
            }else{
                // console.log(results);
                json_response['success'] = true;
                json_response['message'] = "All the Passengers below 18 for the schedule";                
                for(let i=0;i < results.length ;i++ ){
                    let data={}
                    data['user_ID']=results[i]['user_ID'];
                    data['passport_no']=results[i]['passport_no'];
                    data['age']=results[i]['age'];
                    data['seat_number']=results[i]['seat_number'];
                    data['class_name']=results[i]['class_name'];
                    console.log(i);
                    json_response['data'].push(data);
                }                
                return resolve(json_response);
                
            }

        });
    });

};

admins.getAllAirportCodes = () =>{    
    return new Promise((resolve,reject) => {
        let query=`select airport_code,airport_name from airport`;        
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err;
                return resolve(json_response);
            }else{
                console.log(results);
                json_response['success'] = true;
                json_response['message'] = "All Airports";
                json_response['data']=[];
                for(let i=0;i < results.length ;i++ ){
                    let data={}
                    data['airport_code']=results[i]['airport_code'];
                    data['airport_name']=results[i]['airport_name'];
                    json_response['data'].push(data);
                }
                
                return resolve(json_response);
                
            }

        });
    });

};

admins.getPassenger_arrival_dateRange = (req) =>{   
    let destination=req.body.destination;
    let date1=req.body.date1; 
    let date2=req.body.date2; 
    return new Promise((resolve,reject) => {
        let query=`SELECT COUNT(passport_no) AS passenger_count from reserve,schedule,flight where schedule.schedule_ID=reserve.schedule_ID AND flight.flight_ID=schedule.flight_ID AND arrival='${destination}' AND schedule.date>='${date1}' AND schedule.date<='${date2}'`;
        let data={}
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err;
                return resolve(json_response);
            }else{
                console.log(results);
                data['passenger_count']=results[0]['passenger_count'];
                json_response['success'] = true;
                json_response['message'] = "All the Flights";
                json_response['data'].push(data);   
                return resolve(json_response);                
            }
        });
    });

};
admins.getPassenger_count_class = (req) =>{   
    let date1=req.body.date1; 
    let date2=req.body.date2; 
    return new Promise((resolve,reject) => {
        let query=`select COUNT(passport_no) as count,class_name from reserve,seat,class where reserve.seat_number=seat.seat_number AND seat.class_ID=class.class_ID AND date>='${date1}' AND date<='${date2}' GROUP BY class_name;`;
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err || "Incorrect Date range";
                return resolve(json_response);
            }else{
                // console.log(results);
                json_response['success'] = true;
                json_response['message'] = "Passenger Counts for each classes";  
                json_response['data']=[];              
                for(let i=0;i < results.length ;i++ ){
                    let data={}
                    data['class_name']=results[i]['class_name'];
                    data['count']=results[i]['count'];
                    json_response['data'].push(data);
                }                
                return resolve(json_response);
                
            }

        });
    });

};

admins.getPastFlightDetails = (req) =>{    
    let departure=req.body.departure;
    let destination=req.body.destination;
    return new Promise((resolve,reject) => {
        let query=`SELECT schedule.schedule_ID,schedule.date,schedule.plane_id,gate_no,departure_time,arrival_time, COUNT(passport_no) as count from reserve,schedule,flight where reserve.schedule_ID=schedule.schedule_ID AND flight.flight_ID=schedule.flight_ID AND departure='${departure}' AND arrival='${destination}' GROUP BY schedule.schedule_ID`;        
        json_response['data']=[];
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err || "Incorrect Schedule ID";
                return resolve(json_response);
            }else{
                // console.log(results);
                json_response['success'] = true;
                json_response['message'] = "All the Flight details on given origin and destination";                
                for(let i=0;i < results.length ;i++ ){
                    let data={}
                    data['schedule_ID']=results[i]['schedule_ID'];
                    data['date']=results[i]['date'];
                    data['plane_id']=results[i]['plane_id'];
                    data['gate_no']=results[i]['gate_no'];
                    data['departure_time']=results[i]['departure_time'];
                    data['arrival_time']=results[i]['arrival_time'];
                    data['count']=results[i]['count'];
                    json_response['data'].push(data);
                }                
                return resolve(json_response);
                
            }

        });
    });

};


admins.getTotRevenueModels = () =>{    
    return new Promise((resolve,reject) => {
        var datetime = new Date();
        let query=`SELECT model_ID,sum(price) as total from reserve,schedule,plane,seat where reserve.schedule_ID=schedule.schedule_ID AND schedule.plane_id=plane.plane_ID AND reserve.seat_number=seat.seat_number GROUP BY model_ID`;        
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err;
                return resolve(json_response);
            }else{
                console.log(results);
                json_response['success'] = true;
                json_response['message'] = "All Airplane Model Revenue";
                json_response['data']=[];
                for(let i=0;i < results.length ;i++ ){
                    let data={}
                    data['model_ID']=results[i]['model_ID'];
                    data['total']=results[i]['total'];
                    json_response['data'].push(data);
                }
                
                return resolve(json_response);
                
            }

        });
    });

};

admins.getAllPlanes = () =>{    
    return new Promise((resolve,reject) => {
        let query=`select plane_ID,name from plane`;        
        pool.query(query,(err,results) =>{
            if(err){
                 console.error("error: ", err);
                json_response['success'] = false;
                json_response['message'] = err;
                return resolve(json_response);
            }else{
                console.log(results);
                json_response['success'] = true;
                json_response['message'] = "All Airports";
                json_response['data']=[];
                for(let i=0;i < results.length ;i++ ){
                    let data={}
                    data['plane_ID']=results[i]['plane_ID'];
                    data['name']=results[i]['name'];
                    json_response['data'].push(data);
                }
                
                return resolve(json_response);
                
            }

        });
    });

};

admins.insertNewSchedule = (req) => {
    let plane_ID=req.body.plane_ID;
    let flight_ID=req.body.flight_ID;
    let date=req.body.date;
    let arrival_time=req.body.arrival_time;
    let departure_time = req.body.departure_time;
    let gate_no = req.body.gate_no;
    
    return new Promise((resolve,reject) => {        
        let query = "insert into schedule (plane_ID,flight_ID,date,arrival_time,departure_time,gate_no) values(?,?,?,?,?,?)"
        pool.query(query,[plane_ID,flight_ID,date,arrival_time,departure_time,gate_no],(err,results) => {
        if(err){
            console.log('error: ', err);
            json_response['success'] = false;
            json_response['message'] = err;
            // reject(err);
            return resolve(json_response);
        }else{
            json_response['success'] = true;
            json_response['message'] = 'New Schedule Inserted ';
            resolve(json_response);
            return resolve(results);
        }
        
        });
                
    });    
};

admins.changeSchedule = (req)=> {
    return promise = new Promise((resolve,reject)=>{
        let schedule_ID=req.body.schedule_ID;
        let date=req.body.date;
        let arrival_time=req.body.arrival_time;
        let departure_time=req.body.departure_time;
        let new_date=req.body.new_date;
        let new_arrival_time=req.body.new_arrival_time;
        let new_departure_time=req.body.new_departure_time;
        let reason=req.body.reason;
        
        let query = `call delay_handle('${schedule_ID}','${date}','${arrival_time}','${departure_time}','${new_date}','${new_arrival_time}','${new_departure_time}','${reason}')`;
        pool.query(query,(err,result)=>{
            if(err){
                console.log('an error occured: ',err);
                json_response['message']='Schedule update cancelled';
                json_response['success']=false;
                return resolve(json_response);
            } else{
                json_response['message']='Schedule updated';
                json_response['success']=true;
                return resolve(json_response);
            }
        })
    }).then(()=>{
        return json_response;
    }).catch(()=>{
        return json_response;
    });
};



module.exports = admins;