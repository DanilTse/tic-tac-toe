import { React, useEffect, useState } from "react";
const GameCell = ({ status, value, onClick }) => {
  const [statusLocal, setStatusLocal] = useState(status);
  const [btnClass, setBtnClass] = useState('class');
  const classNames = ['cross','circle'];
 
  return (
    <div className="cell">
      <button
        className={classNames[value]}
        disabled={status}
        onClick={() => {
          onClick();
          setStatusLocal(!statusLocal);
        }}
      ></button>
    </div>
  );
};

export default GameCell;
