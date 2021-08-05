import Accounts from "./Accounts";

interface User {
  username: string;
  password: string;
  accounts: Accounts[];
}

export default User;
