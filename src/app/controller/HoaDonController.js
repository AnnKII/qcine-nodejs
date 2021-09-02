const axios = require('axios');
const { response } = require('express');
// const { response } = require('express');
// const { render } = require('node-sass');

class HoaDonController{
    index(req,res){
        var token = req.session.accessToken;
        var result;
        axios.get(serverAPI+"user/hoadon",{headers:{
            "author": token,
        }})
            .then(response=>{
                if(response.status ==200){
                    for(var i=0; i< response.data.length; i++){
                        var temp = response.data[i].thanhtien;
                        temp = temp.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
                        response.data[i].thanhtien = temp;
                    }
                    res.render("hoadon",{
                        hoadon: response.data, 
                        user: req.session.user,
                    })
                } else{
                    res.render('404',{
                        user: req.session.user
                    });

                }
               
            })
            .catch(error=>{
                res.render('404',{
                    user: req.session.user
                });
            })
            
        
    }
    hoadonINFO(req, res){
        var mahd = req.params.slug;
        var phim;
        var lich;
        var hoadon;
        axios.get(serverAPI+"user/hoadon/"+mahd)
            .then(response=>{
                hoadon = response.data;
                hoadon.thanhtien = hoadon.thanhtien.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
                axios.get(serverAPI+'user/lich/'+hoadon.malich)
                    .then(response=>{
                        lich = response.data;
                        axios.get(serverAPI+"user/phim/"+ lich.maphim)
                            .then(response=>{
                                phim = response.data;
                                axios.get(serverAPI+"user/cthoadon/hoadon/"+mahd)
                                    .then(response=>{
                                        var listCT = response.data;
                                        for( var i=0; i< listCT.length; i++){
                                            Object.assign(listCT[i], {number: i+1});
                                            listCT[i].gia = listCT[i].gia.toLocaleString('it-IT', {style : 'currency', currency : 'VND'});
                                        }
                                        res.render("hoadonINFO",{
                                            phim,
                                            lich,
                                            hoadon,
                                            cthoadon: listCT,
                                            user: req.session.user,
                                        });
                                    })
                                    .catch(error=>{
                                        console.log(error);
                                        res.render('404',{
                                        user : req.session.user,
                                        });
                                    });
                            })
                            .catch(error=>{
                                console.log(error);
                                res.render('404',{
                                user : req.session.user,
                                });
                            })
                    })
                    .catch(error=>{
                        console.log(error);
                        res.render('404',{
                            user : req.session.user,
                        })
                    })
            })
            .catch(error=>{
                console.log(error);
                res.render('404',{
                    user : req.session.user,
                })
            })
    }
    
    
}
module.exports = new HoaDonController();