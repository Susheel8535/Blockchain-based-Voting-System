import React from 'react'
import Image from "next/image";



// INTERNAL IMPORT 
import Style from "./Card.module.css";
//import Style from "../card/card";
import images from "../../assets";



const Card = ({ candidateArray, giveVote }) => {
  // console.log("Card:", Card);
  console.log("Card data:", candidateArray);

  return (
    <div className={Style.card}>
      {(candidateArray || []).map((el, i) => (
        <div className={Style.card_box} key={i}>

          <div className={Style.image}>
            <img src={el[3]} alt="profile" />
          </div>

          <div className={Style.card_info}>
            <h2>
              {el[1]} #{Number(el[2])}
            </h2>

            <p>{el[0]}</p>

            <p>
              Address: {el[6]?.slice(0, 30)}...
            </p>

            <p className={Style.total}>Total Vote</p>
          </div>

          <div className={Style.card_vote}>
            <p>{Number(el[4])}</p>
          </div>

          <div className={Style.card_button}>
            <button
              onClick={() =>
                giveVote({
                  id: Number(el[2]),
                  address: el[6],
                })
              }
            >
              Give Vote
            </button>
          </div>

        </div>
      ))}
    </div>
  );
};

export default Card;