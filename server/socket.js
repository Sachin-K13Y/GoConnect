import { Server } from 'socket.io';
import User from './models/user.model.js';
import Driver from './models/driver.model.js';

let io = null;
const socketIdMap = new Map(); // userId/driverId -> socketId

export function initializeSocket(server) {
    io = new Server(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });
    io.on('connection', (socket) => {
    console.log(`Client Connected:${socket.id}`)

        socket.on('join',async(data)=>{
            console.log("Join event received:", data);
            const{userId,userType} = data;
            try {
                if(userType=='user'){
                    const time = await User.findById(userId);
                    
                    const user = await User.findByIdAndUpdate(userId, 
                        { socketId: socket.id },
                        { new: true }
                    );
                    console.log(user);
                    if(user) {
                        socketIdMap.set(userId, socket.id);
                        console.log(`User ${userId} socket updated:`, user);
                    }
                }
                else if(userType=='driver'){
                    const driver = await Driver.findByIdAndUpdate(userId,
                        { socketId: socket.id },
                        { new: true }
                    );
                    if(driver) {
                        socketIdMap.set(userId, socket.id);
                        console.log(`Driver ${userId} socket updated:`, driver);
                    }
                }
            } catch (error) {
                console.error("Error updating socket id:", error);
            }
        });
        socket.on('update-location-driver',async(data)=>{
            const{userId,location} = data;
            if(!location || !location.ltd || !location.lng){
                return socket.emit('error',{message:'Invalid location data'});
            }
            await Driver.findByIdAndUpdate(userId,{location:{
                ltd:location.ltd,
                lng:location.lng
            }})
        });
        socket.on('disconnect', async () => {
            try {
                // Find the user/driver ID associated with this socket
                let disconnectedId = null;
                for (const [id, sId] of socketIdMap.entries()) {
                    if (sId === socket.id) {
                        disconnectedId = id;
                        break;
                    }
                }

                if (disconnectedId) {
                    // Remove from map
                    socketIdMap.delete(disconnectedId);
                    
                    // Update database
                    await Promise.all([
                        User.findByIdAndUpdate(disconnectedId, { socketId: null }),
                        Driver.findByIdAndUpdate(disconnectedId, { socketId: null })
                    ]);
                    
                    console.log(`Socket ${socket.id} disconnected, cleaned up for ID: ${disconnectedId}`);
                }
            } catch (error) {
                console.error("Error handling disconnect:", error);
            }
        });
    });
}

export function sendMessageToSocketId(socketId,messageObject) {
console.log(messageObject);

    if (io) {
        io.to(socketId).emit(messageObject.event, messageObject.data);
    } else {
        console.log('Socket.io not initialized.');
    }
}
