var WIDTH  = 30;
var HEIGHT = 30;

var offsets = [
    [-1, -1],[-1, 0],[-1, 1],
    [ 0, -1],        [ 0, 1],
    [ 1, -1],[ 1, 0],[ 1, 1]
]

function Field(){
    this.ants = [];
    this.food = 0;
}

Field.prototype.takeFood = function () {
    this.food--;
}

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
    return _.sample(this.neighbours());
}


function Ant(home){
    this.position = home
    this.home = home
    this.move = this.searching;
    this.update = this.inspectField;
}

Ant.prototype.searching = function(){
    this.updatePosition(this.position.randomNeighbour());
};

Ant.prototype.goingToFood = function(){
    this.updatePosition(this.position.nextTo(this.positionWithFood));
}

Ant.prototype.inspectField = function(field){
    this.checkFieldForFood(field);
    if(this.positionWithFood === undefined){
        this.askAboutFood(field);
    }
}

Ant.prototype.updatePosition = function (next) {
    this.previousPosition = this.position;
    this.position = next;
};

Ant.prototype.takeFoodHome = function(){
    this.updatePosition(this.position.nextTo(this.home));
    if(_.isEqual(this.position, this.home)){
        console.log("Brought food home, going to food again")
        this.move = this.goingToFood;
    }

}
Ant.prototype.checkFieldForFood = function(field){
    if(field.food === 0){
        if(_.isEqual(this.position, this.positionWithFood)){
            this.move = this.searching;
            this.positionWithFood = undefined;
            console.log("Oh no! All food is gone!");
        }
        return;
    }
    console.log("Yay! Found food!");
    field.takeFood();
    this.positionWithFood = this.position
    this.move = this.takeFoodHome;
}
Ant.prototype.askAboutFood = function(field){
    var antsKnowingAboutFood = _.filter(field.ants, function (ant) {
        return ant.positionWithFood !== undefined;
    });
    if(antsKnowingAboutFood.length === 0){
        return;
    }
    console.log("Learned about food");
    var antKnowingAboutFood = _.first(antsKnowingAboutFood);
    this.positionWithFood = antKnowingAboutFood.positionWithFood;
    this.move = this.goingToFood
};

Position.prototype.nextTo = function (dest) {
    return new Position(
       this.x + Math.sign(dest.x-this.x),
       this.y + Math.sign(dest.y-this.y)
    );

};

function Simulator(ants, food) {
    this.ants = ants;
    this.food = food;
};

Simulator.prototype.step = function () {
    _.each(ants, move);
};

function World(){
    this.fields = []
}

World.prototype.field = function(position){
    if(position === undefined){
        return undefined;
    }
    var key = position.x + "_" + position.y
    var field =  this.fields[key]
    if(field === undefined) {
        field = new Field();
        this.fields[key] = field;
    }
    return field;
}
World.prototype.putFood = function(position){
    console.log("Food: " + position.x + "," + position.y);
    this.field(position).food++;
}
World.prototype.updateAnt = function(ant){
    var field = this.field(ant.previousPosition);
    if(field !== undefined){
        var ants = field.ants;
        var index = ants.indexOf(ant);
        if(index > -1){
            field.ants.splice(index, 1);
        }
    }
    this.field(ant.position).ants.push(ant);
}

