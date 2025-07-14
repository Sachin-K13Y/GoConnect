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
            const{userId,userType} = data;
            if(userType=='user'){
                await User.findByIdAndUpdate(user.Id,{
                    socketId:socket.id
                });
            }
            else if(userType=='driver'){
                await Driver.findByIdAndUpdate(userId,{socketId:socket.id});
            }
        });
        socket.on('disconnect', () => {
            for (const [id, sId] of socketIdMap.entries()) {
                if (sId === socket.id) {
                    socketIdMap.delete(id);
                    break;
                }
            }
        });
    });
}

export function sendMessageToSocketId(id, event, data) {
    if (!io) return;
    const socketId = socketIdMap.get(id);
    if (socketId) {
        io.to(socketId).emit(event, data);
    }
}
