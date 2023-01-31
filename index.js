console.log('Flappy Bird');

const sprites = new Image();
sprites.src = './sprites.png';

const HIT_Sound = new Audio();
HIT_Sound.src = './effects/efeitos_hit.wav'

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

const Ready = {
    sourceX: 134,
    sourceY: 0,
    weight: 175,
    height: 152,
    x: (canvas.width / 2) - 174 / 2,
    y: 50,
    draw() {
        contexto.drawImage (
            sprites,
            Ready.sourceX, Ready.sourceY,
            Ready.weight, Ready.height,
            Ready.x, Ready.y,
            Ready.weight, Ready.height,
        )
    }
}

function FP_Create() {
    const FP = {
        sourceX: 0,
        sourceY: 0,
        weight: 34,
        height: 24,
        x: 10,
        y: 50,
        jumping: 4.6,
        jump() { 
            FP.speed = - FP.jumping
        },
        gravity: 0.25,
        speed: 0,
        update() {
            if(colision(FP, globals.GR)) {
                HIT_Sound.play();
                changeScreen(Screens.Start);
                return;
            }
        
            FP.speed = FP.speed + FP.gravity;
            FP.y = FP.y + FP.speed;
        },
        moviments: [
            {sourceX: 0, sourceY: 0,},
            {sourceX: 0, sourceY: 26,},
            {sourceX: 0, sourceY: 52,},
        ],
        draw() {
            const { sourceX, sourceY } = FP.moviments[0];
            contexto.drawImage (
                sprites,
                sourceX, sourceY,
                FP.weight, FP.height,
                FP.x, FP.y,
                FP.weight, FP.height,
            );
        }
    }
    return FP;
}

function GR_Create() {
    const GR = {
        sourceX: 0,
        sourceY: 610,
        weight: 224,
        height: 112,
        x: 0,
        y: canvas.height - 112,
        update() {
            const GR_Moviment = 1;
            const GR_Repeat = GR.weight / 2;
            const Moviment = GR.x - GR_Moviment;
            GR.x = Moviment % GR_Repeat;

        },
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
    return GR;
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


function colision(FP, GR) {
    const FPy = FP.y + FP.height
    const GRy = GR.y;
    
    if(FPy >= GRy) {
        return true;
    }

    return false;
}

const globals = {};
let ActiveScreen = {};
function changeScreen(NewScreen) {
    ActiveScreen = NewScreen;

    if(ActiveScreen.initialize) {
        ActiveScreen.initialize();
    }
}

const Screens = {
    Start: {
        initialize() {
            globals.FP = FP_Create();
            globals.GR = GR_Create();
        },
        draw() {
            BG.draw();
            globals.GR.draw();  
            globals.FP.draw();
            Ready.draw();
        },
        click() {
            changeScreen(Screens.Game)
        },
        update() {
            globals.GR.update();
        }
    }
}

Screens.Game = {
    draw() {
        BG.draw();
        globals.GR.draw();  
        globals.FP.draw();
    },
    click() {
        globals.FP.jump()
    },
    update() {
        globals.FP.update();  
        globals.GR.update();
    }
}

function loop() {
    ActiveScreen.draw();
    ActiveScreen.update();
 
    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(ActiveScreen.click) {
        ActiveScreen.click()
    }
})

changeScreen(Screens.Start)
loop();




