describe("Position", function () {

    describe('randomNeighbour', function(){
        it('returns last random neighbour', function () {
            position = pos(0,0);
            expect(position.neighbours()).toContain(position.randomNeighbour());
        });
    });

    it('is equal to position with same coordinates', function () {
        expect(pos(1,1)).toEqual(pos(1,1));
    });

    describe('neighbours', function () {

        it('returns all neighbours', function () {
            var position = pos(3, 3);
            var expectedNeighbours = [
                pos(2, 2), pos(2, 3), pos(2, 4),
                pos(3, 2), pos(3, 4),
                pos(4, 2), pos(4, 3), pos(4, 4)];
            expect(position.neighbours()).toEqual(expectedNeighbours)
        });
        it('returns only neighbours within world', function () {
            var position = pos(0, 0);
            var expectedNeighbours = [
                pos(0, 1),
                pos(1, 0), pos(1, 1)];
            expect(position.neighbours()).toEqual(expectedNeighbours)
        });
        it('returns only neighbours within outer world bounds', function () {
            WIDTH = 30;
            HEIGHT = 30;
            var position = pos(30, 30);
            var expectedNeighbours = [
                pos(29, 29), pos(29, 30),
                pos(30, 29)];
            expect(position.neighbours()).toEqual(expectedNeighbours)
        });

    });

    describe('nextTo', function(){
        it('returns next position towards destination', function () {
            var posFrom = pos(0, 0);
            var posNext = pos(0, 1);
            expect(posFrom.nextTo(posNext)).toEqual(posNext);
        });
    });


});

describe("Ant", function () {
    beforeEach(function () {
        home = pos();
        world = new World();
        ant = new Ant(home, world);
    });

    describe("searching for food", function() {
        it('starts at home', function () {
            expect(ant.position).toBe(home)
        });

        it('moves to random position', function () {
            var randomNeighbour = aPosition();
            home.randomNeighbour = function () {
                return randomNeighbour;
            };
            ant.move();
            expect(ant.position).toBe(randomNeighbour)
        });
        it('asks for food on every position', function () {
            var positionWithoutFood = aPosition();
            var positionWithFood = aPosition();
            var antKnowingAboutFood = anAnt(positionWithFood);
            var antSearchingForFood = anAnt();
            antSearchingForFood.position = positionWithoutFood;
            positionWithoutFood.nextTo = function () {
                return positionWithFood;
            };
            antSearchingForFood.update(fieldWithAnt(antKnowingAboutFood));
            antSearchingForFood.move();
            expect(antSearchingForFood.position).toEqual(positionWithFood)
        });
    });

    describe('move update the world', function () {

        beforeEach(function () {
           world = new World();
            spyOn(world, "putAnt");
            spyOn(world, "removeAnt");
            movingAnt = anAntWithTheWorld(world);
            movingAnt.move();
        });

        it('puts ant on new position', function () {
            expect(world.putAnt).toHaveBeenCalledWith(movingAnt);
        });

        it('removes ant from previous position', function () {
            expect(world.removeAnt).toHaveBeenCalledWith(movingAnt);
        });

    });


    describe('finding food', function () {
        it('returns home', function () {
            var home = pos(0,0);
            var anyAnt = antWithHome(home);
            anyAnt.position = pos(1,1);
            anyAnt.update(createFieldWithFood(1));
            anyAnt.move();
            expect(anyAnt.position).toEqual(home);
        });
        it('removes food from field', function () {
            var anyAnt = newAnt();
            var fieldWithFood =  createFieldWithFood(1);
            anyAnt.update(fieldWithFood);
            expect(fieldWithFood.food).toBe(0);
        });
    });

    describe('bringing food home', function () {
        it('returns back to food', function () {
            var food = pos(1,1);
            var antKnowingAboutFood = antOnPosition(food);
            antKnowingAboutFood.update(createFieldWithFood(1));
            antKnowingAboutFood.move(); // back home
            world.field = function(){ createFieldWithFood(1)};
            antKnowingAboutFood.update(emptyField());
            antKnowingAboutFood.move(); // back to food
            expect(antKnowingAboutFood.position).toEqual(food);
        });
        it('starts searching again if no food is left', function () {
            var food = pos(1,1);
            var anyAnt = antOnPosition(food);
            anyAnt.movingStrategy = anyAnt.goingToFood;
            anyAnt.positionWithFood = food;
            anyAnt.move();
            anyAnt.position = food;
            anyAnt.update(emptyField());
            expect(anyAnt.movingStrategy).toBe(anyAnt.searching);
            anyAnt.move();
            expect(anyAnt.position).not.toBe(food);
        })
    });


});

describe("World", function(){

    beforeEach(function () {
        world = new World
    });

    it("stores food", function () {
        var position = pos(0, 0);
        expect(world.field(position)).toEqual(emptyField());
        world.putFood(position);
        expect(world.field(position)).toEqual(createFieldWithFood(1));
        world.putFood(position);
        expect(world.field(position)).toEqual(createFieldWithFood(2))

    });
    it("stores ants", function () {
        var position = pos(0, 0);
        expect(world.field(position)).toEqual(emptyField());
        var anAnt = antOnPosition(position);
        world.putAnt(anAnt);
        expect(world.field(position)).toEqual(fieldWithAnt(anAnt));
        var anotherAnt = antOnPosition(position);
        world.putAnt(anotherAnt);
        expect(world.field(position)).toEqual(fieldWithAnts(
            [anAnt, anotherAnt]));

    });

    it("removes ants", function () {
        var position = pos(0, 0);
        var anAnt = antOnPosition(position);
        world.putAnt(anAnt);
        world.removeAnt(anAnt);
        expect(world.field(position)).toEqual(emptyField());
    });

});

function newAnt() {
    return new Ant(pos(0, 0), new World());
}
function anAnt(positionWithFood){
    var ant = newAnt();
    ant.positionWithFood = positionWithFood;
    return ant;
}

function anAntWithTheWorld(world) {
   return new Ant(aPosition(), world);
}


function aPosition(){
    return pos(1,2);
}

function pos(x, y){
    return new Position(x, y);
}

function fieldWithAnts(ants) {
    var field = emptyField();
    field.ants = ants;
    return field;
}

function fieldWithAnt(ant) {
    var field = emptyField();
    field.ants.push(ant);
    return field;
}

function createFieldWithFood(food) {
    var field = emptyField();
    field.food = food;
    return field;
}
function antOnPosition(position) {
    var ant = newAnt();
    ant.position = position;
    return ant;
}

function antWithHome(position) {
    return newAnt(position, new World());
}

function emptyField() {
    return new Field()
}
