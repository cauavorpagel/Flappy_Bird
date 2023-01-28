console.log('Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const FP = {
    sourceX: 0,
    sourceY: 0,
    weight: 34,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    speed: 0,
    update() {
        FP.speed = FP.speed + FP.gravity;
        FP.y = FP.y + FP.speed;
    },
    draw() {
        contexto.drawImage (
            sprites,
            FP.sourceX, FP.sourceY,
            FP.weight, FP.height,
            FP.x, FP.y,
            FP.weight, FP.height,
        );
    }
}

const GR = {
    sourceX: 0,
    sourceY: 610,
    weight: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
    draw() {
        contexto.drawImage(
            sprites,
            GR.sourceX, GR.sourceY,
            GR.weight, GR.height,
            GR.x, GR.y,
            GR.weight, GR.height,
        );

        contexto.drawImage(
            sprites,
            GR.sourceX, GR.sourceY,
            GR.weight, GR.height,
            (GR.x + GR.weight), GR.y,
            GR.weight, GR.height,
        );
    }
}

const BG = {
    sourceX: 390,
    sourceY: 0,
    weight: 275,
    height: 204,
    x: 0,
    y: canvas.height - 204,
    draw() {
        contexto.fillStyle = '#70c5ce';
        contexto.fillRect(0,0, canvas.width, canvas.height);

        contexto.drawImage(
            sprites,
            BG.sourceX, BG.sourceY,
            BG.weight, BG.height,
            BG.x, BG.y,
            BG.weight, BG.height,
        );

        contexto.drawImage(
            sprites,
            BG.sourceX, BG.sourceY,
            BG.weight, BG.height,
            (BG.x + BG.weight), BG.y,
            BG.weight, BG.height,
        )
    }
}

function loop() {
    BG.draw();
    GR.draw();
    FP.update();    
    FP.draw();

    requestAnimationFrame(loop);
}

loop();




