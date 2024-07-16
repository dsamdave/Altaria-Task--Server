import { Socket } from 'socket.io'
// import { IUser } from './interface';
import { io } from '../index'

export interface ISocketUser {
  id: string;
  socketId: string;

}

// Store connected clients
// const clients = new Set();
const clients = new Set<Socket>();


export const SocketServer = (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('joinUsers', (id: string) => {
    socket.join(id)
    clients.add(socket);
    console.log(`User ${socket.id} joined room ${id}`);
    console.log({ joinChat: (socket as any).adapter.rooms })
  })



  socket.on('leaveUsers', (id: string) => {
    socket.leave(id)
    clients.delete(socket);
    console.log(`User ${socket.id} left room ${id}`);
    console.log({ leaveChat: (socket as any).adapter.rooms })
  })

  socket.on('disconnect', () =>{
    clients.delete(socket);
    console.log(`User ${socket.id} disconnected`);
  })


  // notification
  socket.on('sendnotification', (notification) => {
    // Emit the notification to all connected clients
    io.emit('notification', notification);
  });



  // Message
  socket.on('chatMessage', (data) => {
    const { recipientId, message } = data;

    // Emit the message to the recipient
    io.to(recipientId).emit('newMessage', message);
    console.log(`Message from ${socket.id} to ${recipientId}: ${message}`);  });

}