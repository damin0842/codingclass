//01 html/css 디자인 구성
//02 클릭한 카드 뒤집기
//03 두개의 카드 뒤집기 확인하기(첫번째, 두번째)

const memoryWrap = document.querySelector(".memory__wrap");
const memoryCards = memoryWrap.querySelectorAll(".cards li");
const memoryScoreBoard = document.querySelector(".memory__score");
const memoryTimeBoard = document.querySelector(".memory__time");

let cardOne, cardTwo;
let disableDeck = false;
let matchedCard = 0;
let unMatchedCard = 0;
let memoryScore = 0;
let memoryTime = 40;
let memoryinterval = "";
let sound = [
  "../assets/audio/match.mp3",
  "../assets/audio/unmatch.mp3",
  "../assets/audio/up.mp3",
  "../assets/audio/Jeremy_Black.mp3",
];

let soundMatch = new Audio(sound[1]);
let soundUnMatch = new Audio(sound[0]);
let soundUnSuccess = new Audio(sound[2]);
let soundBG = new Audio(sound[3]);

function reduceTime() {
  memoryTime--;
  memoryTimeBoard.innerHTML = "Time " + memoryTime;
  if (memoryTime == 0) {
    gameOver();
  }
}
function scoreResult() {
  memoryScoreBoard.innerHTML = "Score " + memoryScore;
}

// 카드 뒤집기
function flipCard(e) {
  let clickedCard = e.target;

  if (clickedCard !== cardOne && !disableDeck) {
    clickedCard.classList.add("flip");

    if (!cardOne) {
      return (cardOne = clickedCard);
    }
    cardTwo = clickedCard;
    disableDeck = true;

    let cardOneImg = cardOne.querySelector(".back img").src;
    let cardTwoImg = cardTwo.querySelector(".back img").src;

    matchCards(cardOneImg, cardTwoImg);

    console.log(cardOneImg);
    console.log(cardTwoImg);
  }
}

// 카드 확인 (두개의 이미지 비교)
function matchCards(img1, img2) {
  if (img1 == img2) {
    matchedCard++;
    memoryScore += 12.5;
    scoreResult();
    //일치하는 경우

    soundMatch.play();

    if (matchedCard == 8) {
      gameOver();
    }

    cardOne.removeEventListener("click", flipCard);
    cardTwo.removeEventListener("click", flipCard);
    
    cardOne = cardTwo = "";
    disableDeck = false;
  } else {
    //일치하지 않는 경우(틀린음악. 이미지가 좌우로 흔들림)
    unMatchedCard++;
    memoryScore -= 12.5;
    scoreResult();
    if (unMatchedCard == 4) {
      gameOver();
    }

    setTimeout(() => {
      cardOne.classList.add("shakeX");
      cardTwo.classList.add("shakeX");
    }, 500);

    setTimeout(() => {
      cardOne.classList.remove("shakeX", "flip");
      cardTwo.classList.remove("shakeX", "flip");
      cardOne = cardTwo = "";
      disableDeck = false;
    }, 1500);
    soundUnMatch.play();
  }
}

//카드 섞기
function shuffledCard() {
  cardOne = cardTwo = "";
  disableDeck = false;

  let arr = [1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8];
  let result = arr.sort(() => (Math.random() > 0.5 ? 1 : -1));

  memoryCards.forEach((card, index) => {
    card.classList.remove("flip");

    setTimeout(() => {
      card.classList.add("flip");
    }, 200 * index);

    setTimeout(() => {
      card.classList.remove("flip");
    }, 4000);

    //뒤집은 이미지 불러오기
    let imgTag = card.querySelector(".back img");
    imgTag.src = `../assets/img/img${arr[index]}.svg`;
  });
}
// 카드 클릭
memoryCards.forEach((card) => {
  card.addEventListener("click", flipCard);
});

// 메모리 아이콘 클릭
const memoryIcon = document.querySelector(".memory__wrap");
const memoryIconBtn = document.querySelector(".icon2");
memoryIconBtn.addEventListener("click", () => {
  memoryIcon.classList.toggle("show");
  memoryBox.classList.remove("hide");
  clearInterval(memoryinterval);
  soundBG.pause();
  soundBG.currentTime = 0;

});

const memoryBox = document.querySelector(".memory__box");
const startBtn = document.querySelector(".memory__box .start");

startBtn.addEventListener("click", () => {
  memoryBox.classList.toggle("hide");
  shuffledCard();
  soundBG.play();
  matchedCard = 0;
  unMatchedCard = 0;
  memoryScore = 0;
  clearInterval(memoryinterval);
  scoreResult();
  memoryinterval = setInterval(reduceTime, 1000);
  memoryTime = 40;

  // 카드 클릭
  memoryCards.forEach((card) => {
    card.addEventListener("click", flipCard);
  });
});

function gameOver() {
  memoryBox.classList.remove("hide");
  alert(memoryScore + "점입니다.");
  clearInterval(memoryinterval);
  soundBG.pause();
  soundBG.currentTime = 0;
  matchedCard = 0;
  unMatchedCard = 0;
  memoryScore = 0;
  scoreResult();
}
