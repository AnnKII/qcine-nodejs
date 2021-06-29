const axios = require('axios');
const { response } = require('express');

class LichController{
    
    booking(req, res){
        var slug = req.params.slug;
        var lichINFO;
        axios.get(serverAPI+'user/lich/'+slug)
            .then((response)=>{
                lichINFO = response.data;
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
                                    cot: phongINFO.socot,
                                    hang: phongINFO.sohang,
                                    ghe: gheArr,
                                })
                                
                            })
                            .catch((error)=>{
                                console.log('ERROR while fetching cthoadon: '+error);
                            })
                            
                    })
                    .catch((error)=>{
                        console.log("ERROR: "+ error);
                    })
                    
            })
            .catch((error)=>{
                console.log("ERROR: "+ error);
            })
    }
}
module.exports = new LichController();