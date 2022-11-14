require("./css/main.css");
var state = { players: {} };

var leftPressed = false;
var upPressed = false;
var rightPressed = false;
var downPressed = false;

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw all players
  for (var player_id in state.players) {
    // Draw a circle
    // console.log(state.players[player_id])
    ctx.beginPath();
    ctx.arc(
      state.players[player_id].x,
      state.players[player_id].y,
      20,
      0,
      Math.PI * 2,
      false
    );
    ctx.fillStyle = state.players[player_id].color;
    ctx.fill();
    ctx.closePath();
  }
}

// Setup Canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

// Connect to server
if ("WebSocket" in window) {
  // Open a new websocket
  var ws = new WebSocket("ws://localhost:8080/echo");

  // Callback for messages from server
  ws.onmessage = function (event) {
    state.players = JSON.parse(event.data).players;
    draw();
  };

  ws.onclose = function () {
    console.log("Connection closed");
  };

  // Key Press handlers
  function keyDownHandler(e) {
    if ((e.key == "Left" || e.key == "ArrowLeft") && !leftPressed) {
      ws.send(JSON.stringify({ command: "leftPressed" }));
      leftPressed = true;
    }
    if ((e.key == "Right" || e.key == "ArrowRight") && !rightPressed) {
      ws.send(JSON.stringify({ command: "rightPressed" }));
      rightPressed = true;
    }
    if ((e.key == "Up" || e.key == "ArrowUp") && !upPressed) {
      ws.send(JSON.stringify({ command: "upPressed" }));
      upPressed = true;
    }
    if (e.key == "Down" || (e.key == "ArrowDown" && !downPressed)) {
      ws.send(JSON.stringify({ command: "downPressed" }));
      downPressed = true;
    }
  }
  function keyUpHandler(e) {
    if (e.key == "Left" || e.key == "ArrowLeft") {
      ws.send(JSON.stringify({ command: "leftReleased" }));
      leftPressed = false;
    }
    if (e.key == "Right" || e.key == "ArrowRight") {
      ws.send(JSON.stringify({ command: "rightReleased" }));
      rightPressed = false;
    }
    if (e.key == "Up" || e.key == "ArrowUp") {
      ws.send(JSON.stringify({ command: "upReleased" }));
      upPressed = false;
    }
    if (e.key == "Down" || e.key == "ArrowDown") {
      ws.send(JSON.stringify({ command: "downReleased" }));
      downPressed = false;
    }
  }

  // Setup keyboard controls
  document.addEventListener("keydown", keyDownHandler, false);
  document.addEventListener("keyup", keyUpHandler, false);
} else {
  console.log("WebSocket is NOT supported by this browser!");
}
