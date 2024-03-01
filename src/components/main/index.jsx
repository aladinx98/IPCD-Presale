import React, { useEffect, useState } from "react";
import "./style.css";
// import logo from '../../images/logo.png';
import coin from "../../images/IPCD.png";
// import presale from "../../images/1.png";
// import btm1 from "../../images/3.png";
import f4 from "../../images/icon.png";
import PresaleAbi from "../../Helpers/presaleAbi.json";
import USDTAbi from "../../Helpers/usdtAbi.json";
import TokenModal from "./TokenModal";
import { list } from "../../Helpers/tokenlist";
// import { FiChevronDown } from "react-icons/fi";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import Web3 from "web3";
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";

// import t1 from "../../images/t1.png";
// import r1 from "../../images/r1.png";
// import t2 from "../../images/t2.png";
// import r2 from "../../images/r2.png";
// import t3 from "../../images/t3.png";
// import r3 from "../../images/r3.png";

// import buy from "../../images/buy.png";

const isValid = (regex) => (input) => regex.test(input);
const numberRegex = /^\d*\.?\d*$/;
const isValidNumber = isValid(numberRegex);

function MainSection() {
  const { isConnected, address } = useAccount();
  const cAddress = "0x9396166aaEcC3d03705a524D3053e1709740C191";
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";

  const [totalFundsRaised, setTotalFundsRaised] = useState(0);

  useEffect(() => {
    const fetchTotalFundsRaised = async () => {
      try {
        const presaleContract = new web3.eth.Contract(PresaleAbi, cAddress);
        const fundsRaised = await presaleContract.methods.totalFundsRaised().call();
        setTotalFundsRaised(fundsRaised);
      } catch (error) {
        console.error("Error fetching total funds raised:", error);
      }
    };

    fetchTotalFundsRaised();
  }, []);

  const [data, setData] = useState({
    bnb: "",
    gart: "",
  });
  const [open, setOpen] = useState(false);
  const [currentToken, setCurrentToken] = useState(list[0]);
  const [approvalDone, setApprovalDone] = useState(false);
  const gartVal = currentToken.name === "BNB" ? 208571 : 83;

  const webSupply_Binance = new Web3("https://1rpc.io/bnb");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [timer, setTimer] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const endDate = new Date("2024-03-30T00:00:00Z"); // Set your presale end date here
      const now = new Date();
      const distance = endDate - now;

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimer(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      if (distance < 0) {
        clearInterval(interval);
        setTimer("Presale Ended");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // const processBuy = async () => {
  //   if (!data.bnb || !data.gart) {
  //     toast.error("Please enter the correct value.");
  //     return;
  //   }

  //   try {
  //     const contract = new webSupply_Binance.eth.Contract(PresaleAbi, cAddress);
  //     let bnbValue = webSupply_Binance.utils.toWei(data.bnb.toString());

  //     const transaction = await prepareWriteContract({
  //       address: cAddress,
  //       abi: PresaleAbi,
  //       functionName: "buyIPCD",
  //       value: bnbValue,
  //       from: address,
  //     });

  //     const toastId = toast.loading("Processing transaction...");
  //     const receipt = await writeContract(transaction);

  //     toast.success("Transaction completed successfully", { id: toastId });
  //     setData({ bnb: "", gart: "" });
  //   } catch (error) {
  //     toast.error("Something went wrong with the transaction!");
  //     console.error(error);
  //   }
  // };

  const buyWithUsdt = async () => {
    try {
      const contract = new webSupply_Binance.eth.Contract(PresaleAbi, cAddress);
      let bnbValue = webSupply_Binance.utils.toWei(data.bnb.toString());
      const bnbValueNumber = Number(bnbValue);
      const buyTransaction = await prepareWriteContract({
        address: cAddress,
        abi: PresaleAbi,
        functionName: "buyWithUSDT",
        args: [bnbValueNumber],
        from: address,
      });

      const toastId = toast.loading("Processing Buy Transaction..");
      await writeContract(buyTransaction);

      toast.success("Buy Transaction completed successfully", { id: toastId });
      setData({ bnb: "", gart: "" });

      setTimeout(() => {
        window.location.reload();
      }, 3000);

    } catch (error) {
      toast.error("Something went wrong with the transaction!");
      console.error(error);
    }
  };

  const approveTransaction = async () => {
    try {
      const tokenContract = new webSupply_Binance.eth.Contract(
        USDTAbi,
        usdtAddress
      );
      let bnbValue = webSupply_Binance.utils.toWei(data.bnb.toString());
      const bnbValueNumber = Number(bnbValue);
      const approvalTransaction = await prepareWriteContract({
        address: usdtAddress,
        abi: USDTAbi,
        functionName: "approve",
        args: [cAddress, bnbValueNumber],
        from: address,
      });

      const toastId = toast.loading("Approving transaction...");
      const hash = await writeContract(approvalTransaction);
      toast.loading("Processing Approval Transaction..", { id: toastId });
      await waitForTransaction(hash);
      toast.dismiss(toastId);
      toast.success("Approval completed successfully");
      setApprovalDone(true);
    } catch (error) {
      toast.error("Something went wrong with the transaction!");
      console.error(error);
    }
  };



  return (
    <>
      <br />
      <div className="flex main-section shadow md:shadow-lg">
        <div className="main-section-form card">

          <div className="flex items-center justify-center">
            <h1 span className="head-h1"><span className="head-text">Private Sale</span> Ends in</h1>

          </div>

          <h2 className=" text-size mt-5 relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-white">{timer}</h2>

          <div style={{ textAlign: "center", margin: "1.5em 0" }}>
            <div id="main" className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-1 justify-evenly">
              <div className="w-full md:w-1/2 lg:w-1/3 h-24">
                <a href="" className="btn mb-3 oxanium btn text-white font-medium text-sm dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-800" style={{ opacity: '1', transform: 'none' }}>Current price</a>
                <h2 className="rate">0.012 $</h2>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 h-24">
                <a href="" className="btn mb-3 oxanium btn text-white font-medium text-sm dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800" style={{ opacity: '1', transform: 'none' }}>Next price</a>
                <h2 className="rate">0.024 $</h2>
              </div>
              <div className="w-full md:w-1/2 lg:w-1/3 h-24">
                <a href="" className="btn mb-3 oxanium btn text-white font-medium text-sm dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800" style={{ opacity: '1', transform: 'none' }}>Exchange Price</a>
                <h2 className="rate" >0.050 $</h2>
              </div>
            </div>
          </div>


          <h2 span className="head-h3"><span className="head-text">Fund Raised : {totalFundsRaised}</span></h2>
          <br />
          <p className="mgtp">Pay with</p>
          <div className="input-box">
            <div className="form-group">
              <input
                type="text"
                value={data.bnb}
                className="text-black"
                onChange={(e) => {
                  const val = e.target.value
                    .split("")
                    .filter((el) => isValidNumber(el))
                    .join("");
                  setData({
                    ...data,
                    bnb: val,
                    gart: val * gartVal,
                  });
                }}
              />

              <div className="py-2 px-4 font-semibold">
                <img src={currentToken.icon} alt="snk" />
                <p style={{ color: "black" }}>{currentToken.name}</p>
              </div>
            </div>
          </div>

          <p className="mgtp">You will get</p>
          <div className="input-box">
            <div className="form-group">
              <input
                type="text"
                className="text-black"
                value={data.gart}
                onChange={(e) => {
                  const val = e.target.value
                    .split("")
                    .filter((el) => isValidNumber(el))
                    .join("");
                  setData({
                    ...data,
                    gart: val,
                    bnb: val / gartVal,
                  });
                }}
              />
              <div className="py-2 px-4 text-gray font-semibold ">
                <img src={coin} alt="snk" />
                <p style={{ color: "black" }}>IPCD</p>
              </div>
            </div>
          </div>

          <div>
            <div style={{ textAlign: "center", margin: "1.5em 0" }}>
              {currentToken.name === "USDT" && !approvalDone && (
                <button className="btn mb-3 oxanium btn text-white   font-medium   text-sm     dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-700" style={{ opacity: '1', transform: 'none' }}
                  onClick={approveTransaction}
                >
                  Approve
                </button>
              )}

              {currentToken.name === "USDT" && approvalDone && (
                <button
                  className="btn mb-3 oxanium btn text-white   font-medium   text-sm     dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-700" style={{ opacity: '1', transform: 'none' }}
                  onClick={buyWithUsdt}
                >
                  Buy
                </button>
              )}


            </div>
          </div>
          <div className="smart flex items-center justify-center">
            <img className="img-box" src={f4} />
            <a className="mgtp f-text" href="/" target="_blank"> How to buy Horixon</a>
          </div>
        </div>

        <TokenModal
          open={open}
          setOpen={setOpen}
          handleOpen={handleOpen}
          handleClose={handleClose}
          currentChain={currentToken}
          setCurrentChain={setCurrentToken}
          setData={setData}
        />
      </div >
    </>
  );
}

export default MainSection;
