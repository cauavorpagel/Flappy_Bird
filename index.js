console.log('Flappy Bird');


let frames = 0;

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

const gameOver = {
    sourceX: 134,
    sourceY: 153,
    weight: 226,
    height: 200,
    x: (canvas.width / 2) - 226 / 2,
    y: 50,
    draw() {
        contexto.drawImage (
            sprites,
            gameOver.sourceX, gameOver.sourceY,
            gameOver.weight, gameOver.height,
            gameOver.x, gameOver.y,
            gameOver.weight, gameOver.height,
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
                changeScreen(Screens.Game_Over);
                return;
            }
        
            FP.speed = FP.speed + FP.gravity;
            FP.y = FP.y + FP.speed;
        },
        moviments: [
            { sourceX: 0, sourceY: 0, },
            { sourceX: 0, sourceY: 26, },
            { sourceX: 0, sourceY: 52, }, 
            { sourceX: 0, sourceY: 26, }, 
        ],
        currentFrame: 0,
        updateCurrentFrame() {
            const frameInterval = 10;
            const passedInterval = frames % frameInterval === 0;

            if(passedInterval) {
                const incrementBase = 1;            
                const increment = incrementBase + FP.currentFrame;
                const repeatBase = FP.moviments.length;
                FP.currentFrame = increment % repeatBase
            }
            
        },
        draw() {
            FP.updateCurrentFrame();
            const { sourceX, sourceY } = FP.moviments[FP.currentFrame];

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


function PP_Create() {
    const PP = {
        weight: 52,
        height: 400,
        ground: {
            sourceX: 0,
            sourceY: 169,
        },
        sky: {
            sourceX: 52,
            sourceY: 169,
        },
        space: 80,
        draw() {
            
            PP.duos.forEach(function(duo) {
                const yRandom = duo.y;
                const PPdistance = 90;

                const SkyPPX = duo.x;
                const SkyPPY = yRandom;
                contexto.drawImage(
                    sprites,
                    PP.sky.sourceX, PP.sky.sourceY,
                    PP.weight, PP.height,
                    SkyPPX, SkyPPY,
                    PP.weight, PP.height,
                )
    
                const GroundPPX = duo.x;
                const GroundPPY = PP.height + PPdistance + yRandom;
                contexto.drawImage(
                    sprites,
                    PP.ground.sourceX, PP.ground.sourceY,
                    PP.weight, PP.height,
                    GroundPPX, GroundPPY,
                    PP.weight, PP.height,
                )
                
                duo.skyPP = {
                    x: SkyPPX, 
                    y: PP.height + SkyPPY
                }    
                duo.groundPP = {
                    x: GroundPPX,
                    y: GroundPPY,
                }
            })   
        },
        makeColisionFP(duo) {
            const topFP = globals.FP.y;
            const bottomFP = globals.FP.y + globals.FP.height;

            if((globals.FP.x + globals.FP.weight) >= duo.x) {
                if(topFP <= duo.skyPP.y) {
                    return true;
                }    

                if(bottomFP >= duo.groundPP.y) {
                    return true;
                }
            }

            return false;
        },
        duos: [],
        update() {
            const passedFrames = frames % 100 === 0;
            if(passedFrames) {
                PP.duos.push({
                    x: canvas.width,
                    y: -150 * (Math.random() + 1),
                })
            }

            PP.duos.forEach(function(duo) {
                duo.x = duo.x - 2;

                if(PP.makeColisionFP(duo)) {
                    HIT_Sound.play();
                    changeScreen(Screens.Game_Over)
                }

                if(duo.x + PP.weight <= 0) {
                    PP.duos.shift();
                }
            });

        }
    }
    return PP;
}

function colision(FP, GR) {
    const FPy = FP.y + FP.height
    const GRy = GR.y;
    
    if(FPy >= GRy) {
        return true;
    }

    return false;
}

function SC_Create() {
    const SC = {
        score: 0,
        draw() {
            contexto.font = '30px serif',
            contexto.fillStyle = 'white',
            contexto.textAlign = 'right',
            contexto.fillText(`Score ${SC.score}`, canvas.width - 15, 40)
        },
        update() {
            const frameInterval = 10;
            const passedFrames = frames % frameInterval === 0;

            if(passedFrames) {
                SC.score = SC.score + 1;
            }
        },
    }
    return SC;
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
            globals.PP = PP_Create();
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
    initialize() {
        globals.SC = SC_Create();
    },
    draw() {
        BG.draw();
        globals.PP.draw();
        globals.GR.draw();  
        globals.FP.draw();
        globals.SC.draw();
    },
    click() {
        globals.FP.jump()
    },
    update() {
        globals.FP.update();  
        globals.PP.update();
        globals.GR.update();
        globals.SC.update();
    }
}

Screens.Game_Over = {
    draw() {
        gameOver.draw();
    },
    update() {

    },
    click() {
        changeScreen(Screens.Start)
    }
}

function loop() {
    ActiveScreen.draw();
    ActiveScreen.update();

    frames = frames + 1;
    requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
    if(ActiveScreen.click) {
        ActiveScreen.click()
    }
})

changeScreen(Screens.Start)
loop();




