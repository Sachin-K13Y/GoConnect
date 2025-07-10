import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
dotenv.config();
const app = express();
app.use(cors())

const port = process.env.PORT||3000
app.get('/',(req,res)=>{
    res.send('Hello World');
})


app.listen(3000,()=>{
    console.log(`Server is Running on ${port}`);
})