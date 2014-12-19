/**
 * Created by Dave on 12/16/2014.
 */


//the canvas basics
var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    w=0,
    h=0,
    renderArray = [],
    animFrame = null,
    pattern = new Image(),
    audio;


function loadResources(){
    audio = new Audio('assets/music/99 1 AM (Christmas).mp3');
    audio.onloadeddata = function(){
        audio.play();
        //start playing audio first, then load the patter, then start the particles
        pattern.src = 'assets/images/snow.png';
        pattern.onload = function(){
            renderArray.push(cluster);
            animationLoop();
        };
    };

    audio.loop = true;
}
function toggleAudio(){
    var speaker = document.getElementById('toggle-audio');
    if(audio.muted){
        speaker.src = './assets/images/volume-high.png';
        audio.muted = false;
    }else{
        speaker.src = './assets/images/volume-mute2.png';
        audio.muted = true;
    }
}
function resizeCanvas(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    w = canvas.width;
    h = canvas.height;
    cluster.origin = {
        x: w/2,
        y: -70
    };
    cluster.degradeRate = Math.sqrt((w*w)+(h*h));
}
function animationLoop(){
    animFrame = requestAnimationFrame(animationLoop);
    if(renderArray.length > 0){
        ctx.clearRect(0,0,w,h);
        for(var i = 0; i < renderArray.length; i++){
            render(renderArray[i]);
        }
    }
}
function drawSky(){
    //create gradient
    var grd=ctx.createLinearGradient(0,0,0,h);
    grd.addColorStop(0,"#1e5799");
    grd.addColorStop(1,"#2989d8");
    //fill
    ctx.fillStyle=grd;
    ctx.fillRect(0,0,w,h*7);
}
function drawGround(){
    ctx.fillStyle = ctx.createPattern(pattern, 'repeat');
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.bezierCurveTo((w/2)-250, h*0.7,(w/2)+250,h*0.7,w, h)
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}
function render(cluster){

    drawSky();
    drawGround();
    cluster.emitter();
    cluster.step(ctx);

}
//instantiate the particle engine;
var engine = particleEngine();
//create a new collection of particles
var cluster = engine.particleSet({
    origin: {x: 250,
        y: 250
    },
    color: [250, 200, 200],
    degradeRate: Math.sqrt((w * w) + (h * h)) / 2,

    max: 100,
    density: 1
});
//add an emittter function the the collection
cluster.emitter = (function(){
    var i = 0;
    if(cluster.numParticles()<cluster.max){
        while(i++ < cluster.density && cluster.numParticles() < cluster.max){
            cluster.addParticle({
                dir: (5*Math.PI)/4 + (Math.random()*((7*Math.PI)/4 - (5*Math.PI)/4)),
                speed: {
                    x: (Math.random()*2)+2,
                    y: (Math.random()*2)+2
                },
                alpha: 1,
                size: (Math.random()*2)+3
            });
        }
    }
});

resizeCanvas();
loadResources();
window.addEventListener('resize', resizeCanvas);
document.getElementById('toggle-audio').addEventListener('click', toggleAudio);
/* end demo script */