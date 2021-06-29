const axios = require('axios');
// const { response } = require('express');
// const { render } = require('node-sass');
class PhimController{
    index(req, res){
        axios.get('http://localhost:8088/user/phim')
        .then((response)=>{
            
            res.render('home',{
                phim: response.data,
                user: req.session.user,
            });
        });

    }
    showPhim(req, res){
        var slug = req.params.slug;
        var phim;
        var lich;
        axios.all([
            axios.get(serverAPI+'user/phim/'+slug),
            axios.get(serverAPI+'user/lich/idphim/'+slug)
        ])
            .then(axios.spread((data1, data2)=>{
            //    console.log("Phim: " + data1.data.tenphim);
            console.log('Phim controller, access token: '+req.session.accessToken);
                if(req.session.accessToken!=null ){
                    res.render('phimINFO',{
                        phim: data1.data,
                        lich: data2.data,
                        user: req.session.user, 
    
                    })
                } else{
                    res.render('phimINFO',{
                        phim: data1.data,
                        lich: data2.data,
                        user: req.session.user,
                    })
                }
            }))
            
    }
    showFuture(req, res){
        axios.get(serverAPI+'user/futurephim/')
            .then((respone)=>{
                res.render('home', {
                    phim : respone.data,
                    user: req.session.user,
                })
            })
    }
}
module.exports = new PhimController();