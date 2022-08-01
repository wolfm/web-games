var uuid = require("uuid-random");
const WebSocket = require("ws")

// Configuration
PORT = 8080

// Helper Functions
function getRandColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random()*16)]
    }
    return color;
}

// Start server
const wss = new WebSocket.WebSocketServer({port:PORT}, ()=> {
    console.log("server started")
})

var gameState = {
    "players": {}
}

wss.on("connection", function connection(client){

    // Create UUID for user
    client.id = uuid()

    console.log(`Client ${client.id} Connected!`)

    var currentClient = gameState[""+client.id]

    // Send client info back to client
    player = {
        "id": client.id,
        "color": getRandColor(),
        "x": 480/2,
        "y": 320/2,
        "l_vel": 0,
        "r_vel": 0,
        "u_vel": 0,
        "d_vel": 0,
    }

    gameState.players[client.id] = player

    client.send(JSON.stringify(gameState))

    // Callback for message from client
    client.on("message", (datastring) => {
        var data = JSON.parse(datastring)
        console.log(client.id + ": " + datastring)

        if(data.command === "leftPressed") {
            gameState.players[client.id].l_vel = 1
        }
        else if(data.command === "leftReleased") {
            gameState.players[client.id].l_vel = 0
        }
        else if(data.command === "rightPressed") {
            gameState.players[client.id].r_vel = 1
        }
        else if(data.command === "rightReleased") {
            gameState.players[client.id].r_vel = 0
        }
        else if(data.command === "upPressed") {
            gameState.players[client.id].u_vel = 1
        }
        else if(data.command === "upReleased") {
            gameState.players[client.id].u_vel = 0
        }
        else if(data.command === "downPressed") {
            gameState.players[client.id].d_vel = 1
        }
        else if(data.command === "downReleased") {
            gameState.players[client.id].d_vel = 0
        }
    })

    // Callback for client disconnect
    client.on("close", () => {
        console.log(`Connection with client ${client.id} closed`)

        if(client.id in gameState.players) {
            delete gameState.players[client.id];
        }
    })
})

wss.on("listening", () => {
    console.log(`listening on port ${PORT}`)
})

function gameLoop() {

    for(let player_key in gameState.players) {
        player = gameState.players[player_key]
        player.x += player.r_vel - player.l_vel
        player.y += player.d_vel - player.u_vel
    }

    // Broadcast state
    wss.clients.forEach(client => {client.send(JSON.stringify(gameState))})
}

setInterval(gameLoop, 4)
