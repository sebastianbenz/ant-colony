describe("Position", function () {

    it('returns last random neighbour', function () {
        Math.random = function () {
            return 1;
        };
        var randomNeighbour = pos(1,1);
        var position = pos(0,0);
        position.neighbours = function(){
            return [ aPosition(), randomNeighbour ]
        }
        expect(position.randomNeighbour()).toBe(randomNeighbour);
    });

    it('returns first random neighbour', function () {
        Math.random = function () {
            return 0;
        };
        var randomNeighbour = pos(1,1);
        var position = pos(0,0);
        position.neighbours = function(){
            return [ randomNeighbour ]
        }
        expect(position.randomNeighbour()).toBe(randomNeighbour);
    });

    it('is equal to position with same coordinates', function () {
        expect(pos(1,1)).toEqual(pos(1,1));
    });

    it('returns all neighbours', function () {
        var position = pos(3, 3);
        var expectedNeighbours = [
            pos(2, 2), pos(2, 3), pos(2, 4),
            pos(3, 2),            pos(3, 4),
            pos(4, 2), pos(4, 3), pos(4, 4) ];
        expect(position.neighbours()).toEqual(expectedNeighbours)
    });

    it('returns only neighbours within world', function () {
        var position = pos(0, 0);
        var expectedNeighbours = [
                       pos(0, 1),
            pos(1, 0), pos(1, 1) ];
        expect(position.neighbours()).toEqual(expectedNeighbours)
    });
    it('returns only neighbours within outer world bounds', function () {
        WIDTH  = 30;
        HEIGHT = 30;
        var position = pos(30, 30);
        var expectedNeighbours = [
            pos(29, 29), pos(29, 30),
            pos(30, 29) ];
        expect(position.neighbours()).toEqual(expectedNeighbours)
    });

    it('returns next position towards destination', function () {
        var posFrom = pos(0, 0);
        var posNext = pos(0, 1);
        expect(posFrom.nextTo(posNext)).toEqual(posNext);
    });
});

describe("Ant searching for food", function () {
    beforeEach(function () {
        home = pos()
        ant = new Ant(home)
    });

    it('starts at home', function () {
        expect(ant.position).toBe(home)

    });

    it('moves to random position', function () {
        var randomNeighbour = aPosition();
        home.randomNeighbour  = function() {
           return randomNeighbour;
a       }
        ant.move()
        expect(ant.position).toBe(randomNeighbour)
    });


    it('checks for food on every position', function () {
        var positionWithoutFood = aPosition()
        var positionWithFood = aPosition()
        var antKnowingAboutFood = anAnt(positionWithFood)
        var antSearchingForFood = anAnt()
        antSearchingForFood.position = positionWithoutFood
        positionWithoutFood.nextTo = function(){
            return positionWithFood;
        }
        antSearchingForFood.askAboutFood([antKnowingAboutFood])
        antSearchingForFood.move()
        expect(antSearchingForFood.position).toEqual(positionWithFood)
    })

});

function anAntSearchingForFood() {
   return anAnt();
}

function anAnt(positionWithFood){
    var ant = new Ant(pos(0, 0));
    ant.positionWithFood = positionWithFood;
    return ant;
}

function aPosition(){
    return pos(1,2);
}

function pos(x, y){
    return new Position(x, y);
}

