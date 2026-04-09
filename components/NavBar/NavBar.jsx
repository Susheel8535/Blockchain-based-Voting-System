import React, { useState, useContext } from 'react';
import Image from "next/image";
import Link from "next/link";
import { AiFillLock, AiFillUnlock } from "react-icons/ai";

// INTERNAL IMPORT
import { VotingContext } from "../../context/Voter";
import Style from './NavBar.module.css';
import loading from '../../assets/loading.gif';

const NavBar = () => {
  const { connectWallet, error, currentAccount } = 
  useContext(VotingContext);
  const [openNav, setOpenNav] = useState(true);

  const openNavigation = () =>{
    if(openNav){
        setOpenNav(false)
    }else if(!openNav){
        setOpenNav(true)

    }
    
  }
  return (
  <div className={Style.navbar}>
    {error === "" ? (
        ""
    ):(
        <div className={Style.message_box}>
            <div className={Style.message}>
             <p>{error}</p>    
            </div>
        </div>
    )}
    <div className={Style.navbar_box}>
     <div className={Style.title}>
        <Link href={{pathname: '/'}}>
        <Image src={loading} alt="logo" width={80}
        height={80} />
        </Link>
        </div>  
          <div className={Style.connect}>
           {currentAccount ? (
             <div>
               <div classsName={Style.connect_flex}>
                <button onClick={()=> openNavigation()}>
                    {currentAccount.slice(0,10)}..
                </button>
                {currentAccount && (
                    <span>{openNav ? (
                        <AiFillUnlock onClick={()=> openNavigation()} />
                    ): (
                       < AiFillLock onClick={()=> openNavigation()} />
                    
                    )}</span>
                )}
               </div>
               
                {openNav && (
                    <div className={Style.navigation}>
                        <p>
                            <Link href={{ pathname: "/"}}>Home </Link>
                        </p>
                         <p>
                            <Link href={{ pathname: "candidate-registration"}}>
                             candidate Registration
                            </Link>
                        </p>
                         <p>
                            <Link href={{ pathname: "allowed-voters"}}>
                             voter Registration
                            </Link>
                        </p>
                          <p>
                            <Link href={{ pathname: "voterList"}}>
                             voter List
                            </Link>
                        </p>
                    </div>
               ) }

            </div>
           ) : (
            <button onClick={()=> connectWallet()} >
                connect Wallet </button>
           )}
         </div>
     </div>
  </div>
  )
};

export default NavBar;