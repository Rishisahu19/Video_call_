const express = require('express');
const app = express();

const socket = require('socket.io');
// upgrade


const server = app.listen(3000, (error) => {
    if (error) {
        console.error('Server failed to start:', error);
    } else {
        console.log('Server is Running');
    }
});


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('view engine', 'ejs');
app.set('views', './views');


app.use(express.static('public'));


const userRoute = require('./routes/userRoutes');
app.use('/', userRoute);


//Socket io working with signing server
var io = socket(server);
io.on("connection", (socket) => {
    console.log("User Connnected: " + socket.id);

    socket.on("join", (roomName) => {
        // wtf-1
        var rooms = io.sockets.adapter.rooms;
        // console.log(rooms);
        var room = rooms.get(roomName);
        console.log(room);

        if (room == undefined) {
            //create room with name roomname
            socket.join(roomName);

            socket.emit("created");
            // console.log('Room Created');
        }
        else if (room.size == 1) {
            socket.join(roomName);
            socket.emit("joined");
            // console.log("Room Joined");
        }
        else {
            // console.log("Room Full");
            socket.emit("full");
        }
        console.log(rooms);

    });
    //Ready
    /////////////////////////////
    socket.on("ready", (roomName) => {
        console.log("Ready");
        socket.broadcast.to(roomName).emit("ready");
    });
    //ICE
    ////////////////////////////
    socket.on("candidate", function (candidate, roomName) {
        // console.log("Candidate");
        // console.log(candidate);
        socket.broadcast.to(roomName).emit("candidate", candidate);
    });
    //Offer
    /////////////////////////////////
    // socket.on("offer", function (offer, roomName) {
    //     console.log("Offer");
    //     console.log(offer);
    //     socket.broadcast.to(roomName).emit("offer", offer);
    // });
    socket.on("offer", function (offer, roomName) {
        try {
            // console.log("Offer");
            // console.log(offer);
            socket.broadcast.to(roomName).emit("offer", offer);
        } catch (error) {
            console.error("Error handling offer:", error);
        }
    });

    //Answer
    /////////////////////////////////////
    socket.on("answer", function (answer, roomName) {
        // console.log("Answer");
        socket.broadcast.to(roomName).emit("answer", answer);
    });

    // leave room concept
    socket.on("leave", (roomName) => {
        socket.leave(roomName);
        socket.broadcast.to(roomName).emit("leave");
    })

})
