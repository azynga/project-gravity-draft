const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

class Scene {
    constructor() {
        // this.playerPositions = [];
    }

    clear() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

class Player {
    constructor() {
        this.starPosition = {
            x: canvas.width / 2,
            y: canvas.height / 2
        };
        this.radius = 10;
        this.position = {
            x: this.starPosition.x,
            y: this.starPosition.y + 100
        }
        this.trailPixels = [];
        this.acceleration = {
            x: 0,
            y: 0
        };
        this.speed = {
            x: 1,
            y: -0.1
        };
        this.starGravity = 80;
        this.abilityActive = false;
    }

    setGravity() {
        const coordinateDiff = {
            x: this.starPosition.x - this.position.x,
            y: this.starPosition.y - this.position.y
        };

        const distance = Math.sqrt(coordinateDiff.x ** 2 + coordinateDiff.y ** 2);
        const angle = Math.atan2(coordinateDiff.y, coordinateDiff.x);

        const gravity = {
            x: (Math.cos(angle) * this.starGravity) / distance ** 2,
            y: (Math.sin(angle) * this.starGravity) / distance ** 2
        };

        this.acceleration.x = gravity.x;
        this.acceleration.y = gravity.y;

        // console.log('Angle: '+angle);
        // console.log('AccX: '+gravity.x);
        // console.log('SpeedX: '+this.speed.x);
        // console.log('AccY: '+gravity.y);
        // console.log('SpeedY:'+this.speed.y);
    }

    applyAcceleration() {
        this.setGravity();
        this.speed.x += this.acceleration.x;
        this.speed.y += this.acceleration.y;

        ctx.beginPath();
        ctx.moveTo(this.position.x, this.position.y);
        ctx.lineTo(
            this.position.x + this.acceleration.x * 8000,
            this.position.y + this.acceleration.y * 8000
        );
        ctx.stroke();
    }

    setNextCoordinates() {
        this.applyAcceleration();
        this.speed.x += this.acceleration.x / 100;
        this.speed.y += this.acceleration.y / 100;
        this.position.x += this.speed.x;
        this.position.y += this.speed.y;
    }

    draw() {
        this.setNextCoordinates();
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('Space: Zero Gravity for 2s', 30, 40);
        ctx.fillText('Command: Double Gravity for 2s', 30, 60);
        ctx.fillText('Option: Reverse Gravity for 2s', 30, 80);
        
        ctx.fillStyle = 'rgb(200, 160, 230)';
        ctx.strokeStyle = 'rgb(200, 160, 230)';
        
        player.trailPixels.map((pixel, index) => {
            // if(index % 10 === 0) {
            //     console.log(pixel);
            // }
            ctx.strokeRect(pixel.x, pixel.y, 2, 2);
        });
        
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        ctx.moveTo(this.starPosition.x, this.starPosition.y);
        ctx.arc(this.starPosition.x, this.starPosition.y, 40, 0, 2 * Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
}

const scene = new Scene();
const player = new Player();

const update = () => {
    scene.clear();
    player.trailPixels.push(player.position);

    
    if(player.trailPixels.length > 300) {
        player.trailPixels.shift();
    }
    // console.log(player.trailPixels)
    player.draw();
    requestAnimationFrame(update);
}

update();

document.addEventListener('keydown', (event) => {
    if(!player.abilityActive){
        const key = event.key;
        const starGravity = player.starGravity;
        player.abilityActive = true;
        
        switch(key) {
            case ' ':
                player.starGravity = 0;
                setTimeout(() => {
                    player.starGravity = starGravity;
                    player.abilityActive = false;
                }, 2000);
                break;
            case 'Meta':
                player.starGravity *= 2;
                setTimeout(() => {
                    player.starGravity = starGravity;
                    player.abilityActive = false;
                }, 2000);
                break;
            case 'Alt':
                player.starGravity *= -1;
                setTimeout(() => {
                    player.starGravity = starGravity;
                    player.abilityActive = false;
                }, 2000);
                break;
        };
    };
});
