/* Javascript */
const DIR_LEFT = 3;
const DIR_DOWN = 2;
const DIR_RIGHT = 1;
const DIR_UP = 0;

const SNAKE_SPEED = 500;

const NONE_COLISION = 0;
const FOOD_COLISION = 1;
const SPECIAL_FOOD_COLISION = 2;
const BORDER_COLISION = 3;


let snake = []

let handleTimerMove;

let actualDirection = DIR_RIGHT

async function move(direction){
    
    return await setTimeout(()=>{
        let head = snake[0]
        let beforeLeft = head.style.left
        let beforeTop = head.style.top
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

        snake = snake.map((v,i)=>{
            if(i!==0) {
                let tempL = v.style.left
                let tempT = v.style.top
                v.style.left = beforeLeft
                v.style.top = beforeTop

                beforeLeft = tempL
                beforeTop = tempT
            }
            return v
        })

        document.getElementById('colision').innerHTML = 'colisão: ' + detectColision();
        document.getElementById('direction').innerHTML = 'direção: ' + actualDirection
        
        move(actualDirection).then(resp=>{handleTimerMove=resp})
    
    },SNAKE_SPEED)
}

async function showFood(special=false) {
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

function config_init() {
    setEventHandle()
    snake.push(document.getElementById('snake-head'))
    showFood() 
    move(actualDirection).then(resp=>resp).then(resp=>{handleTimerMove=resp})
}

function setEventHandle() {
    
    document.addEventListener("keydown",(e)=>{
        
        const head = snake[0]
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
    const head = snake[0]
    
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

function detectColision(){
    let food = document.getElementById('food')
    let head = snake[0]
    let specialFood = document.getElementById('special-food')
    let board = document.getElementById('board')

    if (head.style.left === food.style.left && 
        head.style.top === food.style.top ) {
            return FOOD_COLISION;
    }

    if ((head.offsetLeft >= specialFood.offsetLeft && head.offsetLeft <= specialFood.offsetLeft + 28) && 
        (head.offsetTop >= specialFood.offsetTop && head.offsetTop <= specialFood.offsetTop + 28)) {
            return SPECIAL_FOOD_COLISION
    }

    if(head.offsetLeft === board.offsetLeft ||
       head.offsetTop === board.offsetTop ||
       head.offsetLeft + 16 === board.offsetWidth ||
       head.offsetTop + 16 === board.offsetHeight) {
            return BORDER_COLISION
    }
    

    return NONE_COLISION
}