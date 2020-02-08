/* Javascript */
const DIR_LEFT = 3;
const DIR_DOWN = 2;
const DIR_RIGHT = 1;
const DIR_UP = 0;

const SNAKE_SPEED = 100;

const NONE_COLISION = 0;
const FOOD_COLISION = 1;
const SPECIAL_FOOD_COLISION = 2;
const BORDER_COLISION = 3;
const SELF_COLISION = 4;

const MIN_SHOW_TIME_FOOD = 4
const MAX_SHOW_TIME_FOOD = 10

const MIN_SHOW_TIME_SPECIAL_FOOD = 1
const MAX_SHOW_TIME_SPECIAL_FOOD = 5

const FOOD_SIZE = 16;
const SPECIAL_FOOD_SIZE = 28;

SPECIAL_FOOD_TYPE = ['hamburger','carrot','fish','drumstick-bite',
                      'egg','cheese','hotdog','ice-cream', 'pizza-slice']

const COLORS = ['darkmagenta','purple','slateblue','darkslateblue', 
                'firebrick', 'darkred', 'orangered','seagreen', 
                'darkgreen','teal','steelblue','navy','maroon', 'dimgray']
let snake = []

let lastSpecialFoodType = 'hamburger'

let handleTimerMove;

let handleTimerMoveFood;

let handleTimerTurnOnSpecialFood;

let actualDirection = DIR_RIGHT

let isSpecialFood

function config_init() {
    isSpecialFood = false
    setEventHandle()
    snake.push(document.getElementById('snake-head'))
    showFood(isSpecialFood) 
    turnOnSpecialFood().then(resp=>{handleTimerTurnOnSpecialFood=resp})
    move(actualDirection).then(resp=>{handleTimerMove=resp})
}

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

        switch (detectColision()){
            case FOOD_COLISION:
                addSegmentToSnake(1,beforeLeft,beforeTop)
                clearTimerMoveFood()
                showFood(isSpecialFood)
                break;
            case SPECIAL_FOOD_COLISION:

        }

        move(actualDirection).then(resp=>{handleTimerMove=resp})
    
    },SNAKE_SPEED)
}

async function showFood(special=false) {
        let food
        let otherFood
        let foodSize
        let minTime
        let maxTime
        let board = document.getElementById('board')

        if (special) {
            food = document.getElementById('special-food')
            otherFood = document.getElementById('food')
            foodSize = SPECIAL_FOOD_SIZE
            
            food.classList.remove(`fa-${lastSpecialFoodType}`)
            lastSpecialFoodType = SPECIAL_FOOD_TYPE[Math.floor(Math.random() * 9)]
            food.classList.add(`fa-${lastSpecialFoodType}`)
            minTime = MIN_SHOW_TIME_SPECIAL_FOOD
            maxTime = MAX_SHOW_TIME_SPECIAL_FOOD
        } else {
            food = document.getElementById('food')
            otherFood = document.getElementById('special-food')
            foodSize = FOOD_SIZE
            minTime = MIN_SHOW_TIME_FOOD
            maxTime = MAX_SHOW_TIME_FOOD
        }
        
        let left = (Math.floor(Math.random() * (Math.floor(board.offsetWidth/foodSize))-1) + 1) * foodSize
        let top = (Math.floor(Math.random() * (Math.floor(board.offsetHeight/foodSize))-1) + 1) * foodSize
        food.style.color = COLORS[Math.floor(Math.random() * 14)]
        otherFood.style.top = '-50px';
        food.style.left=left + 'px';
        food.style.top=top + 'px';

        document.getElementById('direction').innerHTML = `${left}, ${top}`

        moveFood(minTime,maxTime).then((resp)=>{handleTimerMoveFood=resp; console.log(handleTimerMoveFood)})
}

async function moveFood(minTime, maxTime) {
    let timer = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime
    
    return await setTimeout(()=>{
        showFood(isSpecialFood)
        isSpecialFood = isSpecialFood ? false : isSpecialFood
    },timer * 1000)
}

async function turnOnSpecialFood() {
    let timer = (Math.floor(Math.random() * 60)) + 60 * 1000
    return await setTimeout(() => {
        
        isSpecialFood = true
        turnOnSpecialFood().then((resp)=>{handleTimerTurnOnSpecialFood=resp})
    },timer) ;
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

function clearTimerMoveFood() {
    clearTimeout(handleTimerMoveFood)
}

function clearTimerTurnOnSpecialFruit() {
    clearTimeout(handleTimerTurnOnSpecialFood)
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

    if(snake.filter((v,i)=>{
        if(i!==0) {
            if (v.offsetLeft===head.offsetLeft &&
                v.offsetTop===head.offsetTop) {
                    return true
                }
        }
    }).length>0) {
        return SELF_COLISION
    }
    

    return NONE_COLISION
}

function addSegmentToSnake(number, left, top) {
    let segment = document.createElement('i')
    segment.classList.add('fas')
    segment.classList.add('fa-square')
    segment.classList.add('snake-body')
    segment.style.left = left;
    segment.style.top = top

    document.getElementById('board').appendChild(segment)

    snake.push(segment)
}
