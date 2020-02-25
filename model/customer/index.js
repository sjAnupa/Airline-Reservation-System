const pool=require('../../core/db_connection');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt= require('jsonwebtoken');
const config = JSON.parse(fs.readFileSync(path.resolve(__dirname, "../../config/env.config.json"), 'utf8'));
let json_response = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../core/response_format.json'), 'utf8'));
let users= {};

users.register = (req) => {
    let discount_ID=req.body.discount_ID;
    let first_name=req.body.first_name;
    let last_name=req.body.last_name;
    let address=req.body.address;
    let email = req.body.email;
    let password = req.body.password;
    
    return new Promise((resolve,reject) => {
        bcrypt.genSalt(10,function(err,salt){
            bcrypt.hash(password,salt,function(err,hash){
                const hashPwd=hash;
                console.log(hashPwd);
                let query = "insert into user (discount_ID,first_name,last_name,address,email,password) values(?,?,?,?,?)"
                pool.query(query,[discount_ID,first_name,last_name,address,email,hashPwd],(err,results) => {
                    if(err){
                        console.log('error: ', err);
                        json_response['success'] = false;
                        json_response['message'] = err;
                        // reject(err);
                        return resolve(json_response);
                    }
                    json_response['success'] = true;
                    json_response['message'] = 'successfully registered';
                    resolve(json_response);
                    return resolve(results);
                });
            });
        });        
    }).catch((e)=>{
        json_response['success'] = false;
        json_response['message'] = e;
        return json_response;
    });    
};

users.login = (req) => {
    let email = req.body.email;
    let password = req.body.password;
    return new Promise((resolve,reject) => {
        let query=`select * from user where email='${email}'`;
        pool.query(query,(err,result) => {
            if(err || result.length == 0){
                console.log('error: ', err);
                json_response['success'] = false;
                json_response['message'] = err || "Admin not Found";
                json_response['token'] = '';
                // reject(json_response);
                return resolve(json_response);

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
                        let user_id= result[0].user_ID;
                        let token= jwt.sign({user_id:user_id},config.secret, config.options);
                        json_response['data'].push({ user_id:user_id })
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

users.searchFlight = (req)=>{
    return promise = new Promise((resolve,reject)=>{
        let departureCode = req.body.departureAirport;
        let arrivalCode = req.body.arrivalAirport;
        let departureDate = req.body.departureDate;
        let passengersCount = req.body.passengers;
        let requiredClass = req.body.requiredClass;
        let status=0;
        json_response['data']=[];
        let query=`CALL searchFlight(?,?,?,?,?)`;
        pool.query(query,[requiredClass,status,departureCode,arrivalCode,departureDate],(err,results) =>{
            if(err || results[0].length==0){
                console.log('error: ', err);
                json_response['success'] = false;
                json_response['message'] = err || "No flights";
                return resolve(json_response);
            }else{
                json_response['success'] = true;
                json_response['message'] = "All the available schedules";
                console.log(results[0]);
                
                for(let i=0;i<results[0].length;i++){
                    let data={}
                    let p=0;
                    if(results[0][i]['count'] >= passengersCount){                 
                        p=1
                        data['available_seats']=results[0][i]['count'];
                        data['plane_ID']=results[0][i]['plane_ID'];
                        data['schedule_ID']=results[0][i]['schedule_ID'];
                        data['departure']=results[0][i]['departure'];
                        data['arrival']=results[0][i]['arrival'];
                        data['departure_time']=results[0][i]['departure_time'];
                        data['arrival_time']=results[0][i]['arrival_time'];
                        data['price']=results[0][i]['price'];
                        json_response['data'].push(data);
                    }
                    if(p==0){
                        json_response['success'] = false;
                        json_response['message'] = "No Available flights";                
                    }                    
                }
                return resolve(json_response);
            }            
        });
    });
};

users.flightDetails = (req) => {
    return promise = new Promise((resolve,reject)=>{
        let schedule_ID=req.body.schedule_ID;
        let query=`SELECT plane_ID,date, departure_time,arrival_time from schedule where schedule_ID='${schedule_ID}'`;
        pool.query(query,(err,results)=>{
            if(err){
                json_response['success'] = false;
                json_response['message'] = err || "Input correct Schedule ID";
                return resolve(json_response);
            }else{
                let data={}
                json_response['success'] = true;
                json_response['message'] = "Departure and Arrival times with plane ID";
                json_response['data']=[];
                data["plane_ID"]=results[0]['plane_ID'];
                data["departure_time"]=results[0]['departure_time'];
                data["arrival_time"]=results[0]['arrival_time'];
                json_response['data'].push(data);
                return resolve(json_response);
            }

        });
        
    });
};

users.available_seats = (req) => {
    return promise = new Promise((resolve,reject)=>{
        json_response['data']=[];
        let schedule_ID = req.body.schedule_ID;
        let class_ID = req.body.class_ID;
        let sql = `SELECT seat_number FROM seat,schedule WHERE schedule.plane_ID=seat.plane_ID AND status=0 AND class_ID='${class_ID}' AND schedule_ID='${schedule_ID}' `;
        pool.query(sql,(err,result)=>{
            if(err){
                json_response['success'] = false;
                json_response['message'] = err || "NO available Seats";
                return resolve(json_response);
            }
            else{
                console.log(result[0]['seat_number']);
                var i;
                for(i=0;i<result.length;i++){
                    json_response['data'].push(result[i]['seat_number']);
                    console.log(json_response);
                }
                console.log(json_response);
                return resolve(json_response);
            };
        });
    });
    
};

users.getAllAirports = (req)=> {
    return promise = new Promise((resolve,reject)=>{
        let sqlGetAirports = `SELECT airport_ID,airport_code,airport_name FROM airport`;
        pool.query(sqlGetAirports,(err,result)=>{
            if(err){
                json_response['success'] = false;
                json_response['message'] = err || "NO available Airports";
                return resolve(json_response);
            } else {
                console.log(result);
                 for(i=0;i<result.length;i++){
                     let temp=[]
                     temp.push(result[i]['airport_ID']);
                     temp.push(result[i]['airport_code']);
                     temp.push(result[i]['airport_name']);
                     json_response['data'].push(temp);
                 }
                resolve(result);
            }
        })
    }).then(()=>{
        json_response['success']= true;
        return json_response;
    }).catch(()=>{
        json_response['success']= false;
        return json_response;

    })
};

users.changeSeat = (req) =>{
    return promise = new Promise((resolve,reject)=>{
        let sqlSendSeats = `SELECT seat_number FROM seat WHERE plane_ID='${req.body.plane_ID}' AND class_ID='${req.body.class_ID}' AND status=0`;
        pool.query(sqlSendSeats,(err,result)=>{
            if(err){
                json_response['success'] = false;
                json_response['message'] = err || "NO available seats";
                return resolve(err);
            } else {
                console.log('result',result);
                 for(i=0;i<result.length;i++){
                     json_response['data'].push(result[i]['seat_number']);
                 }
                 return resolve(json_response);
            }
        })
    }).then(()=>{
        json_response['success']=true;
        return json_response;
    }).catch(()=>{
        json_response['success']=false;
        return json_response;
    })
}

users.removeReservation = (req)=> {
    return promise = new Promise((resolve,reject)=>{
        let sqlResDelete = `DELETE FROM reserve WHERE reserve_ID='${req.body.reserve_ID}'`;
        pool.query(sqlResDelete,(err,result)=>{
            if(err){
                console.log('an error occured: ',err);
                json_response['message']='cannot delete the reservation as an error has been occured';
                json_response['success']=false;
                return resolve(json_response);
            } else{
                json_response['message']='reservation deleted successfully';
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


users.makeReservation = (req)=>{
    return promise = new Promise((resolve,reject)=>{
        let user_ID=req.body.user_ID;
        let schedule_ID=req.body.schedule_ID;

        for(i=0;i<req.body.passengerArr.length;i++){
            let first_name = req.body.passengerArr[i]['first_name'];
            let last_name = req.body.passengerArr[i]['last_name'];
            let passport_no = req.body.passengerArr[i]['passport_no'];
            let age = req.body.passengerArr[i]['age'];
            let seat_number = req.body.passengerArr[i]['seat_number'];

            let query = `call make_reservation('${user_ID}','${first_name}','${last_name}','${passport_no}','${age}','${seat_number}','${schedule_ID}');`;
            pool.query(query,(err,result)=>{
                if(err){
                    console.log('an error occured: ',err);
                    json_response['message']= err || 'Duplicate key Error';
                    json_response['success']=false;
                    return resolve(json_response);
                } else{
                    json_response['message']='Reservation Created successfully.';
                    json_response['success']=true;
                    return resolve(json_response);
                }
            })

        }

        
        
    }).then(()=>{
        return json_response;
    }).catch(()=>{
        return json_response;
    });
}

users.changeSeat = (req)=> {
    return promise = new Promise((resolve,reject)=>{
        let reserve_ID=req.body.reserve_ID;
        let seat_number=req.body.seat_number;
        let newSeat_number=req.body.newSeat;
        let query = `call change_seat('${reserve_ID}','${seat_number}','${newSeat_number}')`;
        pool.query(query,(err,result)=>{
            if(err){
                console.log('an error occured: ',err);
                json_response['message']='Find another seat';
                json_response['success']=false;
                return resolve(json_response);
            } else{
                json_response['message']='seat changed';
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

module.exports = users;