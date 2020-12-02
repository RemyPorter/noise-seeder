const CELLW = 160;
const CELLH = 90;
const NOISE_SCALE = 0.12;
let field = new Array(CELLW);
for (let x = 0; x < CELLW; x++) {
    field[x] = new Array(CELLH);
}

function buildCells() {
    for (let x = 0; x < CELLW; x++) {
        for (let y = 0; y < CELLH; y++) {
            field[x][y] = abs(noise(x*NOISE_SCALE, y*NOISE_SCALE,frameCount*NOISE_SCALE));
        }
    }
}

function setup() {
    createCanvas(windowWidth, windowHeight);
    buildCells();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
    if (mouseButton == LEFT)
        buildCells();
}

function draw() {
    clear();
    noStroke();
    for (let x = 0; x < CELLW; x++) {
        for (let y = 0; y < CELLH; y++) {
            fill(255*field[x][y]);
            rect(x/CELLW*width, y/CELLH*height, width/CELLW, height/CELLH);
        }
    }
    congealAll();
}

let neighborhood = [-1, 0, 1];
function congeal(x, y) {
    neighborhood.forEach((xx) => {
        neighborhood.forEach((yy) => {
            if((xx == 0 && yy == 0) || x+xx < 0 || x+xx >= CELLW || y+yy < 0 || y+yy >= CELLH) return;
            let dif = field[x][y] - field[x+xx][y+yy];
            if (abs(dif) < 0.01) {

            } else if (abs(dif) < 0.11256) {
                let o = field[x][y] + field[x+xx][y+yy];
                field[x][y] = o/2 + noise(x*NOISE_SCALE,y*NOISE_SCALE,frameCount*NOISE_SCALE)*NOISE_SCALE;
                field[x+xx][y+yy] = o/2;
            } else if (abs(dif) < 0.9) {
                field[x][y] += dif * 0.1;
                field[x+xx][y+yy] -= dif * 0.1;
                field[x][y] = constrain(field[x][y], -1, 1);
                field[x+xx][y+yy] = constrain(field[x+xx][y+yy], -1, 1);                
            } 
        });
    });
}

function congealAll() {
    for (let x = 0; x < CELLW; x++) {
        for (let y = 0; y < CELLH; y++) {
            congeal(x, y);
        }
    }
}