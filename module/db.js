//DB库
const { compile } = require('art-template');
var MongoDB = require('mongodb');
const { ObjectID } = require('_bson@4.6.0@bson');
var MongoClient =MongoDB.MongoClient;
var MongoID =MongoDB.ObjectId;
var Config=require('./config.js');

class Db{

    static getInstance(){ //单例  多次实例化实例不共享的问题
        if (!Db.instance) {
            Db.instance=new Db();
        }
        return Db.instance;
    }

    constructor(){
        this.dbClient="";  //属性  放db对象
        this.connect(); //初始化的连接数据库
    }

    connect(){
        //连接数据库 

    return new Promise((resolve,reject)=>{

    if (!this.dbClient) {   //解决多次连接数据库的问题

        MongoClient.connect(Config.dbUrl,(err,client)=>{
            if (err) {
                reject(err)
            }else{
                var db = client.db(Config.dbName);
                this.dbClient = db;
                resolve(this.dbClient)
            }
        })
    }else{
        resolve(this.dbClient);
    }

       
    })
        
    }
 //项目签到查询数据
 findgroup(collectionName,json3,json4){
    return new Promise((resolve,reject)=>{
        this.connect().then((db)=>{
            var result = db.collection(collectionName).aggregate([
            
                {$group:{_id:json3,xname:{$first:json4}}},
          
            ]);
            
            result.toArray(function(err,docs){
                if (err) {
                    reject(err);
                    return;
                }
                resolve(docs);
            })
        })
    })
}
    //项目签到统计查询数据
    find(collectionName,json,json1,json2,json3,json4,json5,json6){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                var result = db.collection(collectionName).aggregate([
                    {$match:json},
                    {$group:{_id:json3,xname:{$first:json4},sum:{$sum:1},sumz:{$sum:json5},sumb:{$sum:json6}}},
                    {$skip:json1},
                    {$limit:json2},
                   
                ]);
                
                result.toArray(function(err,docs){
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })
            })
        })
    }

        //在项目签到查询总数据（查询）
        findyes(collectionName,json){
            return new Promise((resolve,reject)=>{
                this.connect().then((db)=>{
                    var result = db.collection(collectionName).find(json);
                    
                    result.toArray(function(err,docs){
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(docs);
                    })
                })
            })
        }
    
          //在项目签到查询总数据（查询/分页）
        findcount(collectionName,json,json1,json2,json3){
            return new Promise((resolve,reject)=>{
                this.connect().then((db)=>{
                    var result = db.collection(collectionName).aggregate([
                   
                        {$match:json},
                        {$sort:json1},
                        {$skip:json2},
                        {$limit:json3},

                    ]);
                    
                    result.toArray(function(err,docs){
                        if (err) {
                            reject(err);
                            return;
                        }
                        resolve(docs);
                    })
                })
            })
        }

            //统计数目
        count(collectionName,json,json1){
                return new Promise((resolve,reject)=>{
                    this.connect().then((db)=>{
                        var result = db.collection(collectionName).aggregate([
                       
                            {$match:json},
                         
                            {$group:{_id:json1,count:{$sum:1}}},
                        
                        ]);
                        
                        result.toArray(function(err,docs){
                            if (err) {
                                reject(err);
                                return;
                            }
                           
                            resolve(docs);
                        })
                    })
                })
            }
    

    //判断点方法
  IsPtInPoly(aLat, aLon, pointList) {
        /* 
        :param aLon: double 经度 
        :param aLat: double 纬度 
        :param pointList: list [{latitude: 22.22, longitude: 113.113}...] 多边形点的顺序需根据顺时针或逆时针，不能乱 
        */
        var iSum = 0  
        var iCount = pointList.length
        var bool = 0
        if(iCount < 3) {
            return false 
        }
        //  待判断的点(x, y) 为已知值
        var x = aLon
        var y = aLat
        for(var i = 0; i < iCount; i++) {
            var y1 = pointList[i].latitude  
            var x1 = pointList[i].longitude
           
            if(i == iCount - 1) {
                var y2 = pointList[0].latitude
                var x2 = pointList[0].longitude
             
            } else {
                var y2 = pointList[i + 1].latitude  
                var x2 = pointList[i + 1].longitude

            }
             
            if (x >= x1 || x >= x2) {
                if ((y == y1 && x == x1) || (y == y2 && x == x2 )) {
                    bool = 2;
                    return bool;

                }else{
                   

                        var px = parseFloat(x1 + (y - y1)/(y2 - y1)*(x2 - x1));
                        // console.log(px);
                        if (px ==  x) {
                            
                            bool =3;
                        }

                        if (px < x) {
                            
                            iSum += 1 ;
                        }
                  
                }
            }

             // 当前边的 2 个端点分别为 已知值(x1, y1), (x2, y2)
    //   if (((y >= y1) && (y <= y2)) || ((y >= y2) && (y <= y1))) {

     
    //     //  y 界于 y1 和 y2 之间
    //     //  假设过待判断点(x, y)的水平直线和当前边的交点为(x_intersect, y_intersect)，有y_intersect = y
    //     // 则有（2个相似三角形，公用顶角，宽/宽 = 高/高）：|x1 - x2| / |x1 - x_intersect| = |y1 - y2| / |y1 - y|
    //     if (Math.abs(y1 - y2) >= 0) {
       
    //         var x_intersect = parseFloat(x1 - ((x1 - x2) * (y1 - y)) / (y1 - y2)) ;  
           
    //         if(x_intersect <= x) {
               
    //             iSum += 1 
                
    //         }
    //     }
    // } 
}
if(iSum % 2 != 0) {
    bool =1;  
}
return bool;

}

       //项目位置查询数据
    findPotint(collectionName,json,json2){
        return new Promise((resolve,reject)=>{
            this.connect().then((db)=>{
                var result = db.collection(collectionName).aggregate([
                    
                    {$match:json},
                    {$project:json2},
                ]);
                
                result.toArray(function(err,docs){
                    if (err) {
                        reject(err);
                        return;
                    }
                    resolve(docs);
                })
            })
        })
    }

  
    
//增加数据
   insert(collectionName,json){
    return new Promise((resolve,reject)=>{
        this.connect().then((db)=>{

            db.collection(collectionName).insertOne(json,function(err,result){
                if (err) {

                    reject(err);
                    
                }else{

                    resolve(result);
                }
            })
        })
    })
}


// 更新数据

  update(collectionName,json1,json2){
    return new Promise((resolve,reject)=>{
        this.connect().then((db)=>{
            db.collection(collectionName).updateOne(json1,{
                $set:json2
            },(err,result)=>{
                if (err) {

                    reject(err);
                    
                }else{

                    resolve(result);
                }
            })
        })
    })
  }

//   //删除数据

//   remove(collectionName,json){
//     return new Promise((resolve,reject)=>{
//         this.connect().then((db)=>{

//             db.collection(collectionName).deleteOne(json,function(err,result){
//                 if (err) {

//                     reject(err);
                    
//                 }else{

//                     resolve(result);
//                 }
//             })
//         })
//     })
// }


getObjectId(id){

    return new ObjectID(id);
}

}

module.exports=Db.getInstance();