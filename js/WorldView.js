var OFFSET  = 10;
var ANT_COUNT = 1000;
var FOOD_COUNT = 50;

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

function removeAnt(ctx, prevPosition) {
    var x = coordinate(prevPosition.x);
    var y = coordinate(prevPosition.y);
    ctx.clearRect(x, y, OFFSET, OFFSET);
}

function draw(ctx, world, ants) {
    var requestAnimationFrame = (function(callback) {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
            function(callback) {
                window.setTimeout(callback, 1000 / 60);
            };
    })();
    var render = function () {
        _.each(ants, function (ant) {
            ant.move();
            world.moveAnt(ant);
            if (shouldDrawAnt(ant.previousPosition)){
                removeAnt(ctx, ant.previousPosition);
            }
            if (shouldDrawAnt(ant.position)){
                drawAnt(ctx, ant.position);
            }
        });
        _.each(ants, function (ant) {
            ant.update(world.field(ant.position));
        });
        requestAnimationFrame(render);
    };

    requestAnimationFrame(render);
}

function shouldDrawAnt(position){
    return world.field(position).food == 0 &&
                !_.isEqual(home, position)

}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function onCanvasClick(ev) {
    var x = ev.clientX - canvas.offsetLeft;
    var y = ev.clientY - canvas.offsetTop;

    var position = new Position(normalize(x), normalize(y));
    _.range(FOOD_COUNT).map(function () {
        world.putFood(position);
    });
    drawFood(ctx, position)
}

function normalize(x){
    return Math.floor(x / OFFSET)
}

canvas.addEventListener('click', onCanvasClick, false);



var home = new Position(WIDTH / 2  , HEIGHT / 2);
drawHome(ctx, home);

var ants = _.range(ANT_COUNT).map(function () {
    return new Ant(home);
});

var world = new World();
draw(ctx, world, ants);





