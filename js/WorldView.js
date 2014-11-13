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
    ctx.fillRect(x, y, OFFSET, OFFSET);
}

function drawFood(ctx, position){
    var x = coordinate(position.x);
    var y = coordinate(position.y);
    ctx.fillStyle = "red";
    ctx.fillRect(x, y, OFFSET, OFFSET);

}

function moveAnt(ctx, prevPosition, newPosition) {
    var x = coordinate(prevPosition.x);
    var y = coordinate(prevPosition.y);
    ctx.clearRect(x, y, OFFSET, OFFSET);
    drawAnt(ctx, newPosition);
}

function draw(ctx, ants) {
    var requestAnimationFrame =
        function(callback) {
            return setTimeout(callback, 1000);
        };
    var render = function () {
        _.each(ants, function (ant) {
            var oldPosition = ant.position;
            ant.move();
            moveAnt(ctx, oldPosition, ant.position);
        });
        requestAnimationFrame(render);
    };

    requestAnimationFrame(render, 500);
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function onCanvasClick(ev) {
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;

    console.log("click: " + x + "-" + y)
    drawFood(ctx, new Position(normalize(x), normalize(y)))
}

function normalize(x){
    return Math.floor(x / OFFSET)
}

canvas.addEventListener('click', onCanvasClick, false);



var home = new Position(WIDTH / 2  , HEIGHT / 2);
drawHome(ctx, home)
drawAnt(ctx, new Position(0, 0))
drawAnt(ctx, new Position(5, 5))
drawFood(ctx, new Position(20, 20))

var ants = _.range(20).map(function () {
    return new Ant(home);
})

draw(ctx, ants);





