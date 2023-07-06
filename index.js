const express = require('express')
const app = express()
const dotenv = require("dotenv")
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
const mongoose = require('mongoose')
dotenv.config()

let PORT = process.env.MY_PORT || 4645
let URI = process.env.MONGO_URI

mongoose.connect(URI)
.then(()=>{
    console.log('mongoose is connected');
})
.catch((err)=>{
    console.log(err);
})

let userSchema = {
    item: {type: String, required:true, unique: true},
    price: {type: String, required:true },
    quantity: {type: String, required:true},
    
}

let itemModel = mongoose.model('myNewBudget',userSchema)


app.set('view engine','ejs')

app.get('/',(req,res)=>{
    res.render('items')
})

app.get('/cart',(req,res)=>{
    itemModel.find() 
    .then((result)=>{
     res.render('cart',{itemDetails:result})
    })
    .catch((err)=>{
     console.log(err);
    })
 })



app.post('/cart',(req,res)=>{
    let form = new itemModel (req.body);
    form.save()
    .then((result)=>{
        console.log(result);
        res.redirect('cart')
    })
    .catch((err)=>{
        console.log(err);
    })
})


app.post('/delete', (req,res)=>{
    itemModel.deleteOne({item: req.body.newItem})
    .then((result)=>{
        console.log(result);
        res.redirect('cart')
       })
       .catch((err)=>{
        console.log(err);
       })
    })


app.post('/edit', (req,res)=>{
    itemModel.findOne({item: req.body.newItem})
    .then((result)=>{
        console.log(result);
        res.render('editusers', {info: result})
       })
       .catch((err)=>{
        console.log(err);
       })
    
})

app.listen(PORT,()=>{
    console.log(`connected at port ${PORT}`);
})

