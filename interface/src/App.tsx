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

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isActive) return;
      if (event.key >= "0" && event.key <= "9") {
        setInput((prev) => prev + event.key);
      } else if (event.key === "Backspace") {
        setInput((prev) => prev.slice(0, -1));
      } else if (event.key === "Enter") {
        handleOperationClick("=");
      } else if (["+", "-", "*", "/"].includes(event.key)) {
        setInput((prev) => prev + ` ${event.key} `);
      } else if (event.key === "c" || event.key === "C") {
        setInput("");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isActive]);

  const handleButtonClick = (value: string) => {
    setInput(input + value);
  };

  const handleOperationClick = async (operation: string) => {
    if (operation === "=") {
      const [num1, operator, num2] = input.split(" ");
      if (!num1 || !num2 || !operator) return;

      let functionName = "";
      switch (operator) {
        case "+":
          functionName = "add";
          break;
        case "-":
          functionName = "subtract";
          break;
        case "*":
          functionName = "multiply";
          break;
        case "/":
          functionName = "divide";
          break;
        case "^":
          functionName = "power";
          break;
        default:
          return;
      }

      try {
        if (!account) return;

        setTransactionInProgress(true);

        const payload: InputTransactionData = {
          data: {
            function: `${moduleAddress}::calculator_l12::${functionName}`,
            functionArguments: [num1, num2],
          },
        };

        const response = await signAndSubmitTransaction(payload);

        console.log(response);

        const resultData = await client.getAccountResource({
          accountAddress: account?.address,
          resourceType: `${moduleAddress}::calculator_l12::Calculator`,
        });

        console.log(resultData);
        const decodedResult = hexToString(resultData.result.toString());
        setResult(decodedResult.substring(1, decodedResult.length));
      } catch (error) {
        console.error(error);
      } finally {
        setTransactionInProgress(false);
      }
    } else {
      setInput(input + ` ${operation} `);
    }
  };

  const toggleActiveState = async () => {
    setIsActive(!isActive);
    if (!account) return;
    if (!isActive) {
      console.log("Toggling active state: " + isActive);
      const payload: InputTransactionData = {
        data: {
          function: `${moduleAddress}::calculator_l12::create_calculator`,
          functionArguments: [],
        },
      };

      const response = await signAndSubmitTransaction(payload);
      console.log(response);
    }
  };

  const hexToString = (hex: string) => {
    let string = "";
    for (let i = 0; i < hex.length; i += 2) {
      string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
    }
    return string;
  };

  const connectedView = () => {
    return (
      <CenteredWrapper>
        <ToggleButton active={isActive} onClick={toggleActiveState}>
          {isActive ? "Turn Off" : "Turn On"}
        </ToggleButton>
        <CalculatorWrapper>
          {!result && <Display>{input || "0"}</Display>}
          {result && <Display>{result}</Display>}
          <ButtonGrid>
            <Button
              color="#FF6663"
              onClick={() => {
                setInput("");
                setResult("");
              }}
              disabled={!isActive}
            >
              C
            </Button>
            <Button
              color="#FFB399"
              onClick={() => setInput(input.slice(0, -1))}
              disabled={!isActive}
            >
              ←
            </Button>
            {/* <Button color="#FF33FF" onClick={() => setInput(input + '  ')} disabled={!isActive}>^</Button> */}
            <OperationButton
              onClick={() => handleOperationClick("^")}
              disabled={!isActive}
            >
              ^
            </OperationButton>
            <OperationButton
              onClick={() => handleOperationClick("/")}
              disabled={!isActive}
            >
              ÷
            </OperationButton>
            {[7, 8, 9].map((num) => (
              <Button
                key={num}
                color="#FFFF99"
                onClick={() => handleButtonClick(num.toString())}
                disabled={!isActive}
              >
                {num}
              </Button>
            ))}
            <OperationButton
              onClick={() => handleOperationClick("*")}
              disabled={!isActive}
            >
              x
            </OperationButton>
            {[4, 5, 6].map((num) => (
              <Button
                key={num}
                color="#FFCC99"
                onClick={() => handleButtonClick(num.toString())}
                disabled={!isActive}
              >
                {num}
              </Button>
            ))}
            <OperationButton
              onClick={() => handleOperationClick("-")}
              disabled={!isActive}
            >
              -
            </OperationButton>
            {[1, 2, 3].map((num) => (
              <Button
                key={num}
                color="#99FF99"
                onClick={() => handleButtonClick(num.toString())}
                disabled={!isActive}
              >
                {num}
              </Button>
            ))}
            <OperationButton
              onClick={() => handleOperationClick("+")}
              disabled={!isActive}
            >
              +
            </OperationButton>
            <Button
              wide
              color="#FF6663"
              onClick={() => handleButtonClick("0")}
              disabled={!isActive}
            >
              0
            </Button>
            <Button
              color="#66B2FF"
              onClick={() => handleButtonClick(".")}
              disabled={!isActive}
            >
              .
            </Button>
            <OperationButton
              onClick={() => handleOperationClick("=")}
              disabled={!isActive || transactionInProgress}
            >
              =
            </OperationButton>
          </ButtonGrid>
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
