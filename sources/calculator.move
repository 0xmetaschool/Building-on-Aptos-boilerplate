module metaschool::calculator {
    use std::signer;

    struct Calculator has key {
         result: u64,
    }

    public entry fun create_calculator(account: &signer) acquires Calculator {
        if (exists<Calculator>(signer::address_of(account))){
            let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
            calculator.result = 0;
        }
        else {
            let calculator = Calculator {  result: 0 };
            move_to(account, calculator);
        }
    }

    public entry fun add(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
        // add code here 🚀

        get_result(account);
    }

     public entry fun subtract(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
        // add code here 🚀

        get_result(account);
    }

    public entry fun multiply(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
         // add code here 🚀

        get_result(account);
    }

    public entry fun divide(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
         // add code here 🚀

        get_result(account);
    }

    public entry fun power(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
         // add code here 🚀

        get_result(account);
    }

    public fun get_result(account: &signer): vector<u8> acquires Calculator {
        let calculator = borrow_global<Calculator>(signer::address_of(account));
        calculator.result
    }
}
