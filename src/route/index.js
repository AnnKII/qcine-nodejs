const phimRouter = require('./phim');
const lichRouter = require('./lich');
const hoadonRouter = require('./hoadon');
const phimController = require('../app/controller/PhimController');
const axios = require('axios');
const { response } = require('express');
const { render } = require('node-sass');
function route(app){
    app.use('/lich', lichRouter)
    app.use('/phim', phimRouter);
    app.use('/hoadon', hoadonRouter);
    app.get('/', phimController.index);
    app.get('/login',(req,res)=>{
        res.render('login', {layout: 'main2'});
    });
    app.get('/futurePhim', phimController.showFuture);
    app.post('/login', (req, res)=>{
        var username = req.body.username;
        var password = req.body.password;
        axios.all([
            axios.put(serverAPI+'userLogin',{
                username: req.body.username,
                password: req.body.password
            }),
            axios.post(serverAPI+'user/profile',{
                username: req.body.username
            }),
        ])
            .then(axios.spread((accessToken, khach)=>{
                req.session.authenticated = true,
                req.session.accessToken = accessToken.data;
                req.session.user = khach.data;
                res.redirect('/');
            }))
            .catch((error)=>{
                console.log("ERROR: "+ error);
                res.render('login', {
                    layout: 'main2',
                    abc: error});
            })
    });
    app.get('/logout',(req,res)=>{
        req.session.destroy();
        res.redirect('/');
    })
    app.post('/checkout',(req, res)=>{
        var rawData = req.body.toString();
        var list = rawData.split(',');
        var listSeat =[];
        var malich = req.headers.malich;
        var token = req.session.accessToken;
        var result;
        for(var i=0; i< list.length; i++){
            var temp = list[i].split("X");
            listSeat.push({
                hang: temp[0],
                cot: temp[1],
            });
            console.log("Seat: "+ listSeat[i].hang+" X "+listSeat[i].cot);
        }
        axios.post(serverAPI+"user/hoadon",listSeat,{
            headers:{
                "author":token,
                "malich": malich, 
            }
        })
            .then(response=>{
                result="Thành công"
            })    
            .catch (error=>{
                result="Thất bại"
            })

        res.send(result);
    })
    app.get('/signup', (req, res)=>{
        res.render('signup');
    })
    app.post('/signup', (req, res)=>{
        // console.log("Username: "+req.body.username);
        // console.log("Password: "+req.body.password)
        // console.log("Ho: "+req.body.ho);
        // console.log("Ten: "+req.body.ten);
        // console.log("Ngay sinh: "+req.body.ngaysinh);
        
        // console.log("Dia chi: "+req.body.diachi);
        var user ={
            username: req.body.username,
            password: req.body.password,
            diachi: req.body.diachi,
            ho: req.body.ho,
            ten: req.body.ten,
            ngaysinh: req.body.ngaysinh, 
        };
        axios.post(serverAPI+'/user/create', user)
            .then(response=>{
                if(response.status ==200){
                    res.redirect('/');

                }
                else{
                    switch (response.status){
                        case 208:{
                            res.render('signup',{
                                error:"Email has been used",
                            })
                            break
                        }
                        case 406:{
                            res.render('signup',{
                                error: 'Missing field',
                            })
                            break;
                        }
                        case 400:{
                            res.render('signup',{
                                error: 'Exteral Failure',
                            })
                            break;
                        }
                    }
                }
            })
            .catch(error=>{
                console.log(error);
                res.render('signup');
            })
    })
    app.use((req, res, next)=>{
        res.render('404',{
            user: req.session.user,
        })
    })
}
module.exports = route;