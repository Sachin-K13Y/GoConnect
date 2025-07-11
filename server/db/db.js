import mongoose from 'mongoose'

const connectToDb=()=>{
    mongoose.connect(process.env.MONGO_URI).
    then(()=>{
        console.log("DB Connection Successful");
    }).
    catch(err=>console.log(err));
}


export default connectToDb;