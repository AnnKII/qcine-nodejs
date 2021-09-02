const axios = require('axios');
class LichController{
    
    booking(req, res){
        if(req.session.authenticated){
            console.log('Acces token: '+ req.session.accessToken);
            var slug = req.params.slug;
        var lichINFO;
        axios.get(serverAPI+'user/lich/'+slug)
            .then((response)=>{
                lichINFO = response.data;
                var phim;
                axios.get(serverAPI+'user/phim/+'+lichINFO.maphim)
                    .then((response)=>{
                        phim = response.data;
                    })
                    .catch(error=>{
                        console.log("Error occure! "+ error);
                    })
                var phongINFO;
                axios.get(serverAPI+'user/phong/'+ lichINFO.maphong)
                    .then((response)=>{
                        phongINFO = response.data;
                        axios.get(serverAPI+'user/cthoadon/lich/'+lichINFO.malich)
                            .then((response)=>{ 
                                var gheArr =[];
                                for(var i=0; i<response.data.length; i++){
                                    gheArr[i] = response.data[i].hang+'X'+ response.data[i].cot;
                                }
                                res.render('booking',{
                                    lich: lichINFO,
                                    malich: lichINFO.malich,
                                    cot: phongINFO.socot,
                                    hang: phongINFO.sohang,
                                    ghe: gheArr,
                                    user: req.session.user,
                                    week,
                                    phim,
                                })
                                
                            })
                            .catch((error)=>{
                                res.render('404',{
                                    user: req.session.user
                                });
                            })
                            
                    })
                    .catch((error)=>{
                        res.render('404',{
                            user: req.session.user
                        });
                    })
                    
            })
            .catch((error)=>{
                res.render('404',{
                    user: req.session.user
                });
            })
        } else{
            res.redirect('/login');
        } 
        
    }
    currentLich(req, res){
       var listPhim;
       axios.get(serverAPI+'/user/phim')
        .then((response)=>{
            listPhim = response.data;
            var listLich;
            axios.get(serverAPI+'/user/lich')
                .then((response)=>{
                    listLich = response.data;
                    var time = new Date();
                    var n = time.getHours()*60 + time.getMinutes();
                    for (var i=0; i<listPhim.length; i++){
                        var tempArr =[];
                        for (var j=0; j<listLich.length; j++){
                            if (listLich[j].maphim == listPhim[i].idphim){
                                var timeArr = listLich[j].gio.toString().split(':');
                                var tempTime = parseInt(timeArr[0])*60 + parseInt(timeArr[1]);
                                if((tempTime<n)){
                                    Object.assign(listLich[j], {islate: "true"});
                                }
                                tempArr.push(listLich[j]);
                            }
                        }
                        if (!(tempArr.length===0)){
                            Object.assign(listPhim[i], {lich: tempArr});
                        }
                    }
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
                    var yyyy = today.getFullYear();

                    today = yyyy + '-' + mm + '-' + dd;
                    if (today == listLich[0].ngay)
                        today = 'Hôm Nay ('+listLich[0].ngay+')';
                    else today = listLich[0].ngay
                    res.render('lich',{
                        listPhim,
                        date: today,
                        week,
                        user: req.session.user,
                    })
                })
                .catch(error=>{
                    res.render('lich',{
                        listPhim,
                        date: "Hôm nay",
                        week,
                        user: req.session.user,
                    })
                })
        })
        .catch(error=>{
            res.render('lich',{
                listPhim,
                week,
            }
            );
        })
    }
    lichByDate(req,res){
        var listPhim;
        var slug = req.params.slug;
       axios.get(serverAPI+'/user/phim')
        .then((response)=>{
            listPhim = response.data;
            var listLich;
            axios.post(serverAPI+'/user/lich/ngay',{
                "ngay": slug,
            })
                .then((response)=>{
                    listLich = response.data;
                    var time = new Date();
                    var n = time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
                    
                    for (var i=0; i<listPhim.length; i++){
                        var tempArr =[];
                        for (var j=0; j<listLich.length; j++){
                            if (listLich[j].maphim == listPhim[i].idphim){
                                
                                tempArr.push(listLich[j]);
                            }
                        }
                        if (!(tempArr.length===0)){
                            Object.assign(listPhim[i], {lich: tempArr});
                        }
                    }
                    res.render('lich',{
                        listPhim,
                        date: listLich[0].ngay,
                        week,
                        user: req.session.user,
                    })
                })
                .catch(error=>{
                    res.render('lich',{
                        listPhim,
                        date: slug,
                        week,
                        user: req.session.user,
                    })
                })
        })
        .catch(error=>{
            res.render('lich');
        })

    }

   
}
module.exports = new LichController();