import './App.css';
import { useState, useEffect } from 'react';//useeffect for events
import { ethers } from 'ethers'; //have to install ethers
import  Contract from './Greeter.sol/Greeter.json';
//have to install ethers
function App() {
  const { ethereum } = window; //means window.ethereum ....INPUT WINDOW IN THIS WINDOW
  const [btn,setBtn]=useState('Connect to Wallet'); //btn is the state variable and setBtn is the function to change the state variable
  const [balance,setBalance]=useState('Not Connected !');
  const [address, setAddress] = useState('Not Connected !');
  const [greeting, setGreeting] = useState('');


  const cnctaddress=process.env.REACT_APP_CONTRACT_ADDRESS;

  const alchemyprovider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_RPC_URL);
  const walletprovider = new ethers.providers.Web3Provider(ethereum);
  const ABI= Contract.abi;

  const getContractData =new ethers.Contract(cnctaddress,ABI , alchemyprovider);
  const getContracttx =new ethers.Contract(cnctaddress,ABI , (walletprovider.getSigner()));



//evnts using useeffect hook used to show instant changes in wallet without refreshing
  useEffect(() => {
    //accountschanged event is used for instant change in account and balance
    ethereum.on('accountsChanged', (accounts) => {
      setAddress(accounts[0]);
      //due to await it will wait for the function to complete and then set the balance
      const getbal= async () => {
        const balance= await ethereum.request({ method: 'eth_getBalance', params: [accounts[0],'latest'] })
        setBalance(ethers.utils.formatEther(balance));
      }
      getbal();

    })
//chainchanged event is used for instant change in network
    ethereum.on('chainChanged', (chainId) => {
      console.log(chainId);
      
    })
  })




//FUNCTION TO CONNECT TO WALLET AND GET ACCOUNT ADDRESS and balance
  const requestConnect = async () => {
   const account= await ethereum.request({ method: 'eth_requestAccounts', params: [] });
   const balance= await ethereum.request({ method: 'eth_getBalance', params: [account[0],'latest'] });
   console.log(account);
    setAddress(account[0]);
    setBtn('Connected');
    setBalance(ethers.utils.formatEther(balance));
  }


//FUNCTION TO DISCONNECT FROM WALLET
  // const requestDisconnect = async () => {
  //   const account= await ethereum.request({ method: 'eth_getBalance', params: [] });
  //  } 



//FUNCTION TO add NETWORK
const addChain = async () => {
  const chainId= await ethereum.request({ method: 'wallet_addEthereumChain', params: [
    {
      // thik thak kre pass krte hbe params e nahole error asbe
      chainId: '0x13881',
      chainName: 'Polygon Testnet',
      nativeCurrency: {
        name: 'MATIC',
        symbol: 'MATIC',
        decimals: 18
      },
      rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
      blockExplorerUrls: ['https://mumbai.polygonscan.com/']
    }
  ] });
  console.log(chainId);

}
//FUNCTION TO SWITCH previously added NETWORK
const switchChain = async () => {
  await ethereum.request({ method: 'wallet_switchEthereumChain', params: [  
    {
      chainId: '0xaa36a7',//switch to sepoila
    }
  ] })
};

//send transaction using react and metamask
const sendTransaction = async () => {
  const tx= await ethereum.request({ method: 'eth_sendTransaction', params: [
    {
      to: '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199',
      from: address,
      // value: '0x470DE4DF820000', //have to put hexa value after 0x
      value: `0x${(parseInt(ethers.utils.parseEther('0.1'))).toString(16)}`,  //give the value in ether and it will convert it to wei
      chainId: '0xaa36a7'
    }
  ] });
  console.log(tx);
}

//get greeting
const getgreeting = async () => {
  const data= await getContractData.greet();
  console.log(data);
  setGreeting(data);
}
//set greeting
const setgreetingdata = async () => {
  const data2= await getContracttx.setGreeting('welcome, Debjit Purohit WEB3 Developer');
  console.log(data2);
  // setGreeting(data2.from);
}




  return (
    <div className="App">
      <header className="App-header">

        <a 
          className="connectButton"
          onClick={requestConnect}
        >
         {btn}
        </a>
        <p >Your Wallet Address :<span className='cnct'> {address}</span></p>
        <p>Your Balance : <span className='cnct'>{balance} </span>ETH </p>
        <a
          className="connectButton"
          onClick={addChain}
          style={{marginBottom:'20px'}}
          
        >
         Add New Network
        </a>
        <a 
          className="connectButton"
          onClick={switchChain}
          style={{marginBottom:'20px'}}
          
          
        >
         Switch to added Network
        </a>
        <a 
          className="connectButton"
          onClick={sendTransaction}
          style={{marginBottom:'20px'}}
        >
         Send Transaction
        </a>
        <a 
          className="connectButton"
          onClick={getgreeting}
          style={{marginBottom:'20px'}}
        >
         Get Greeting
        </a>
        <a 
          className="connectButton"
          style={{marginBottom:'20px'}}
          onClick={setgreetingdata}
        >
         Set Greeting
        </a>
        <a 
          className="connectButton"
        >{greeting}
        </a>
      </header>
    </div>
  );
}

export default App;

// deployed address---0x5FbDB2315678afecb367f032d93F642f64180aa3
