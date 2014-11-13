
var HOME_WIDTH  = 2;
var HOME_HEIGHT  = 2;
var OFFSET  = 10;

function coordinate(value){
    return value * OFFSET
}

function drawAnt(ctx, position){
    var x = coordinate(position.x);
    var y = coordinate(position.y);
    ctx.fillStyle = "grey";
    ctx.beginPath();
    ctx.arc(x + 5, y + 5, 5, 0, Math.PI*2);
    ctx.closePath();
    ctx.fill();

}

function drawHome(ctx, position){
    var x = coordinate(position.x);
    var y = coordinate(position.y);
    ctx.fillStyle = "green";
    console.log(x + "-" + y );
    ctx.fillRect(x, y, OFFSET, OFFSET);
}

function drawFood(ctx, position){
    var x = coordinate(position.x);
    var y = coordinate(position.y);
    ctx.fillStyle = "red";
    console.log(x + "-" + y );
    ctx.fillRect(x, y, OFFSET, OFFSET);

}

function moveAnt(ctx, prevPosition, newPosition) {
    var x = coordinate(prevPosition.x);
    var y = coordinate(prevPosition.y);
    ctx.clearRect(x, y, OFFSET, OFFSET);
    drawAnt(ctx, newPosition);
}

function draw(ctx, ant) {
    var requestAnimationFrame =
        function(callback) {
            return setTimeout(callback, 1000);
        };
    var render = function () {
        var oldPosition = ant.position;
        console.log("old>" + oldPosition)
        ant.move();
        console.log("new>" + ant.position)
        moveAnt(ctx, oldPosition, ant.position);
        requestAnimationFrame(render);
    }

    requestAnimationFrame(render, 500);
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

drawHome(ctx, new Position(WIDTH / 2  , HEIGHT / 2))
drawAnt(ctx, new Position(0, 0))
drawAnt(ctx, new Position(5, 5))
drawFood(ctx, new Position(20, 20))

var pos = new Position(5,5);
var ant = new Ant(pos);
drawAnt(ctx, pos);
draw(ctx, ant);





