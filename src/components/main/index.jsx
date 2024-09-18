import React, { useEffect, useState } from "react";
import "./style.css";
import coin from "../../images/IPCD.png";
import f4 from "../../images/icon.png";
import PresaleAbi from "../../Helpers/presaleAbi.json";
import USDTAbi from "../../Helpers/usdtAbi.json";
import TokenModal from "./TokenModal";
import { list } from "../../Helpers/tokenlist";
import toast from "react-hot-toast";
import { useAccount } from "wagmi";
import Web3 from "web3";
import {
  prepareWriteContract,
  writeContract,
  waitForTransaction,
} from "@wagmi/core";

const isValid = (regex) => (input) => regex.test(input);
const numberRegex = /^\d*\.?\d*$/;
const isValidNumber = isValid(numberRegex);

function MainSection() {
  const { isConnected, address } = useAccount();
  const cAddress = "0x34c7447e4191Efc71c6F9D76C0c39982e8610Cf5";
  const usdtAddress = "0x55d398326f99059fF775485246999027B3197955";

  const [totalFundsRaised, setTotalFundsRaised] = useState(0);



  const [data, setData] = useState({
    bnb: "",
    gart: "",
  });
  const [open, setOpen] = useState(false);
  const [currentToken, setCurrentToken] = useState(list[0]);
  const [approvalDone, setApprovalDone] = useState(false);
  const gartVal = currentToken.name === "BNB" ? 208571 : 83;

  const [bnbBalance, setBnbBalance] = useState(0);
  const [usdtBalance, setUsdtBalance] = useState(0);

  const webSupply_Binance = new Web3("https://1rpc.io/bnb");

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [timer, setTimer] = useState("");

  const checkBalances = async () => {
    try {
      const bnbBalance = await webSupply_Binance.eth.getBalance(address);
      const usdtContract = new webSupply_Binance.eth.Contract(USDTAbi, usdtAddress);
      const usdtBalance = await usdtContract.methods.balanceOf(address).call();

      setBnbBalance(bnbBalance);
      setUsdtBalance(usdtBalance);
    } catch (error) {
      throw new Error(error.message);
    }
  };

  useEffect(() => {
    const fetchTotalFundsRaised = async () => {
      try {
        const presaleContract = new webSupply_Binance.eth.Contract(PresaleAbi, cAddress);
        const fundsRaised = await presaleContract.methods.totalFundsRaised().call();
        setTotalFundsRaised(fundsRaised / 10 ** 18);
      } catch (error) {
        console.error("Error fetching total funds raised:", error);
      }
    };

    fetchTotalFundsRaised();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const endDate = new Date("2024-04-22T00:00:00Z"); // Set your presale end date here
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

  const buyWithUsdt = async () => {
    try {
      const contract = new webSupply_Binance.eth.Contract(PresaleAbi, cAddress);
      let bnbValue = webSupply_Binance.utils.toWei(data.bnb.toString());
      const bnbValueNumber = Number(bnbValue);
      const buyTransaction = await prepareWriteContract({
        address: cAddress,
        abi: PresaleAbi,
        functionName: "buyIPCD",
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
      <div className="flex main-section shadow md:shadow-lg">
        <div className="main-section-form card">

          <div className="flex items-center justify-center">
            <h1 span className="head-h1"><span className="head-text">Private Sale</span> Ends in</h1>

          </div>

          



          <div class="flex flex-wrap justify-center">
            <div class="m-3 relative inline-flex  group">
              <div class="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <div href="#" title="Get quote now" class="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" role="button">$0.012<br />Tier 1</div>
            </div>

            <div class="m-3 relative inline-flex  group">
              <div class="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <div href="#" title="Get quote now" class="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" role="button">$0.024<br />Tier 2</div>
            </div>

            <div class="m-3 relative inline-flex  group">
              <div class="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c] rounded-xl blur-lg group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
              <div href="#" title="Get quote now" class="relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900" role="button">$0.12<br />CEX Price</div>
            </div>
          </div>



          <h2 className=" text-size mt-5 relative w-full text-center text-white transition-colors duration-200 ease-in-out group-hover:text-white">{timer}</h2>
          <h3 span className="head-h3 m-5"><span className="head-text">Fund Raised : {totalFundsRaised} USDT </span></h3>

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
                <button className="btn mb-3 btn text-white font-medium text-sm dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-700"
                  onClick={approveTransaction}
                >
                  Approve
                </button>
              )}

              {currentToken.name === "USDT" && approvalDone && (
                <button
                  className="btn mb-3 btn text-white font-medium text-sm dark:bg-orange-400 dark:hover:bg-orange-500 dark:focus:ring-orange-700"
                  onClick={buyWithUsdt}
                >
                  Buy
                </button>
              )}


            </div>
          </div>
          <div className="smart flex items-center justify-center">
            <img className="img-box" src={f4} />
            <a className="mgtp f-text" href="https://www.youtube.com/watch?v=WTDHV8tmB80" target="_blank"> How to buy IPCD</a>
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
