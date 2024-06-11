module metaschool::calculator_l12 {
    use std::signer;

    struct Calculator has key {
        result: vector<u8>,  // Result will be of type string 
    }

    public entry fun create_calculator(account: &signer) acquires Calculator {
        if (exists<Calculator>(signer::address_of(account))){
            let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
            calculator.result = b"";  
        }
        else {
            let calculator = Calculator { result: b"" };
            move_to(account, calculator);
        }
    }

    // Add your functions here 🧑‍💻
}
