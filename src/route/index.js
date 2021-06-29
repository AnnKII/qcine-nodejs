const phimRouter = require('./phim');
const lichRouter = require('./lich');
const phimController = require('../app/controller/PhimController');
const axios = require('axios');
function route(app){
    app.use('/lich', lichRouter)
    app.use('/phim', phimRouter);
    app.get('/', phimController.index);
    app.get('/login',(req,res)=>{
        res.render('login', {layout: 'main2'});
    });
    app.get('/futurePhim', phimController.showFuture);
    app.post('/login', (req, res)=>{
        var username = req.body.username;
        var password = req.body.password;
        axios.all([
            axios.put(serverAPI+'login',{
                username: req.body.username,
                password: req.body.password
            }),
            axios.post(serverAPI+'user/profile',{
                username: req.body.username
            }),
        ])
            .then(axios.spread((accessToken, khach)=>{
                // console.log('Access token: '+accessToken.data);
                // console.log('Khach: '+ khach);
                req.session.authenticated = true,
                // req.session.user = {
                //     username: khach.username,
                //     ten: khach.ten,
                // },
                req.session.accessToken = accessToken.data;
                req.session.user = khach.data;
               // console.log("Session's user: "+ khach.data.ten);
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
}
module.exports = route;