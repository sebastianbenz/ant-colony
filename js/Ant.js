var WIDTH  = 128;
var HEIGHT = 76;

var offsets = [
    [-1, -1],[-1, 0],[-1, 1],
    [ 0, -1],        [ 0, 1],
    [ 1, -1],[ 1, 0],[ 1, 1]
];

function Field(){
    this.ants = [];
    this.food = 0;
}

Field.prototype.takeFood = function () {
    this.food--;
};

Field.prototype.empty = function () {
    return this.food == 0 && this.ants.length === 0;
};

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
};

Position.prototype.randomNeighbour = function(){
    return _.sample(this.neighbours());
};

Position.prototype.toString = function(){
    return "[" + this.x + "," + this.y + "]";
};

function Ant(home){
    this.position = home;
    this.home = home;
    this.move = this.searching;
    this.update = this.inspectField;
}

Ant.prototype.searching = function(){
    this.updatePosition(this.position.randomNeighbour());
};

Ant.prototype.goingToFood = function () {
    this.updatePosition(this.position.nextTo(this.positionWithFood));
};

Ant.prototype.takeFoodHome = function(){
    this.updatePosition(this.position.nextTo(this.home));
    if(_.isEqual(this.position, this.home)){
        this.move = this.goingToFood;
    }
};

Ant.prototype.inspectField = function(field){
    //ask first before checking for food
    if(this.move == this.searching){
        this.askAboutFood(field);
    }
    this.checkFieldForFood(field);
};

Ant.prototype.updatePosition = function (next) {
    this.previousPosition = this.position;
    this.position = next;
};

Ant.prototype.checkFieldForFood = function(field){
    if(field.food === 0){
        if(_.isEqual(this.position, this.positionWithFood)){
            delete this.positionWithFood;
            this.move = this.searching;
        }
        return;
    }else{
        field.takeFood();
        this.positionWithFood = this.position;
        this.move = this.takeFoodHome;
    }
};

Ant.prototype.askAboutFood = function(field){
    var antsKnowingAboutFood = _.filter(field.ants, function (ant) {
        return ant.positionWithFood;
    });
    if(antsKnowingAboutFood.length === 0){
        return;
    }
    var antKnowingAboutFood = _.first(antsKnowingAboutFood);
    this.positionWithFood = antKnowingAboutFood.positionWithFood;
    this.move = this.goingToFood
};

Position.prototype.nextTo = function(dest) {
    return new Position(
       this.x + sign(dest.x-this.x),
       this.y + sign(dest.y-this.y)
    );
};


function sign(number){
    return number < 0 ? -1 : number > 0 ? 1 : 0
}

function World(){
    this.fields = []
}

World.prototype.field = function(position){
    if(!position){
        return;
    }
    var key = position.x + "_" + position.y;
    var field =  this.fields[key];
    if(!field) {
        field = new Field();
        this.fields[key] = field;
    }
    return field;
};

World.prototype.putFood = function(position){
    this.field(position).food++;
};

World.prototype.moveAnt = function(ant){
    var field = this.field(ant.previousPosition);
    if(field){
        remove(field.ants, ant);
        /*
        if(field.empty()){
            remove(this.fields, field);
        }
         */
    }
    this.field(ant.position).ants.push(ant);
};

function remove(list, item){
    var index = list.indexOf(item);
    if(index > -1){
        list.splice(index, 1);
    }
}

