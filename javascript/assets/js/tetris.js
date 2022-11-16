const tetrisWrap = document.querySelector(".tetris__wrap");
const playground = tetrisWrap.querySelector(".playground > ul");

// variable
let lows = 20;
let cols = 12;
let TGscore = 0;
let duration = 500;
let tetrisDurationTimeout;
let downInterval;
let tempMovingItem;

let THsound = [
  "../assets/audio/match.mp3",
  "../assets/audio/unmatch.mp3",
  "../assets/audio/up.mp3",
  "../assets/audio/music_audio02.mp3",
];

let THsoundMatch = new Audio(THsound[1]);
let THsoundUnMatch = new Audio(THsound[0]);
let THsoundUnSuccess = new Audio(THsound[2]);
let THsoundBG = new Audio(THsound[3]);
THsoundBG.loop = true;
// 블록 정보
const movingItem = {
  type: "Imino",
  direction: 0, //블록 모양
  top: 0,
  left: 4,
};

//블록 좌표값
const blocks = {
  Tmino: [
    [
      [2, 1],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [1, 2],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [1, 2],
      [0, 1],
      [2, 1],
      [1, 1],
    ],
    [
      [2, 1],
      [1, 2],
      [1, 0],
      [1, 1],
    ],
  ],
  Imino: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [0, 3],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [3, 0],
    ],
  ],
  Omino: [
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ],
  ],
  Zmino: [
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [2, 1],
    ],
    [
      [1, 0],
      [0, 1],
      [1, 1],
      [0, 2],
    ],
  ],
  Smino: [
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
    [
      [1, 0],
      [2, 0],
      [0, 1],
      [1, 1],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [1, 2],
    ],
  ],
  Jmino: [
    [
      [0, 2],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 0],
      [0, 1],
      [1, 1],
      [2, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [0, 1],
      [0, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [2, 1],
    ],
  ],
  Lmino: [
    [
      [0, 0],
      [0, 1],
      [0, 2],
      [1, 2],
    ],
    [
      [0, 0],
      [1, 0],
      [2, 0],
      [0, 1],
    ],
    [
      [0, 0],
      [1, 0],
      [1, 1],
      [1, 2],
    ],
    [
      [0, 1],
      [1, 1],
      [2, 0],
      [2, 1],
    ],
  ],
};
// 시작하기
function init() {
  tempMovingItem = { ...movingItem };
  //renderBlocks();         //블록 출력하기
  generateNewBlock(); //블록 만들기
  tetrisDurationTimeout = setInterval(() => {
    duration += -100;
    duration <= 100 ? clearInterval(tetrisDurationTimeout) : null;
  }, 10000);
}
for (let i = 0; i < lows; i++) {
  prependNewLine(); //블록 라인 만들기
}

//블록 만들기
function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");

  for (let j = 0; j < cols; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playground.prepend(li);
}

//블록 출력하기
function renderBlocks(moveType = "") {
  // const ty = tempMovingItem.type;
  // const di = tempMovingItem.direction;
  // const to = tempMovingItem.top;
  // const le = tempMovingItem.left;

  const { type, direction, top, left } = tempMovingItem;

  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove(type, "moving");
  });

  blocks[type][direction].some((block) => {
    const x = block[0] + left; // 2 0 1 1
    const y = block[1] + top; // 1 0 1 1

    const target = playground.childNodes[y]
      ? playground.childNodes[y].childNodes[0].childNodes[x]
      : null;
    const isAvailable = checkEmpty(target);

    if (isAvailable) {
      target.classList.add(type, "moving");
    } else {
      tempMovingItem = { ...movingItem };
      setTimeout(() => {
        renderBlocks();
        if (moveType === "top") {
          seizeBlock();
        }
      }, 0);

      return true;
    }
    //console.log({playground})
  });
  movingItem.left = left;
  movingItem.top = top;
  movingItem.direction = direction;
}

//블록 감지하기
function seizeBlock() {
  //
  let xx = playground.querySelector("ul > li > ul");
  let xxx = xx.querySelectorAll("li");
  xxx.forEach((e) => {
    if (e.classList.contains("seized")) {
      THgameOver();
      return;
    } else {
    }
  });
  //
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach((moving) => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  });
  checkEmpty();
  checkMatch();
}

// 한줄 제거하기
function checkMatch() {
  const childNodes = playground.childNodes;
  childNodes.forEach((child) => {
    let matched = true;
    child.children[0].childNodes.forEach((li) => {
      if (!li.classList.contains("seized")) {
        matched = false;
      }
    });

    if (matched) {
      child.remove();
      prependNewLine();
      getScore();
    }
  });
  generateNewBlock();
}
//점수넣기
const TGscoreboard = document.querySelector(".tetris__score");
function getScore() {
  TGscore += 10;
  TGscoreboard.innerHTML = `Score ${TGscore}`;
  THsoundMatch.play();
}

// 새로운 블록 만들기
function generateNewBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, duration);

  const blockArray = Object.entries(blocks);
  const randomIndex = Math.floor(Math.random() * blockArray.length);
  movingItem.type = blockArray[randomIndex][0];
  movingItem.top = 0;
  movingItem.left = 6;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}
//빈칸 확인하기
function checkEmpty(target) {
  if (!target || target.classList.contains("seized")) {
    return false;
  }
  return true;
}
//블록 움직이기
function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}
//모양 바꾸기
function changeDirection() {
  const direction = tempMovingItem.direction;
  direction === 3
    ? (tempMovingItem.direction = 0)
    : (tempMovingItem.direction += 1);
  renderBlocks();
}
//빨리 내리기
function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock("top", 1);
  }, 10);
}
//이벤트
document.addEventListener("keydown", (e) => {
  switch (e.keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1);
      break;
    case 38:
      changeDirection();
      break;
    case 32:
      dropBlock();
      break;
    default:
      break;
  }
});

//아이콘 열기
const tetrisIcon = document.querySelector(".tetris__wrap");
const tetrisIconBtn = document.querySelector(".icon1");
tetrisIconBtn.addEventListener("click", () => {
  tetrisIcon.classList.toggle("show");
  TGBox.classList.remove("hide");
  THsoundBG.pause();
  allLiRemove();
  clearInterval(downInterval);
  clearInterval(tetrisDurationTimeout);
});

//게임 시작
const TGstartBtn = document.querySelector(".tetris__start");
const TGBox = document.querySelector(".tetris__box");
TGstartBtn.addEventListener("click", () => {
  TGBox.classList.add("hide");
  TGscore = 0;
  duration = 500;
  allLiRemove();
  clearInterval(downInterval);
  clearInterval(tetrisDurationTimeout);
  init();
  THsoundBG.play();
  TGscoreboard.innerHTML = `Score ${TGscore}`;
});

//게임 종료
function THgameOver() {
  allLiRemove();
  clearInterval(downInterval);
  clearInterval(tetrisDurationTimeout);
  alert(TGscore + "점 입니다.");
  TGBox.classList.remove("hide");
  THsoundBG.pause();
}

//블록초기화
function allLiRemove() {
  let allLi = playground.childNodes;
  allLi.forEach((e) => {
    //console.log(e);
    e.remove();
    prependNewLine();
  });
}
