import React, { useEffect, useMemo, useState } from "react";
import {
  AccountAddressInput,
  Aptos,
  AptosConfig,
  Hex,
  Network,
} from "@aptos-labs/ts-sdk";
import {
  NetworkName,
  InputTransactionData,
  WalletName,
  Wallet,
  useWallet,
} from "@aptos-labs/wallet-adapter-react";
import { WalletSelector } from "@aptos-labs/wallet-adapter-ant-design";
import "@aptos-labs/wallet-adapter-ant-design/dist/index.css";
import styled from "styled-components";

const aptosConfig = new AptosConfig({ network: Network.TESTNET });
const client = new Aptos(aptosConfig);

const moduleName = process.env.REACT_APP_MODULE_NAME;
const moduleAddress = process.env.REACT_APP_MODULE_ADDRESS;

const WindowWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const WalletWrapper = styled.div`
  position: absolute;
  align-items: right;
  right: 10px;
  top: 10px;
  background-color: #f0f0f0;
`;

const CenteredWrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f0f0;
`;

const CalculatorWrapper = styled.div`
  width: 300px;
  padding: 20px;
  background-color: #fff;
  border-radius: 30px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Display = styled.div`
  background-color: #e0e0e0;
  color: black;
  font-size: 18px;
  padding: 20px;
  border-radius: 15px;
  font-weight: bold;
  margin-bottom: 20px;
  text-align: center;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
`;

const Button = styled.button<{
  color?: string;
  wide?: boolean;
  disabled?: boolean;
}>`
  background-color: ${({ color, disabled }) =>
    disabled ? "#c0c0c0" : color || "#d0d0d0"};
  color: ${({ disabled }) => (disabled ? "#888888" : "black")};
  font-size: 24px;
  padding: 20px;
  border: none;
  border-radius: 15px;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  grid-column: ${({ wide }) => (wide ? "span 2" : "span 1")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  &:hover {
    opacity: ${({ disabled }) => (disabled ? "1" : "0.8")};
  }
`;

const OperationButton = styled(Button)`
  background-color: ${({ disabled }) => (disabled ? "#c0c0c0" : "#ff9500")};
  color: ${({ disabled }) => (disabled ? "#888888" : "white")};
`;

const ToggleButton = styled.button<{ active: boolean }>`
  background-color: ${({ active }) => (active ? "#4CAF50" : "#f44336")};
  color: white;
  font-size: 18px;
  padding: 10px 20px;
  border: none;
  border-radius: 15px;
  cursor: pointer;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  &:hover {
    opacity: 0.8;
  }
`;

const App: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [result, setResult] = useState<string>("");
  const [isActive, setIsActive] = useState<boolean>(false);
  const { account, connected, signAndSubmitTransaction } = useWallet();
  const [transactionInProgress, setTransactionInProgress] =
    useState<boolean>(false);

  const toggleActiveState = async () => {
    setIsActive(!isActive);
    if (!account) return;
    if (!isActive) {
      console.log("Toggling active state: " + isActive);
      const payload: InputTransactionData = {
        data: {
          function: `${moduleAddress}::${moduleName}::create_message`,
          functionArguments: [],
        },
      };

      const response = await signAndSubmitTransaction(payload);
      try {
        if (!account) return;

        setTransactionInProgress(true);

        const resultData = await client.getAccountResource({
          accountAddress: account?.address,
          resourceType: `${moduleAddress}::${moduleName}::Message`,
        });

        console.log("Result Data : ", resultData);
        setResult(resultData.my_message);
      } catch (error) {
        console.error(error);
      } finally {
        setTransactionInProgress(false);
      }
    }
  };

  const connectedView = () => {
    return (
      <CenteredWrapper>
        <ToggleButton active={isActive} onClick={toggleActiveState}>
          {isActive ? "Turn Off" : "Turn On"}
        </ToggleButton>
        <CalculatorWrapper>
          {!isActive && <Display>{input || "Calculator is OFF"}</Display>}
          {isActive && <Display>{result}</Display>}
        </CalculatorWrapper>
      </CenteredWrapper>
    );
  };

  const notConnectedView = () => {
    return (
      <WindowWrapper>
        <h1>Please connect your wallet to continue</h1>
      </WindowWrapper>
    );
  };

  return (
    <WindowWrapper>
      <WalletWrapper>
        <WalletSelector />
      </WalletWrapper>
      {connected ? connectedView() : notConnectedView()}
    </WindowWrapper>
  );
};

export default App;
