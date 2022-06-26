import Connection from './database/db.js';
import document from './Document.js';
import express from "express";
import cors from "cors";
import mongoose from 'mongoose';
import { createServer } from 'http';
import { Server } from "socket.io";




const PORT = process.env.PORT || 3001;

const URL = process.env.MONGODB_URI || `mongodb://user-shared:Shamshun_63@sharedspace-shard-00-00.i4q6e.mongodb.net:27017,sharedspace-shard-00-01.i4q6e.mongodb.net:27017,sharedspace-shard-00-02.i4q6e.mongodb.net:27017/?ssl=true&replicaSet=atlas-sqqyfp-shard-0&authSource=admin&retryWrites=true&w=majority`

Connection(URL);

const app = express();


if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
}

const httpserver = createServer(app);
httpserver.listen(PORT);  

const io = new Server(httpserver);

app.use(cors());

const defaultValue = " ";

io.on("connection", socket => {
    socket.on('get-document', async documentId => {
       const Document = await findOrCreateDocument(documentId)
       socket.join(documentId)
       socket.emit("load-document", document.data)
         
       socket.on('send-changes', delta => {
        socket.broadcast.to(documentId).emit("recieve-changes", delta) 
        })

        socket.on("save-document", async data => {
            await document.findByIdAndUpdate(documentId, {data})
        })
    })
})

async function findOrCreateDocument(id){
    if(id == null);
    
    const Document = await document.findById(id);
    if (Document) return Document
    return await document.create({ _id: id, data: defaultValue})
}