module metaschool::calculator {
    use std::error;
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
        let calculator = Calculator { result: 0 };
        move_to(account, calculator);
        }
    }

    public entry fun add(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
        calculator.result = num1 + num2;

        get_result(account);
    }

    public entry fun subtract(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
        if (num1 > num2){
            calculator.result = num1 - num2;
            get_result(account);

        }
        else {
            calculator.result = num2 - num1;
            get_result(account);

        }
    }

    public entry fun multiply(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
        calculator.result = num1 * num2;

        get_result(account);
    }

    public entry fun divide(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
        if (num2 == 0) {
            abort error::invalid_argument(0)
        } else {
            calculator.result = num1 / num2;
        };

        get_result(account);
    }

    public entry fun power(account: &signer, num1: u64, num2: u64) acquires Calculator {
        let calculator = borrow_global_mut<Calculator>(signer::address_of(account));
        if (num2 == 0) {
            abort error::invalid_argument(0)
        } else {
            let i = 1;
            calculator.result = num1;
            while (i < num2){
                calculator.result = calculator.result * num1;
                i = i + 1;
            }
 
        };

        get_result(account);
    }

    public fun get_result (account: &signer): u64 acquires Calculator {
        let calculator = borrow_global<Calculator>(signer::address_of(account));
        calculator.result
    }
}