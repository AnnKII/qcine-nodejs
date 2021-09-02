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
                week,
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
                var lich = data2.data;
                var lichArr =[];
                var time = new Date();
                var n = time.getHours()*60 + time.getMinutes();
                for(var i=0; i<lich.length; i++){
                    var timeArr = lich[i].gio.toString().split(':');
                    var tempTime = parseInt(timeArr[0])*60 + parseInt(timeArr[1]);
                    if((tempTime<n)){
                        Object.assign(lich[i], {islate: "true"});
                    }
                    lichArr.push(lich[i]);
                }
                res.render('phimINFO',{
                    phim: data1.data,
                    lich: lichArr,
                    user: req.session.user,
                    week,
                })
            }))
            
    }
    showFuture(req, res){
        axios.get(serverAPI+'user/futurephim/')
            .then((respone)=>{
                res.render('home', {
                    phim : respone.data,
                    user: req.session.user,
                    week,
                })
            })
    }
}
module.exports = new PhimController();