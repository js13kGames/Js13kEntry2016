/**
 * Created by Marcel Michelfelder on 14.08.2016.
 */

var game = function(){
    var now,
        factor,
        last,
        player,
        isPaused = false,
        entities = [];



    function init(cb) {
        player = new entity();
        map = new map();
        debugWindow = new debug();
        player.init({
            isPlayer : true,
            width: 34,
            height: 30,
            x: 500,
            y: 250,
            numberOfFrames: 5,
            numberOfRows: 2,
            ticksPerFrame: 4
            //todo: sprite position
        }, function(){
            entities.push(player);
            map.init({
                pos : player.getPos()
            }, cb)
        });


    }


    function pause() {
        isPaused ^= true;
    }


    /**
     * @author Marcel Michelfelder
     *
     * runs gameloop
     *
     */
    function run() {

        requestAnimationFrame(run);
        now = Date.now();
        factor = (now - last) / 16;
        last = now;


        if(isPaused) return;

        input();
        draw();

        debugWindow.update({
            playerpos: player.getPos()
        });
    }

    function draw(){

        context.clearRect(0, 0, canvas.width, canvas.height);

        map.update(player.getPos());

        for(var i in entities){
            entities[i].draw();
        }
    }


    function input(){
        var d = 0;
        var s = 5;
        var shooting = false;
        if (keysDown[900]) shooting = true;
        player.shoot(shooting);

        if (keysDown[65]) {
            d = s * (-1);
        } else if (keysDown[68]) {
            d = s;
        }
        player.moveX(d);

        d = 0;
        if (keysDown[83]) {
            d = s;
        } else if (keysDown[87]) {
            d = s * (-1);
        }
        player.moveY(d);
    }

    return {
        init : init,
        pause : pause,
        run : run
    };
};