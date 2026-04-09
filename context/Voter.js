import React, { useState, useEffect } from 'react'

import Web3Modal from 'web3modal';
import { ethers } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";
import axios from "axios";
import { useRouter } from "next/router";

// INTERNAL IMPORT 

import { VotingAddress, VotingAddressABI } from "./constants";

// const client = ipfsHttpClient('https://ipfs.infura.io:5001/api/v0')


const fetchContract = (signerOrProvider) =>
    new ethers.Contract(VotingAddress, VotingAddressABI, signerOrProvider);

export const VotingContext = React.createContext();

export const VotingProvider = ({ children }) => {
    const votingTitle = 'My first smart contract app';
    const router = useRouter();
    const [currentAccount, setCurrentAccount] = useState('');
    const [candidateLength, setCandidateLength] = useState('');
    const pushCandidate = [];
    const candidateIndex = [];
    const [candidateArray, setCandidateArray] = useState(pushCandidate);

    // END OF CANDIDATE DAta 

    const [error, setError] = useState('');
    const highestvote = [];

    // -----------VOTER SECTION 

    const pushVoter = [];
    const [voterArray, setVoterArray] = useState(pushVoter);
    const [voterLength, setVoterLength] = useState('');
    const [voterAddress, setVoterAddress] = useState([]);
    


    // ===== CONNECTING METAMASK 

    const checkIfWalletIsConnected = async () => {

        if (!window.ethereum) return setError("Please Install MetaMask");

        const account = await window.ethereum.request({ method: "eth_accounts" });

        if (account.length) {
            setCurrentAccount(account[0]);

        } else {
            setError("Please Install MetaMask & Connect , Reload");

        }
    };

    // ----- CONNECT WALLET 

    const connectWallet = async () => {

        if (!window.ethereum) return setError("Please Install MetaMask");

        const account = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        setCurrentAccount(account[0]);


    };

    // ---- UPLAOD TO IPFS VOTER IMAGE or upload to pinata

    //  const uploadToIPFS = async (file) => {
    //   try {
    //     if (!file) {
    //       console.log("No file provided");
    //       return null;
    //     }

    //     const added = await client.add(file);

    //     const url = `https://ipfs.infura.io/ipfs/${added.path}`;

    //     console.log("Uploaded to IPFS:", url);

    //     return url;

    //   } catch (error) {
    //     console.log("Upload failed:", error);
    //     return null;
    //   }
    // };

    //---------------------

    const uploadToIPFS = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    maxBodyLength: "Infinity",
                    headers: {
                        "Content-Type": "multipart/form-data",
                        pinata_api_key: "3c086dde049ab0990894",
                        pinata_secret_api_key: "f95cb65d61c6bb10b546988a1cc5461f25b99dbcfa0d1967fcb558d776159e29",
                    },
                }
            );

            const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;


            return url;

        } catch (error) {
            console.log("Upload error:", error);
            return null;
        }
    };

    //-----------upload to IPFS Candidate Image 

    const uploadToIPFSCandidate = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);

            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinFileToIPFS",
                formData,
                {
                    maxBodyLength: "Infinity",
                    headers: {
                        "Content-Type": "multipart/form-data",
                        pinata_api_key: "3c086dde049ab0990894",
                        pinata_secret_api_key: "f95cb65d61c6bb10b546988a1cc5461f25b99dbcfa0d1967fcb558d776159e29",
                    },
                }
            );

            const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;


            return url;

        } catch (error) {
            console.log("Upload error:", error);
            return null;
        }
    };

    //------------------CREARTE VOTER 

    const createVoter = async (formInput, fileUrl, router) => {
        try {
            const { name, address, position } = formInput;

            if (!name || !address || !position)
                return setError("Input data is mising ");

            /// Force NERWORK 
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x539" }],
            });

            /// CONNECTING SMART CONTRACT 



            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();

            // const provider = new ethers.providers.Web3Provider(connection);
            const provider = new ethers.BrowserProvider(connection);
            //const signer = provider.getSigner();
            const signer = await provider.getSigner();

            const contract = fetchContract(signer);
            // console.log("Contract:", contract); //  YOUR LINE

            const data = {
                name,
                address,
                position,
                image: fileUrl,
            };

            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data,
                {
                    headers: {
                        pinata_api_key: "3c086dde049ab0990894",
                        pinata_secret_api_key: "f95cb65d61c6bb10b546988a1cc5461f25b99dbcfa0d1967fcb558d776159e29",
                    },
                }
            );

            const url = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;

            const voter = await contract.voterRight(address, name, url, fileUrl);
            voter.wait();

          //  console.log(voter);

            router.push("/voterList");


        } catch (error) {
          //  console.error(error); //  VERY IMPORTANT
            setError("Error in creating voter ");
        }

    };

    // /// ------------------Get Voter DAta 
  const getAllVoterData = async () => {
   try{

   
  
    const web3Modal = new Web3Modal();
    const connection = await web3Modal.connect();

    const provider = new ethers.BrowserProvider(connection);

    const contract = fetchContract(provider);

   // console.log("Frontend using ", contract.target);
   

   const voterListData = await contract.getVoterList();

   setVoterAddress(voterListData);
  
    
   voterListData.map(async (el) =>{

    const singleVoterData = await contract.getVoterdata(el);
    pushVoter.push(singleVoterData);
    
   });
  // VOTER LENGTH
  const voterList = await contract.getVoterLength();
  setVoterLength(Number(voterList));

}
 catch (error) {
    setError("Something went wrong fetching");
 }
   
};


// useEffect(()=>{
//     getAllVoterData();
// },[]);

    /// GIVE VOTE 

    const giveVote = async(id)=>{
        try{
            const voterAddress  = id.address;
            const voterId = id.id;

             const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();

            // const provider = new ethers.providers.Web3Provider(connection);
            const provider = new ethers.BrowserProvider(connection);
            //const signer = provider.getSigner();
            const signer = await provider.getSigner();

            const contract = fetchContract(signer);


            const voteredList =await contract.vote(voterAddress, voterId);
            console.log(voterList);

        }catch (error){
            console.log(error);
        }
    };

    // -----------CANDIDATE SECTION----------


    const setCandidate = async (candidateForm, fileUrl, router) => {
        try {
            const { name, address, age } = candidateForm;

            if (!name || !address || !age)
                return setError("Input data is mising ");

            console.log(name, address, age, fileUrl);


            //-----------------------
            /// Force NERWORK 
            await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x539" }],
            });

            /// CONNECTING SMART CONTRACT 



            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();

            // const provider = new ethers.providers.Web3Provider(connection);
            const provider = new ethers.BrowserProvider(connection);
            //const signer = provider.getSigner();
            const signer = await provider.getSigner();

            const contract = fetchContract(signer);
            // console.log("Contract:", contract); //  YOUR LINE

            const data = {
                name,
                address,
                image: fileUrl,
                age,
            };

            const res = await axios.post(
                "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data,
                {
                    headers: {
                        pinata_api_key: "3c086dde049ab0990894",
                        pinata_secret_api_key: "f95cb65d61c6bb10b546988a1cc5461f25b99dbcfa0d1967fcb558d776159e29",
                    },
                }
            );

            const ipfs = `https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`;

            const candidate = await contract.setCandidate(address, age, name, fileUrl, ipfs);
            candidate.wait();

           console.log(candidate);

           router.push("/");
//-------------------------------------------

        } catch (error) {
          //  console.error(error); //  VERY IMPORTANT
            setError("Error in creating voter ");
        }

    };
 /// GET CANDIDATE DATA 

 //---------------------------
 const getNewCandidate = async()=>{
    try{

         await window.ethereum.request({
                method: "wallet_switchEthereumChain",
                params: [{ chainId: "0x539" }],
            });

            /// CONNECTING SMART CONTRACT 



            const web3Modal = new Web3Modal();
            const connection = await web3Modal.connect();

            // const provider = new ethers.providers.Web3Provider(connection);
            const provider = new ethers.BrowserProvider(connection);
            //const signer = provider.getSigner();
            const signer = await provider.getSigner();

            const contract = fetchContract(signer);

            // ALL CANDIDATE 
            const allCandidate = await contract.getCandidate();
            

            allCandidate.map(async (el) =>{
                const singleCandidateData = await contract.getCandidatedata(el);

                pushCandidate.push(singleCandidateData);
                candidateIndex.push(Number(singleCandidateData[2]));
                

            });
            

            // =======CANDIDATE LENGTH

            const allCandidateLength = await contract.getCandidateLength();
            setCandidateLength(Number(allCandidateLength));

    }catch (error){
        console.log(error);
    }
};
 //------------------------------

 -
 
 useEffect(() =>{
    getNewCandidate();
    console.log(voterArray);
 },[]);


    return (
        <VotingContext.Provider
            value={{
                votingTitle,
                checkIfWalletIsConnected,
                connectWallet,
                uploadToIPFS,
                createVoter,
                getAllVoterData,
                giveVote,
                setCandidate,
                getNewCandidate,
                error,
                voterArray,
                voterLength,
                voterAddress,
                currentAccount,
                candidateLength,
                candidateArray,
                uploadToIPFSCandidate,

            }} >
            {children}
        </VotingContext.Provider>
    );

};


