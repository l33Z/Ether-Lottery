import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ethers } from "ethers";
import ContractAbi from "./contract/abi";
const ContractAddress = "0xCCcA5c2Be350402D42dD14075E27EdEa568Bf0F3";

function App() {
  const [accountAddress, setAccountAddress] = useState(
    "0x0000000000000000000000000"
  );
  const [TotalPlayers, setTotalPlayers] = useState(0);
  const [IsOwner, setIsOwner] = useState(false);
  const [winnerSelected, setwinnerSelected] = useState(false);
  const [WinnerIs, setWinnerIs] = useState("");
  const [accountBalance, setAccountBalance] = useState("0.00");
  const [btnState, setbtnState] = useState("Connect Metamask");
  const [PotAmount, setPotAmount] = useState(0);

  var myContratct;
  var provider;
  var signer;

  // ------------------- Handling Account Changing -------------------
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      };
    }
  });

  // ----------------- Handle Account Change ------------------
  const handleAccountChange = async () => {
    setIsOwner(false);
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      const accounts = await provider.send("eth_requestAccounts", []);
      setAccountAddress(accounts[0]);

      setbtnState("Connected");
      toast.success(`Connected To ${accounts[0]}`, {
        position: "bottom-right",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      var balance = await provider.getBalance(accounts[0]);
      balance = ethers.utils.formatEther(balance);
      setAccountBalance(balance);

      myContratct = new ethers.Contract(ContractAddress, ContractAbi, provider);
      var potamount = await myContratct.getPotAmmount();
      potamount = ethers.utils.formatEther(potamount);
      setPotAmount(potamount);

      if (
        accounts[0] ===
        "0x4162DaAa49Cb714d2A059331E3e59e30e7f6f5Ce".toLowerCase()
      ) {
        setIsOwner(true);
        var totalPlayers = await myContratct.TotalPlayers();
        totalPlayers = parseInt(totalPlayers, 16);
        setTotalPlayers(totalPlayers);

        const palyers = await myContratct.players();
        console.log(palyers);
      }

      var lotteryNo = await myContratct.lotteryNumber();
      lotteryNo = parseInt(lotteryNo, 16);

      const winner = await myContratct.getHistory(lotteryNo - 1);

      setwinnerSelected(true);
      setWinnerIs(winner);
    }
  };

  // ------------------- Connect To Metamask -------------------
  const metaConnection = async () => {
    if (window.ethereum) {
      handleAccountChange();
    } else {
      toast.error("Install Metamask First !!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // ----------------- Take Entry ------------------
  const TakeEntry = async () => {
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      myContratct = new ethers.Contract(ContractAddress, ContractAbi, signer);

      const accounts = await provider.send("eth_requestAccounts", []);
      var balance = await provider.getBalance(accounts[0]);
      balance = ethers.utils.formatEther(balance);

      if (balance < 0.05) {
        toast.error("You dont Have Sufficient Fund!!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        return;
      }
      await myContratct.entry({
        value: ethers.utils.parseUnits("0.05", "ether"),
      });
    } else {
      toast.error("Install Metamask First !!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  // ----------------- Pick Winner ------------------
  const PickWinner = async () => {
    if (window.ethereum) {
      try {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        const accounts = await provider.send("eth_requestAccounts", []);
        myContratct = new ethers.Contract(ContractAddress, ContractAbi, signer);

        if (
          accounts[0] !==
          "0x4162DaAa49Cb714d2A059331E3e59e30e7f6f5Ce".toLowerCase()
        ) {
          toast.error("You dont have permission !!", {
            position: "bottom-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          return;
        }

        await myContratct.picWinners();
      } catch (e) {
        console.log(e);
      }
    } else {
      toast.error("Install Metamask First !!", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <ToastContainer
        theme="colored"
        toastStyle={{
          fontSize: "14px",
          color: "#FFFFFF",
          fontFamily: "sans-serif",
        }}
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="Main w-full bg-neutral-800	min-h-screen h-auto flex-col justify-center font-mono text-white">
        <div className="w-full  flex justify-between items-center p-2 border-b border-gray-500 pb-3 px-5">
          <h1 className="text-white text-2xl font-medium tracking-wider	font-serif ">
            🍯 Ether Lottery
          </h1>
          <button
            className="py-2 px-5 text-xl text-black bg-sky-600 transition hover:bg-sky-400 rounded shadow-md"
            onClick={metaConnection}
          >
            {btnState}
          </button>
        </div>

        <div className="InfoSec xl:flex-row flex justify-between w-full flex-wrap  mt-7 flex-col items-center  ">
          <div className="border p-5 xl:w-1/3 xl:ml-5 rounded-md shadow-lg border-gray-500 h-max  m-0 w-11/12">
            <h2 className="mb-3 text-xl">
              Current Pot Ammount : {PotAmount} ETH
            </h2>
            <h2 className="mb-3 text-xl">Entry Price : 0.05 ETH</h2>
            {IsOwner ? (
              <>
                <h2 className="mb-3 text-xl">Total Players : {TotalPlayers}</h2>
                <button
                  onClick={PickWinner}
                  className="text-xl py-2 w-1/2 mr-3 bg-teal-600 transition hover:bg-teal-800 rounded-sm shadow-xl self-center"
                >
                  Pic Winner
                </button>
              </>
            ) : null}
          </div>

          <div className="border overflow-x-hidden p-5 xl:w-auto xl:mr-5 rounded-md shadow-lg border-gray-500 flex-col items-center w-11/12 m-0 mt-5">
            <h2 className="mb-3 text-xl ">
              Account Address : {accountAddress}
            </h2>
            <h2 className="mb-3 text-xl">
              Account Balance : {accountBalance} ETH
            </h2>
            <button
              onClick={TakeEntry}
              className="text-xl w-1/2 py-2 bg-green-600 transition hover:bg-green-800 rounded-sm shadow-2xl self-center"
            >
              Take Entry
            </button>
          </div>
        </div>

        <div className="Winner mt-10 ">
          {winnerSelected ? (
            <div className=" flex flex-col w-full items-center">
              <h1 className="lg:text-3xl text-sm sm:text-xl">
                🎊 Last Lottery Winner Is : {WinnerIs} 🎊
              </h1>
              <img
                src="congo.gif"
                alt="congo"
                className="my-5 rounded-md shadow-2xl w-11/12 sm:w-auto"
              />
            </div>
          ) : (
            <h1 className="text-3xl text-center">
              🤷 Winner Is Not Declared Yet 🤷
            </h1>
          )}
        </div>
      </div>
    </>
  );
}

export default App;
