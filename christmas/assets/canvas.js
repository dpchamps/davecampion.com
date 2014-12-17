/**
 * Created by Dave on 12/16/2014.
 */
/* begin demo script */

var engine = particleEngine();



var canvas = document.getElementById("canvas"),
    ctx = canvas.getContext('2d'),
    w=0,
    h=0,
    renderArray = [],
    animFrame = null;


var cluster = engine.particleSet(
    {x: 250,
        y: 250
    },
    [250,200,200],
    Math.sqrt((w*w)+(h*h)) / 2,
    {
        max: 80,
        density: 1
    }
);
resizeCanvas();

renderArray.push(cluster);

var pattern = new Image();
pattern.src = 'assets/images/snow.png';
pattern.onload = function(){

    animationLoop();
};
var audio = new Audio('assets/music/99 1 AM (Christmas).mp3');
audio.loop = true;
audio.play();
window.addEventListener('resize', resizeCanvas);

function resizeCanvas(){
    ctx.canvas.width  = window.innerWidth;
    ctx.canvas.height = window.innerHeight;

    w = canvas.width;
    h = canvas.height;
    cluster.origin = {
        x: w/2,
        y: -20
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

function render(cluster){
    cluster.fountain(function(){
        var i = 0;

        if(cluster.numParticles()<cluster.max){
            while(i++ < cluster.density && cluster.numParticles() < cluster.max){
                cluster.addParticle({
                    dir: Math.PI + (Math.random()*(Math.PI*2 - Math.PI)),
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


    //console.log(pattern);
    var grd=ctx.createLinearGradient(0,0,0,h);
    grd.addColorStop(0,"#1e5799");
    grd.addColorStop(1,"#2989d8");


    ctx.fillStyle=grd;

    ctx.fillRect(0,0,w,h*7);
    ctx.fillStyle = ctx.createPattern(pattern, 'repeat');
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(0, h);
    ctx.bezierCurveTo((w/2)-250, h*0.7,(w/2)+250,h*0.7,w, h)
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    //ctx.fillRect(0, h*0.7, w, h);


    cluster.step(ctx);

}
/* end demo script */