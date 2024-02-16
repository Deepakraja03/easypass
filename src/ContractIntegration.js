// import Web3 from "web3";
// import Tick from "./abi/Ticket3.json";
// import { ethers } from "ethers";

// const isBrowser = () => typeof window !== "undefined";
// const ethereum = isBrowser() ? window.ethereum : null;

// const TICKET_CONTRACT = "0xb2A300F896b5fBBD4F3Eca66eE06EDC03FF90982";

// export const HOSTEVENT = async ({
//     name,
//     location,
//     totaltickets,
//     price,
//     date,
//     time
// }) => {
//     if (!ethereum) {
//         console.error("Ethereum provider not available.");
//         return;
//     }

//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner();
//     const Role = new ethers.Contract(TICKET_CONTRACT, Tick, signer);
    
//     try {
//         const tokenId = await Role.hostEvent(name, location, totaltickets, price, date, time);
//         console.log("Transaction Hash:", tokenId);
//         return tokenId;
//     } catch (error) {
//         console.error("Error hosting event:", error);
//         throw error;
//     }
// };

// export const GETALLEVENTS = async () => {
//     if (!ethereum) {
//         console.error("Ethereum provider not available.");
//         return;
//     }

//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner();
//     const Role = new ethers.Contract(TICKET_CONTRACT, Tick, signer);
    
//     try {
//         const result = await Role.getAllEvents();
//         return result;
//     } catch (error) {
//         console.error("Error fetching event:", error);
//         throw error;
//     }
// };

// export const VIEWONEEVENT = async(eventId) => {
//     if (!ethereum) {
//         console.error("Ethereum provider not available.");
//         return null;
//     }

//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner();
//     const Role = new ethers.Contract(TICKET_CONTRACT, Tick, signer);

//     try {
//         const result = await Role.viewEvent(eventId);
//         console.log(result);
//         return result;

//     } catch (error) {
//         console.error("Error fetching event details:", error);
//         return null;
//     }
// }

// export const BOOKING = async ({eventId, ticketCount, ticketCostStr}) => {
//     const provider =
//     window.ethereum != null
//       ? new ethers.providers.Web3Provider(window.ethereum)
//       : ethers.providers.getDefaultProvider();
//   const signer = provider.getSigner();
//       const contract = new ethers.Contract(
//         TICKET_CONTRACT ,
//         Tick,
//         signer
//       );
  
//       // Call the payable function, sending the specified Ether value
//       const transactionResponse = await contract.bookTickets(eventId, ticketCount, {
//         value: ticketCostStr,
//       });
  
     
//       return transactionResponse;
 
//   };

//   export const GETUSERTICKETS = async () => {
//     if (!ethereum) {
//         console.error("Ethereum provider not available.");
//         return;
//     }

//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner();
//     const Role = new ethers.Contract(TICKET_CONTRACT, Tick, signer);
    
//     try {
//         const result = await Role.getUserTickets();
//         return result;
//     } catch (error) {
//         console.error("Error fetching event:", error);
//         throw error;
//     }
// };

// export const GETHOSTEVENTS = async () => {
//     if (!ethereum) {
//         console.error("Ethereum provider not available.");
//         return;
//     }

//     const provider = new ethers.providers.Web3Provider(ethereum);
//     const signer = provider.getSigner();
//     const Role = new ethers.Contract(TICKET_CONTRACT, Tick, signer);
    
//     try {
//         const result = await Role.getHostedEvents();
//         return result;
//     } catch (error) {
//         console.error("Error fetching event:", error);
//         throw error;
//     }
// };