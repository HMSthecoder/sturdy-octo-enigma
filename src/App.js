import React, { useState, useEffect } from "react";
import Web3 from "web3";
import AddNumbersContract from "./contracts/AddNumbers.json";

function App() {
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const [sum, setSum] = useState(0);
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");

  useEffect(() => {
    async function loadWeb3() {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum);
        await window.ethereum.request({ method: "eth_requestAccounts" });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const networkId = await web3.eth.net.getId();
        const deployedNetwork = AddNumbersContract.networks[networkId];
        const instance = new web3.eth.Contract(
          AddNumbersContract.abi,
          deployedNetwork && deployedNetwork.address
        );
        setContract(instance);

        const currentSum = await instance.methods.getSum().call();
        setSum(currentSum);
      }
    }
    loadWeb3();
  }, []);

  const handleAdd = async () => {
    if (contract) {
      await contract.methods.add(num1, num2).send({ from: account });
      const updatedSum = await contract.methods.getSum().call();
      setSum(updatedSum);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Simple Addition DApp</h2>
      <p>Connected Account: {account}</p>
      <input
        type="number"
        value={num1}
        onChange={(e) => setNum1(e.target.value)}
        placeholder="Enter first number"
      />
      <input
        type="number"
        value={num2}
        onChange={(e) => setNum2(e.target.value)}
        placeholder="Enter second number"
      />
      <button onClick={handleAdd}>Add Numbers</button>
      <h3>Sum: {sum}</h3>
    </div>
  );
}

export default App;