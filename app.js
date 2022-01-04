const express=require('express');
const mathjs=require('mathjs');
const fs = require('fs');

const ExpressError = require("./expressError")

//initialization
const app=express()

//parsing data
app.use(express.json());


//homepage route
app.get('/',(req,res)=>{
    res.send('Homepage!!!')
})

//mean route
app.get('/mean',(req,res,next)=>{
    try {
        const {numbers}=req.query
        if (numbers===undefined || req.query['numbers']==='') throw new ExpressError("Numbers are required!", 404);

        const queryArray=numbers.split(',')

        let checkIsNumber=queryArray.filter(el=>isNaN(el))
        
        if (checkIsNumber.length!==0) throw new ExpressError(`Not a number: ${checkIsNumber}`, 404);
        
        else{
            const numbersArray=numbers.split(',').map((number)=>parseFloat(number))
            const response={operation:'mean',value:mathjs.mean(numbersArray)}
            return res.json({response})
        }
      } catch (err) {
        return next(err);
      }
})

//median route

app.get('/median',(req,res,next)=>{
    try {
        const {numbers}=req.query
        if (numbers===undefined || req.query['numbers']==='') throw new ExpressError("Numbers are required!", 404);

        const queryArray=numbers.split(',')

        let checkIsNumber=queryArray.filter(el=>isNaN(el))
        
        if (checkIsNumber.length!==0) throw new ExpressError(`Not a number: ${checkIsNumber}`, 404);
        
        else{
            const numbersArray=numbers.split(',').map((number)=>parseFloat(number))
            const response={operation:'median',value:mathjs.median(numbersArray)}
            return res.json({response})
        }
      } catch (err) {
        return next(err);
      }
})

//mode route

app.get('/mode',(req,res,next)=>{
    try {
        const {numbers}=req.query
        if (numbers===undefined || req.query['numbers']==='') throw new ExpressError("Numbers are required!", 404);

        const queryArray=numbers.split(',')

        let checkIsNumber=queryArray.filter(el=>isNaN(el))
        
        if (checkIsNumber.length!==0) throw new ExpressError(`Not a number: ${checkIsNumber}`, 404);
        
        else{
            const numbersArray=numbers.split(',').map((number)=>parseFloat(number))
            const response={operation:'mode',value:mathjs.mode(numbersArray)}
            return res.json({response})
        }
      } catch (err) {
        return next(err);
      }
})

//all route

app.get('/all',(req,res,next)=>{
    try {
        const {numbers}=req.query
        const {save}=req.query

        if (numbers===undefined || req.query['numbers']==='') throw new ExpressError("Numbers are required!", 404);

        const queryArray=numbers.split(',')

        let checkIsNumber=queryArray.filter(el=>isNaN(el))
        
        if (checkIsNumber.length!==0) throw new ExpressError(`Not a number: ${checkIsNumber}`, 404);
        
        else{
            const numbersArray=numbers.split(',').map((number)=>parseFloat(number))
            const response={operation:'all'
                            ,mean:mathjs.mean(numbersArray)
                            ,median:mathjs.median(numbersArray)
                            ,mode:mathjs.mode(numbersArray)}

            if (save==='true'){
                fs.appendFileSync('results.json', `log: ${JSON.stringify(response)} timestamp: ${new Date().toUTCString()}\n`, "utf8", function(err) {
                    if (err) {
                      console.error(err);
                      process.exit(1);
                    }
                    console.log('Successfully wrote to file!');
                  });
            }

            return res.json({response})
        }
      } catch (err) {
        return next(err);
      }
})

//404 handler
app.use(function (req, res, next) {
    const notFoundError = new ExpressError("Not Found", 404);
    return next(notFoundError)
  });
  
//generic error handler
app.use(function(err, req, res, next) {
// the default status is 500 Internal Server Error
let status = err.status || 500;
let message = err.message;

// set the status and alert the user
return res.status(status).json({
    error: {message, status}
});
});



app.listen(3000, ()=> {
    console.log('App on port 3000');
  })