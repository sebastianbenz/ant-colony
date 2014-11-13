describe("Position", function () {

    it('returns random neighbour', function () {
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

    it('is equal to position with same coordinates', function () {
        expect(_.isEqual(pos(1,1), pos(1,1))).toEqual(true);
    });

    it('returns all neighbours', function () {
        var position = pos(3, 3);
        var expectedNeighbours = [
            pos(2, 2), pos(2, 3), pos(2, 4),
            pos(3, 2),            pos(3, 4),
            pos(4, 2), pos(4, 3), pos(4, 4) ];
        expect(_.isEqual(
            position.neighbours(),
            expectedNeighbours)).toBe(true)

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

});

function aPosition(){
    return pos(1,2);
}

function pos(x, y){
    return new Position(x, y);
}

