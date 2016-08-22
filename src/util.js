/**
 * Created by Marcel Michelfelder on 17.08.2016.
 */

function tint(img,rgba){

    var buffer = document.createElement('canvas');
    //console.log(buffer, img);
    buffer.width = img.width;
    buffer.height = img.height;
    var bx = buffer.getContext('2d');
    bx.drawImage(img,0,0);

    var imageData = bx.getImageData(0,0,buffer.width, buffer.height);
    var pixels = imageData.data;
    var numPixels = pixels.length;
    for (var i = 0; i < numPixels; i++) {
        var average = (pixels[i*4] + pixels[i*4+1] + pixels[i*4+2]) /3;
        // set red green and blue pixels to the average value
        pixels[i*4] = average + rgba.r;
        pixels[i*4+1] = average+rgba.g;
        pixels[i*4+2] = average+rgba.b;
    }
    bx.putImageData(imageData, 0, 0);

    return buffer;
    //var image = new Image();
    //image.src = buffer.toDataURL();
    //image.onload = function(){
    //    cb(image);
    //};
}


function changeColorOfSprite(img,originRGBA,destRGBA){
    var buffer = document.createElement('canvas');
    //console.log(buffer, img);
    buffer.width = img.width;
    buffer.height = img.height;
    var bx = buffer.getContext('2d');
    bx.drawImage(img,0,0);

    var imageData = bx.getImageData(0,0,buffer.width, buffer.height);
    var pixels = imageData.data;
    var numPixels = pixels.length;
    for (var i = 0; i < numPixels; i++) {
        if(originRGBA.r == pixels[i*4] && originRGBA.g == pixels[i*4+1] && originRGBA.b == pixels[i*4+1]){
            pixels[i*4] = destRGBA.r;
            pixels[i*4+1] = destRGBA.g;
            pixels[i*4+2] = destRGBA.b;
        }
    }
    bx.putImageData(imageData, 0, 0);

    return buffer;
}

function splinterSingle(img){
    var buffer = document.createElement('canvas');
    //console.log(buffer, img);
    var w = buffer.width = img.width;
    var h = buffer.height = img.height;
    var bx = buffer.getContext('2d');
    //bx.drawImage(img,0,0);
    bx.beginPath();
    var points = [];
    for(var i = 0; i < 3; i++){
        points.push({
            x:getRandomArbitrary(-w/2,w/2) + w/2,
            y:getRandomArbitrary(-h/2,h/2) + h/2
        })
    }

    bx.moveTo(points[0].x,points[0].y);
    for(var i=1;i<points.length;i++){
        var p=points[i];
        bx.lineTo(p.x,p.y);
    }
    bx.closePath();
    bx.clip();
    bx.drawImage(img,0,0);

    var angleRadians = Math.atan2(getRandomArbitrary(-1,1), getRandomArbitrary(-1,1));
    var vx = Math.cos(angleRadians);
    var vy = Math.sin(angleRadians);
    //console.log(buffer.toDataURL());

    //bx.putImageData(imageData, 0, 0);

    return {
        vx : vx,
        vy : vy,
        buffer : buffer,
    };
}

function splitSpritesheet(image, spriteW, spriteH){
    var sprites = [];
    var width = image.width;
    var height = image.height;
    var spritesW = width/spriteW;
    var spritesH = height/spriteH;
    var buffer;
    var bx;
    for(var j = 0; j < spritesH; j++){
        sprites[j] = [];
        for(var i = 0; i < spritesW; i++){
            buffer = document.createElement('canvas');
            buffer.width = spriteW;
            buffer.height = spriteH;
            bx = buffer.getContext('2d');

            //console.log(i*spriteW,j*spriteH,spriteW,spriteH);
            //bx.drawImage(image,i*spriteW,j*spriteH,spriteW,spriteH);
            bx.drawImage(image,i*spriteW,j*spriteH,spriteW,spriteH,0,0,spriteW,spriteH);
            //console.log(buffer.toDataURL());
            sprites[j][i] = buffer;
        }
    }
    return sprites;
}

function getAngleBetweenTwoPoints(sx,sy,tx,ty){
    return Math.atan2(ty - sy, tx - sx);
}


function createEntity(opts,array){
    var ent = new entity(opts);
    for(var i in array){
        array[i].push(ent);
    }
    ent.setRef(ent);
}

function hits(x1, y1, w1, h1,
              x2, y2, w2, h2){
    if (x1 + w1 > x2)
        if (x1 < x2 + w2)
            if (y1 + h1 > y2)
                if (y1 < y2 + h2)
                    return true;

    return false;
}


function iterateSprites(sprites, fnc){
    var newSprites = [];
    for(var y in sprites){
        newSprites[y] = [];
        for(var x in sprites[y]){
            newSprites[y][x] = fnc(sprites[y][x])
        }
    }
    return newSprites;
}


function splinter(img){
    var buffer = document.createElement('canvas');
    //console.log(buffer, img);
    var w = buffer.width = img.width*4;
    var h = buffer.height = img.height*4;
    var bx = buffer.getContext('2d');
    var finished;

    var splinters = [];
    for(var i = 0; i < 5; i++){
        splinters.push(splinterSingle(img));
    }
    //bx.drawImage(img,0,0);
    var d = 0;

    function draw(){
        bx.clearRect(0, 0, buffer.width, buffer.height);
        d+=3;
        for(var i in splinters){
            //context.drawImage(splinters[i],d*vx+200,d*vy+200);
            bx.globalAlpha = finished = 1 - (d/50);
            bx.drawImage(splinters[i].buffer,d*splinters[i].vx+w/2,d*splinters[i].vy+h/2);
        }
        //bx.fillRect(0,0,w,h);
        //console.log(splinters.length);
        //console.log(buffer.toDataURL());
        //console.log(finished);
        return buffer;
    }

    //setInterval(function(){
    //    draw();
    //}, 500)


    function isFinished(){
        return finished < 0;
    }

    //bx.putImageData(imageData, 0, 0);

    return {
        draw: draw,
        finished : isFinished
    };
}

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function createGlitchSprites(w,h){
    var sprites = [];
    for(var j=0; j <10; j++){
        sprites.push(createGlitchSprite(w,h));
    }
    return sprites;
}

function createGlitchSprite(w,h){
    var buffer = document.createElement('canvas');
    //console.log(buffer, img);
    var fontheight = 6;
    var size = 2;
    buffer.width = w;
    buffer.height = h;
    var rows = Math.ceil(buffer.height/fontheight);
    var bx = buffer.getContext('2d');
    for(var i=0; i <rows; i++){
        bx.drawImage(new pixelfont().draw(getBinaryString(rows*3),size,"lightgreen"),0,i*size*fontheight);
    }
    return buffer;
}

//function drawImage(sprite,x,y,w,h,x2,y2,w2,h2){
function drawImage(sprite,w,h,w2,h2){
    var buffer = document.createElement('canvas');
    buffer.width = w2;
    buffer.height = h2;
    var bx = buffer.getContext('2d');
    bx.imageSmoothingEnabled = false;
    bx.drawImage(sprite, 0, 0, w, h, 0, 0, w2, h2);
    //bx.drawImage(sprite, 0, 0, w, h, 0, 0, w2, h2);
    //return clipObjectGlitch(buffer);
    return buffer;

}

function drawZoomed(img,zoom){
    var buffer = document.createElement('canvas');
    buffer.width = img.width*zoom;
    buffer.height = img.height*zoom;;
    var bx = buffer.getContext('2d');
    bx.imageSmoothingEnabled = false;
    bx.drawImage(img, 0, 0, img.width, img.height, 0, 0, buffer.width, buffer.height);
    //bx.drawImage(sprite, 0, 0, w, h, 0, 0, w*overallZoom, h*overallZoom);
    return buffer;
}

var glitchsprite = (function(){
    var sprites = [];
    for(var i = 0; i < 10; i++){
        sprites.push(createGlitchSprite(200,200));
    }
    return sprites;
})();

function clipObjectGlitch(img){
    var buffer = document.createElement('canvas');
    var w = buffer.width = img.width;
    var h = buffer.height = img.height;
    var bx = buffer.getContext('2d');
    var glitchSprite = getRandomElementInArray(glitchsprite);
    //var glitchSprite = createGlitchSprite(w,h);
    bx.drawImage(img,0,0);
    bx.globalCompositeOperation = "source-in";
    bx.drawImage(glitchSprite,0,0);
    return buffer;
}

function getRandomElementInArray(items){
    return items[Math.floor(Math.random()*items.length)];
}

function getBinaryString(len){
    var str = "";
    while(len--){
        str += Math.random()>.5?1:0;
    }
    return str;
}

function RGBA(r,g,b,a){
    return {
        r:r,
        g:g,
        b:b,
        a:a||1
    }
};

function objClone(obj){
    return JSON.parse(JSON.stringify(obj));
}

function dist (sx,sy,tx,ty){
    return Math.sqrt( (sx-=tx)*sx + (sy-=ty)*sy );
}