# Finverse Test

This is a backend API made for the team at finverse as a coding test.

This project is completely coded in **typescript**.

## API Endpoints

### /api/v1/collect 
- Query Parameters: 
    1. user (String)
- This endpoint works in the following manner
  - Searches the database for the user and password
  - Logs in with the given credentials
  - Collects information from the _Accounts Overview_ page 
  - Collects transaction information from the _Transaction Detail_ page.
  - Stores the collected details in the datavbase

### /api/v1/retrieve
- Query Parameters: 
   1. user (String)
- This endpoint works in the following manner
  -  Searches the database for the user information and presents it. This information includes to previously collected information.

## Schemas

This sections describes the schemas used for storing the data

### Transaction Schema

    transactionDate: String,
    description: String,
    currency: String,
    amount: Number,

### Account Schema

    name: String,
    accountNumber: String,
    currency: String,
    balance: Number,
    reportingCurrency: String,
    reportingBalance: Number,
    transaction: [transactionSchema],

### User Schema

    username: String,
    password: String,
    accounts: [accountSchema],

## Future problems to fix

1. Add testing for function _collectTransactionsData_ and _collectUserData_ 