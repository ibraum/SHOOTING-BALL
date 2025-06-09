let preferences = document.getElementById('preferences');
let end = document.getElementById('end');
let score = document.getElementById('points');
let username = document.getElementById('username');
let scorewin = document.getElementById('scorewin');
let points = 0;
let animationId;

let projectiles = [];
let enemies = [];
let particules = [];

var canvas = document.getElementById("screen");
var ctx = canvas.getContext("2d");

const dpr = window.devicePixelRatio || 1;
const rectWidth = 25;
const rectHeight = 25;

canvas.width = innerWidth;
canvas.height = innerHeight;
username.value = localStorage.getItem('username') ? localStorage.getItem('username') : '';


class Player {
    constructor(x, y, radius, color) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
    }

    draw () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();

        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 10, 0, 2 * Math.PI, false);
        ctx.fillStyle = "black";
        ctx.fill();

        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 20, 0, 2 * Math.PI, false);
        ctx.fillStyle = "orange";
        ctx.fill();
    }
}

class Projectile {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 5, 0, 2 * Math.PI, false);
        ctx.fillStyle = 'black';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update () {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Enemie {
    constructor(x, y, radius, color, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
    }

    draw () {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius + 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = "black";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(this.x, this.y, Math.ceil(Math.abs(this.radius - 2)) + 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
    }

    update () {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
    }
}

class Particule {
    constructor(x, y, radius, color, velocity, alpha) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.velocity = velocity;
        this.alpha = alpha;
    }

    draw () {
        ctx.save();
        canvas.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius - 2, 0, 2 * Math.PI, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }

    update () {
        this.draw();
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -= 0.01;
    }
}
    
const player = new Player(canvas.width / 2, canvas.height / 2, 30, 'white');
player.draw()

window.addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - (canvas.height / 2), e.clientX - (canvas.width / 2));
    const velocity = {
        x: Math.cos(angle) * 6,
        y: Math.sin(angle) * 6
    };
    projectiles.push(new Projectile(canvas.width / 2, canvas.height / 2, 10, 'orange', velocity));
});

function animate () {
    animationId = requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    player.draw()
    projectiles.forEach((projectile, pIndex) => {
        projectile.update();
        // console.log("object")

        if (projectile.x + projectile.radius < 0 || projectile.x + projectile.radius > canvas.width || projectile.y + projectile.radius < 0 || projectile.y + projectile.radius > canvas.height) {
            setTimeout(() => {
                projectiles.splice(pIndex, 1);
            }, 0);
        }

        enemies.forEach((enemie, eIndex) => {
            // console.log("Distance : "+ Math.hypot(enemie.x - projectile.x, enemie.y - projectile.y));
            const distEnemiesProjectiles = Math.hypot(projectile.x - enemie.x, projectile.y - enemie.y);
            if ( (distEnemiesProjectiles - projectile.radius - enemie.radius) < 1 ) {
                
                points += enemie.radius * 2;
                score.innerText = Math.ceil(points);
                localStorage.setItem('score', Math.ceil(points)); 

                for (i = 0; i < enemie.radius * 2; i++)
                {
                    particules.push(new Particule(enemie.x, enemie.y, Math.random() * 2 + 2, enemie.color, {x: Math.random() * 5, y: Math.random() * 5}, 1))
                }

                if (enemie.radius - projectile.radius > projectile.radius) {
                    enemie.radius -= projectile.radius
                    gsap.to(enemie, {
                        radius: enemie.radius - projectile.radius
                    });
                    setTimeout(() => {
                        projectiles.splice(pIndex, 1);
                    }, 0);
                } else {
                    setTimeout(() => {
                        enemies.splice(eIndex, 1);
                        projectiles.splice(pIndex, 1);
                    }, 0);
                }
            }
        })
    });
    enemies.forEach(enemie => {
        enemie.update()
        // console.log("enemy - " + enemie.velocity.x + " - " + enemie.velocity.y)
        const distEnemiesPlayer = Math.hypot(player.x - enemie.x, player.y - enemie.y);
        if ( (distEnemiesPlayer - player.radius - enemie.radius) < 1 ) {
            setTimeout(() => {     
                cancelAnimationFrame(animationId);
                endGame();
            }, 0);
        }
    })

    particules.forEach((particule, pIndex) => {
        particule.update()

        if (particule.alpha < 0) {
            particules.splice(pIndex, 1);
        }
    })
}

function spawnEnemies () {
    setInterval(() => {
        const x = Math.random() < 0.5 ? - 5 : canvas.width * (Math.random() + 1);
        const y = Math.random() < 0.5 ? - 5 : canvas.height * (Math.random() + 1);
        const radius = Math.random() * 30 + 20;
        const angle = Math.atan2((canvas.height / 2) - y, (canvas.width / 2) - x);
        const velocity = {
            x: Math.cos(angle) * 1.2,
            y: Math.sin(angle) * 1.2
        };
        const color = `hsl(${Math.random() * 360}, 50%, 50%)`;
        enemies.push(new Enemie(x, y, radius, color, velocity));
    }, 1000);
}

// animate();
// spawnEnemies();
// ctx.fillRect(canvas.width / 2, canvas.height / 2, 25, 25);
// Math.

function startGame(e) {
    e.preventDefault();
    localStorage.setItem('username', username.value);
    projectiles = [];
    enemies = [];
    particules = [];
    preferences.style.display = "none";
    end.style.display = "none";
    animate();
    spawnEnemies();
}

function endGame() {
    scorewin.innerText = localStorage.getItem('score');
    document.getElementById('usernamewin').innerText = localStorage.getItem('username');
    preferences.style.display = "flex";
    end.style.display = "flex";
}

function goHome(e) {
    e.preventDefault();
    end.style.display = "none";
}