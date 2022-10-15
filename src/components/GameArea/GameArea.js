import { React, useEffect, setState, useState } from "react";
import fields from "../../resources/gamedata";
import GameCell from "../GameCell/GameCell";
import { Context } from "../../context";
import userModel from "../../resources/usermodel";
const GameArea = () => {
  const [gameData, setGameData] = useState(JSON.parse(JSON.stringify(fields)));
  const [userA, setUserA] = useState(JSON.parse(JSON.stringify(userModel)));
  const [userB, setUserB] = useState(JSON.parse(JSON.stringify(userModel)));
  const [currentUserIndex, setCurrentUserIndex] = useState(0);
  const users = [userA, userB];
  const [currentUser, setCurrentUser] = useState(users[currentUserIndex]);
  const [step, setStep] = useState(0);
  const winScore = 9;
  function init() {
    userA.name = localStorage.getItem('userA_name') ? localStorage.getItem('userA_name') : false;
    userA.score = localStorage.getItem('userA_score')? parseInt(localStorage.getItem('userA_score')) : 0;
    userA.role = 0;
    userB.name = localStorage.getItem('userB_name') ? localStorage.getItem('userB_name') : false;
    userB.score = localStorage.getItem('userB_score')? parseInt(localStorage.getItem('userB_score')) : 0;
    userB.role = 1;
    if(! userA.name){
      userA.name = prompt("Please enter your name:", "First User");
      userB.name = prompt("Please enter your name:", "Second User");
    }
    localStorage.setItem('userA_name', userA.name);
    localStorage.setItem('userB_name', userB.name);
    setUserA(userA);
    setUserB(userB);
  }

  useEffect(() => {
    
    init();
  },[]);

  const handleClick = (id) => {
    setStep(step + 1);

    const data = gameData.map((elem) => {
      if (id === elem.id) {
        elem.checked = true;
        elem.value = currentUser.role;
        currentUser.scoreTable[elem.row][elem.cell] = elem.weight;
      }
      return elem;
    });

    setGameData(data);
    checkWin();
  };

  function checkWin() {
    const verticalWinScore = [[3], [9], [15]];
    let win = false;
    // =========================================================================
    // Check win by row
    // =========================================================================
    currentUser.scoreTable.map((row) => {
      let count = row.reduce((prev, current) => {
        return parseInt(prev) + current;
      }, 0);
      if (count == winScore) {
        consoleMessage(currentUser.name + " win by row!");
        win = true;
      }
    });
    // =========================================================================
    // Check by column
    // =========================================================================
    currentUser.scoreTable[0].map((elem, index) => {
      if (
        verticalWinScore[index] ==
        currentUser.scoreTable[0][index] +
          currentUser.scoreTable[1][index] +
          currentUser.scoreTable[2][index]
      ) {
        consoleMessage(currentUser.name + " win by vertical!");
        win = true;
      }
    });
    // =========================================================================
    // Check by diagonal
    // =========================================================================

    if (currentUser.scoreTable[1][1] == 3) {
      if (
        (currentUser.scoreTable[0][0] == 1 &&
          currentUser.scoreTable[2][2] == 5) ||
        (currentUser.scoreTable[0][2] == 5 && currentUser.scoreTable[2][0] == 1)
      ) {
        consoleMessage(currentUser.name + " win by diagonal!");
        win = true;
      }
    }
    const i = currentUserIndex == 0 ? 1 : 0;
    setCurrentUserIndex(i);
    setCurrentUser(users[i]);
    if (win || step == 8) {
      if(win){
        currentUser.score += 1;
        localStorage.setItem('userA_score', userA.score);
        localStorage.setItem('userB_score', userB.score);
      }
      resetGame();
    }
  }

  function consoleMessage(message) {
    console.log(
      "============================== \n" +
        message +
        "\n=============================="
    );
  }

  function resetGame() {
    setTimeout(() => {
      setStep(0);
      setCurrentUserIndex(0);
      setCurrentUser(users[0]);
      const data = gameData.map((elem) => {
        elem.checked = false;
        elem.value = null;
        return elem;
      });
      userA.scoreTable = JSON.parse(JSON.stringify(userModel.scoreTable));
      userB.scoreTable = JSON.parse(JSON.stringify(userModel.scoreTable));
      setGameData(data);
    }, 2000);
  }

  return (
    <Context.Provider value={{}}>
      <div className="game">
        {gameData.map((item) => (
          <GameCell
            key={item.id}
            onClick={() => handleClick(item.id)}
            status={item.checked}
            value={item.value}
          ></GameCell>
        ))}
      </div>
      <div className="scoreArea">
          <h2>{userA.name + ' ( '+ userA.score +' ) : ( ' + userB.score + ' ) ' + userB.name}</h2> 
      </div>
    </Context.Provider>
  );
};

export default GameArea;
