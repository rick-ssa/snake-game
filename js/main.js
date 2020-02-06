/* Javascript */
const DIR_LEFT = 0;
const DIR_DOWN = 1;
const DIR_RIGHT = 2;
const DIR_UP = 3;
const SNAKE_SPEED = 100;

let handleTimerMove;

let actualDirection = DIR_RIGHT

async function move(direction){
    return await setTimeout(()=>{
        const head = document.getElementById('snake-head')
        switch (direction) {
            case DIR_RIGHT:
                head.style.left = head.offsetLeft + 16 + 'px';
                break;
            case DIR_LEFT:
                head.style.left = head.offsetLeft - 16 + 'px';
                break;
            case DIR_DOWN:
                head.style.top = head.offsetTop + 16 + 'px';
                break;
            case DIR_UP:
                head.style.top = head.offsetTop - 16 + 'px';
                break;
        }
        
        move(actualDirection).then(resp=>{handleTimerMove=resp})
    
    },SNAKE_SPEED)
}

async function showFood(special) {
        let food
        if (special) {
            food = document.getElementById('special-food')
        } else {
            food = document.getElementById('food')
        }
        
        let left = (Math.floor(Math.random() * 24) + 1) * 16
        let top = (Math.floor(Math.random() * 24) + 1) * 16
        food.style.left=left + 'px';
        food.style.top=top + 'px';
        hideFood(special) 
}

async function hideFood(special) {
    let timer = Math.floor(Math.random() * 7) + 4
    
    return await setTimeout(()=>{
        showFood(special)
    },timer * 1000)
}

function setEventHandle() {
    
    document.addEventListener("keydown",(e)=>{
        
        const head = document.getElementById('head')
        clearTimerMove()
        switch (e.key) {
            case 'ArrowRight':
                clearRotateHead()
                head.classList.add('fa-rotate-90')
                actualDirection = DIR_RIGHT
                break;
            case 'ArrowDown':
                clearRotateHead()
                head.classList.add('fa-rotate-180')
                actualDirection = DIR_DOWN
                break;
            case 'ArrowLeft':
                clearRotateHead()
                head.classList.add('fa-rotate-270')
                actualDirection = DIR_LEFT
                break;
            case 'ArrowUp':
                actualDirection = DIR_UP
                clearRotateHead()
                break;
        }
        move(actualDirection).then(resp=>{handleTimerMove=resp})
    })
}

function clearTimerMove() {
    clearTimeout(handleTimerMove)
}

function clearRotateHead() {
    const head = document.getElementById('head')
    if (head.classList.contains('fa-rotate-90')) {
        head.classList.remove('fa-rotate-90')
    }
    if (head.classList.contains('fa-rotate-180')) {
        head.classList.remove('fa-rotate-180')
    }

    if (head.classList.contains('fa-rotate-270')) {
        head.classList.remove('fa-rotate-270')
    }
}