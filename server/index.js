import express from 'express'
import dotenv from 'dotenv'
import cors from 'cors'
import connectToDb from './db/db.js';
import userRoute from './routes/user.routes.js';
import cookieParser from 'cookie-parser';
import driverRoutes from './routes/driver.routes.js';
import mapRoutes from './routes/map.routes.js';
import rideRoutes from './routes/ride.routes.js';
import { initializeSocket } from './socket.js';
import http from 'http';
import misRoutes from './routes/misc.routes.js';
dotenv.config();
const app = express();
app.use(cors())
app.use(express.json());
app.use(cookieParser());

connectToDb()
const port = process.env.PORT||3000
app.get('/',(req,res)=>{
    res.send('Hello World');
})

app.use('/users',userRoute)

app.use('/drivers',driverRoutes);
app.use('/map',mapRoutes);
app.use('/misc',misRoutes);
app.use('/ride',rideRoutes);

const server = http.createServer(app);
initializeSocket(server);
server.listen(port,()=>{
    console.log(`Server is Running on ${port}`);
});