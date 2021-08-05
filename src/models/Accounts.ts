import Transaction from "./Transactions";

interface Account {
  name: string;
  accountNumber: string;
  currency: string;
  balance: number;
  reportingCurrency: string;
  reportingBalance: number;
  transaction: Transaction[];
}

export default Account;
