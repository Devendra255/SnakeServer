const express = require('express');
const path = require('path');
const LogInCollection = require("./mongodb")

const app = express();
const port = 3000;
app.use(express.json())
app.use('/',express.static(path.join(__dirname,'login')));
app.use('/snake',express.static(path.join(__dirname,'public')));
app.use(express.urlencoded({ extended: false }))

app.post('/', async (req, res) => {

    const data = {
        name: req.body.name,
        password: req.body.password,
        hiscore: 0
    }
    console.log(data)
    
    const checking = await LogInCollection.findOne({ name: req.body.name })
    console.log(checking)
    try{
        if(checking === null){
            await LogInCollection.insertMany([data])
            res.redirect("/snake")
        }
        else if (checking.name === req.body.name) {
            try {   
                if (checking.password === req.body.password) {
                    app.get('/api', function(req, res){
                        res.json(checking);
                        console.log("Data sended")
                    });
                    res.redirect("/snake")
                }
                else {
                    res.send("incorrect password")
                }
            }  
            catch (e) {
                res.send("wrong details")
            }
        }
        else{
            await LogInCollection.insertMany([data])
            app.get('/api', function(req, res){
                res.json(data);
                console.log("Data sended")
            });
            res.redirect("/snake")
        }
    }
    catch(e){
     console.log(e)
     res.send("wrong inputs")
    }
})

app.post('/score', async (req, res) => {
    const data = {
        name: req.body.name,
        score: req.body.score
    }
    console.log(data)
    const checking = await LogInCollection.findOne({ name: data.name })
    if (data.score > checking.hiscore) {
        await LogInCollection.updateOne({ name: data.name }, { $set: { hiscore: data.score } })
        app.get('/api', function(req, res){
            res.json(checking);
            console.log("Data sended")
        });
        console.log("data updated")
    }
})

app.listen(port, () => console.log(`Example app listening on port http://localhost:${port}`))