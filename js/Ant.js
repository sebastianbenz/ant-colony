var WIDTH  = 30;
var HEIGHT = 30;

var offsets = [

    [-1, -1],[-1, 0],[-1, 1],
    [ 0, -1],        [ 0, 1],
    [ 1, -1],[ 1, 0],[ 1, 1]]

function Position(x, y){
    this.x = x;
    this.y = y;
}

Position.prototype.neighbours = function () {
    var x = this.x;
    var y = this.y;
    return _.map(offsets, function (offset) {
        return new Position(x + offset[0], y + offset[1])
    }).filter(function (position) {
        return position.x >= 0 && position.x <= WIDTH
            && position.y >= 0 && position.y <= HEIGHT
    });
}

Position.prototype.randomNeighbour = function(){
    var neighbours = this.neighbours();
    var randomIndex = Math.floor(Math.random() * (neighbours.length - 1)) ;
    return neighbours[randomIndex];
}


function Ant(home){
    this.position = home
    this.searching = function(){
        this.position = this.position.randomNeighbour();
    };
    this.goingToFood = function(){
        this.position = this.position.nextTo(this.positionWithFood);
    }
    this.move = this.searching

}

Ant.prototype.askAboutFood = function(ants){
    var antsKnowingAboutFood = _.filter(ants, function (ant) {
        return ant.positionWithFood !== undefined;
    });
    if(antsKnowingAboutFood.length === 0){
        return;
    }
    var antKnowingAboutFood = _.first(antsKnowingAboutFood);
    this.positionWithFood = antKnowingAboutFood.positionWithFood;
    this.move = this.goingToFood
};

Position.prototype.nextTo = function (dest) {
    return new Position(
       Math.sign(dest.x-this.x),
       Math.sign(dest.y-this.y)
    );

}



