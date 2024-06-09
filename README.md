# Instructions - 1

- Clone the repository once by running : `git clone https://github.com/boneycanute/Building-on-Aptos.git`
- cd into the projector folder by running `cd Building-on-Aptos`
- Multiple branches are already present containing code for the required lessons.
- To view all available branches run : `git branch`
- Use the code branch of the specfic lesson by running : `git checkout <branchName>`

## Lesson Specific instructions

- Update the module address with your wallet address in the Move.toml file
- cd into project folder and `run aptos init`
  - Select testnet as your network
  - Provide private key when prompted
- Publilsh the contract by running aptos move publish
- cd into the interface folder
- Set the REACT_APP_MODULE_ADDRESS variable in .env file with your wallet address
- Run `npm install`
- Launch the app using `npm start`
