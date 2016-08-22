/**
 * Created by Marcel Michelfelder on 16.08.2016.
 */

var map = function(){
    var pX, pY, lastX, lastY, tilesize, wave = 3;
    var waves = [
        {
            enemies : [{name : 'drone', count : 3}],
            lasting : 10 * SECOND
        },
        {
            enemies : [{name : 'enemy1', count : 2}],
            lasting : 20 * SECOND
        },
        {
            enemies : [{name : 'drone', count : 10}],
            lasting : 25 *SECOND
        },
        {
            enemies : [ {name : 'drone1', count : 3}],
            lasting : 30 * SECOND
        }

    ];

    function init(cb){
        var loaderObj = new loader();
        loaderObj.init(function(){
            cb();
            initItems();
            tilesize = proto['area'].w;

        })
    }

    function nextWave(){
        if(waves[wave]){
            var waveInfo = waves[wave].enemies;
            timeUntilNextWave = Date.now() + waves[wave].lasting;
            for(var j in waveInfo){
                for(var i = 0; i < waveInfo[j].count; i++){
                    var x = getRandomArbitrary(-1,1)*cWidth/2 + pX;
                    var y = getRandomArbitrary(-1,1)*cHeight/2 + pY;
                    createEntity({
                        //name : 'drone',
                        name : waveInfo[j].name,
                        x: x,
                        y: y,
                        bot: true,
                    },[entities,enemies])
                }
            }
            wave++;
        } else {
            //console.log("game completed");
        }

    }

    function initItems(){

        var availItems = ['crate', 'crate2'];

        for(var i = getRandomArbitrary(2,7); i > 0; i--){
            var whichItem = Math.max((Math.round(Math.random()*availItems.length)-1),0);
            var x = getRandomArbitrary(-1,1)*cWidth/2 + pX;
            var y = getRandomArbitrary(-1,1)*cHeight/2 + pY;
            createEntity({
                name : availItems[whichItem],
                x: x,
                y: y
            },[entities, items])
        }
    }

    function update(playerPos){
        pX = playerPos.x, pY = playerPos.y;
        addRandomItem();
        lastX = pX;
        lastY = pY;

        if(Date.now() > timeUntilNextWave){
            nextWave();
        }

        draw();
    }

    function addRandomItem(){
        if(Math.random()>items.length/15 && items.length < 10 && (lastX != pX || lastY != pY)){
            //TODO: abhängig davon machen wieviel kisten schon im spiel sind
            var x,y;
            var xOrY = true;
            if(lastX != pX && lastY != pY){
                xOrY = Math.random() > .5;
            }
            if(lastX != pX && xOrY){
                x = (lastX > pX?-1:1) * cWidth/2 + pX;
                y = getRandomArbitrary(-1,1)*cHeight/2 + pY;
            } else if(lastY != pY) {
                y = (lastY > pY?-1:1) * cHeight/2 + pY;
                x = getRandomArbitrary(-1,1)*cWidth/2 + pX;
            }

            var crate = new entity({
                name : 'crate',
                x: x,
                y: y,
                ticksPerFrame: 4
            });
            entities.push(crate);
            items.push(crate);
            crate.setRef(crate);

        }
    }

    function draw() {
        //context.drawImage(image, 0, 0, offset, offset, offset/2 - pX, offset/2 - pY, offset, offset);
        var zoomedTilesize = tilesize * overallZoom;
        for(var x = -zoomedTilesize;x < cWidth+zoomedTilesize; x+=zoomedTilesize){
            for(var y = -zoomedTilesize;y < cHeight+zoomedTilesize; y+=zoomedTilesize){
                context.drawImage(proto["area"].sprites[0][0], 0, 0, tilesize, tilesize, x-pX.mod(zoomedTilesize), y-pY.mod(zoomedTilesize), zoomedTilesize, zoomedTilesize);
            }
        }
        //context.fillStyle = '#000000';
        //context.fillRect(0,0,cWidth,cHeight);
        //context.fillStyle = '#00ff00';
        //context.fillRect(cWidth/2,cHeight/2,10,10);
    }

    //todo: obstacles

    return {
        init : init,
        update : update,
        draw : draw
    }
};