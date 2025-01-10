import { useEffect, useState } from "react";
import "./App.css";
import SingleCard from "./components/SingleCard";

//카드 이미지는 public폴더에 있음
const cardImages = [
  { src: "/img/helmet-1.png", matched: false },
  { src: "/img/potion-1.png", matched: false },
  { src: "/img/ring-1.png", matched: false },
  { src: "/img/scroll-1.png", matched: false },
  { src: "/img/shield-1.png", matched: false },
  { src: "/img/sword-1.png", matched: false },
];
//리액트 컴포넌트
function App() {
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [topScores, setTopScores] = useState([]);

  //카드 섞기
  const shuffleCards = () => {
    //...은 카드 배열의 모든 요소를 새 배열에 복사 (총2번 12개 카드)
    const shuffledCards = [...cardImages, ...cardImages]
      .sort(() => Math.random() - 0.5)
      .map((card) => ({ ...card, id: Math.random() }));

    setCards(shuffledCards);
    setTurns(0);
  };
  //console.log(cards, turns); //카드섞기 확인

  function handleChoice(card) {
    //카드 선택(이미 첫번째 선택했으면 두번째에 저장)
    choiceOne ? setChoiceTwo(card) : setChoiceOne(card);
  }

  const saveScore = (turns) => {
    const scores = JSON.parse(localStorage.getItem("topScores")) || [];
    scores.push(turns);
    scores.sort((a, b) => a - b);
    const newTopScores = scores.slice(0, 3);
    localStorage.setItem("topScores", JSON.stringify(newTopScores));
    setTopScores(newTopScores);
  };

  //카드 선택 후 비교(두 카드가 같은지 확인),[카드 선택이 변경시]
  useEffect(() => {
    if (choiceOne && choiceTwo) {
      setDisabled(true);
      if (choiceOne.src === choiceTwo.src && choiceOne.id !== choiceTwo.id) {
        setCards((prevCards) => {
          return prevCards.map((card) => {
            if (card.src === choiceOne.src) {
              //console.log("맞췄네요.");
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        //console.log("틀렸네요.");
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [choiceOne, choiceTwo]);
  useEffect(() => shuffleCards(), []);

  useEffect(() => {
    const scores = JSON.parse(localStorage.getItem("topScores")) || [];
    setTopScores(scores);
  }, []);

  useEffect(() => {
    const allMatched = cards.every((card) => card.matched);
    if (allMatched && cards.length > 0) {
      saveScore(turns);
      setTimeout(() => {
        alert(`축하합니다! ${turns}턴 만에 모든 카드를 맞추셨습니다!`);
      }, 500);
    }
  }, [cards, turns]);

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setTurns((prev) => prev + 1);
    setDisabled(false);
  };

  return (
    <div className="App">
      <h1>Magic Match</h1>
      <button onClick={shuffleCards}>New Game</button>
      <div className="card-grid">
        {cards.map((card) => (
          <SingleCard
            handleChoice={handleChoice}
            key={card.id}
            card={card}
            flipped={card === choiceOne || card === choiceTwo || card.matched}
            disabled={disabled}
          />
        ))}
      </div>
      <p>턴수: {turns}</p>
      <div className="top-scores">
        <h3>최고 기록 (턴수)</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          {topScores.map((score, index) => (
            <li key={index}>
              {index + 1}위: {score}턴
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
