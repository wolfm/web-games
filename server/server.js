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
        "y": 320/2
    }

    gameState.players[client.id] = player

    client.send(JSON.stringify(gameState))

    // Callback for message from client
    client.on("message", (datastring) => {
        var data = JSON.parse(datastring)

        console.log(client.id + ": " + datastring)
        if(data.command === "right") {
            gameState.players[client.id].x += 2
        }
        client.send(JSON.stringify(gameState))
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
