# Payment System

This project is a RESTful API built with **Node.js**, **Fastify**, **Prisma ORM**, and **Zod**. It manages user accounts and allows financial transactions between them. The API stores information about accounts and transactions, offering endpoints for account creation, balance viewing, and executing transactions between different user accounts.

The main goal of this API is to simulate a basic payment system between accounts, developed as part of a [technical challenge](https://github.com/PicPay/picpay-desafio-backend). In addition to being a practical solution, the project serves as a foundation for learning and improving backend skills, covering important concepts like system architecture, code best practices, performance optimization, queue management, and retry mechanisms. The payment context was chosen to make the challenge more interesting, but all the code can be reused and adapted for other types of financial or transactional operations.

## 1. About this project

This project is part of my personal portfolio, and I would greatly appreciate any feedback on the code, structure, or any other aspect that could help me become a better developer!

Feel free to contact me:

- **Email**: [mateuscelestinofreacker@gmail.com](mailto:mateuscelestinofreacker@gmail.com)
- **LinkedIn**: [Connect with me](https://www.linkedin.com/in/mateus-nelito)

Additionally, you are welcome to use this project however you'd like, whether for learning, improving it, or even for commercial purposes.

## 2. Getting started

To start using the Payment System API, follow the instructions below.

### Prerequisites

Before installing the project, ensure that you have the following item installed in your environment:

- **Node.js** (version 20.14.0 or higher)

### Installation

Follow the steps below to set up the project on your local machine:

1. **Clone the repository**:

   ```bash
   git clone https://github.com/mateusnelito/payment-system-backend.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd payment-system-backend
   ```

3. **Install the dependencies**:

   ```bash
   npm install
   ```

4. **Set up the environment**:

   - Create a `.env` file in the root of the project using the `.env.example` file as a template. Make sure that the environment variables are correctly set.

5. **Run the database migrations**:

   ```bash
   npm run db:migrate
   ```

6. **Seed the database with initial data**:

   ```bash
   npm run db:seed
   ```

   > **Note**: If you encounter an error in the log with the message **"Error: email or bi already exists."**, run the following command to reset the database, then run the seed command again:
   >
   > ```bash
   > npm run db:reset
   > ```

7. **View the database**:

   - You can use any database manager of your choice to access the database. If you don’t have one installed, you can run the following command to open Prisma Studio:

   ```bash
   npm run db:studio
   ```

   After running the command, Prisma Studio should automatically open in the browser. If it doesn't, you can **Ctrl+click** on the link to open it or copy and paste the link into your browser’s address bar. To stop the service and server, press **Ctrl + C** in the terminal.

8. **Start the server**:

   ```bash
   npm run start
   ```

Once the installation steps are complete, the API will be running at the default URL `http://localhost:3000/api`, unless the port has been changed. You can then start making calls to the defined endpoints.

## 3. Endpoints

The Payment System API provides the following endpoints for interacting with the data.

### 1. Users

- **Create user**: `POST /users`

  - **Request body**:
    ```json
    {
      "fullName": "User Name",
      "bi": "000000000LA000",
      "email": "email@example.com",
      "password": "Password@1234",
      "account": {
        "type": "COMMON",
        "initialBalance": 10000
      }
    }
    ```
  - **Response**:
    - **201 Created**: User created successfully.
    - **400 Bad Request**: Invalid data (e.g., invalid bi).
    - **409 Conflict**: Existing data (e.g., email already exists).

- **View user**: `GET /users/:userId`
  - **Parameters**:
    - `userId` (string): ID of the user to view.
  - **Response**:
    - **200 OK**: Returns user information.
    - **404 Not Found**: User not found.

### 2. Accounts

- **Create account**: `POST /users/:userId/accounts`

  - **Request body**:
    ```json
    {
      "type": "MERCHANT"
    }
    ```
  - **Response**:
    - **201 Created**: Account created successfully.
    - **404 Not Found**: User not found.
    - **409 Conflict**: User already has this type of account.

- **View accounts**: `GET /users/:userId/accounts`

  - **Parameters**:
    - `userId` (string): ID of the user whose accounts will be viewed.
  - **Response**:
    - **200 OK**: Returns a list of user accounts.
    - **404 Not Found**: User not found.

- **View account**: `GET /accounts/:accountId`
  - **Parameters**:
    - `accountId` (string): ID of the account to view.
  - **Response**:
    - **200 OK**: Returns account information.
    - **404 Not Found**: Account not found.

### 3. Transactions

Transactions can only be made between **COMMON** and **MERCHANT** accounts. Transactions from **MERCHANT** accounts to any other type are not allowed.

- **Create transaction**: `POST /transactions`

  - **Request body**:
    ```json
    {
      "fromAccountId": "QqKUVZYgp6LNZDrAUEGuw",
      "toAccountId": "FdRQxOLCEefpKxCVTeEKC",
      "amount": 100
    }
    ```
  - **Response**:
    - **201 Created**: Transaction completed successfully.
    - **400 Bad Request**: Invalid data (e.g., insufficient balance).
    - **403 Forbidden**: Unauthorized transaction.
    - **404 Not Found**: Source or destination account not found.

- **View transactions**: `GET /accounts/:accountId/transactions`
  - **Parameters**:
    - `accountId` (string): ID of the account whose transactions will be viewed.
  - **Response**:
    - **200 OK**: Returns a list of account transactions.
    - **404 Not Found**: Account not found.

## 4. Database

The project uses **Prisma ORM** to manage the Payment System database, which is configured with **SQLite** by default. Below is the database schema diagram, illustrating the entities and relationships between them:

![Database Diagram](./assets/database-diagram.svg)

### Entity Descriptions

- **Users**: Stores information about users, such as full name, BI, email, and password.
- **Accounts**: Represents accounts associated with users, containing account type (referenced in the **AccountTypes** table) and balance.
- **AccountTypes**: Defines the allowed account types in the system, currently being `COMMON` and `MERCHANT`.
- **Transactions**: Records transactions between accounts, including the source account ID, destination account ID, and transaction amount.

For more details on the business rules and technical specifications, refer to the [official technical challenge](https://github.com/PicPay/picpay-desafio-backend).

## 5. Handling Monetary Values

To ensure precision and avoid truncation errors, the `balance` and `amount` values are stored as integers, representing the smallest unit of the currency. Thus, a value of 1,000 in any currency is stored as `100000` (i.e., 1,000 cents).

### Displaying Values

When consuming these values on the front-end or displaying them in a more readable format, the cents need to be converted to the main currency unit. To do this, divide the value by 100 and format it with two decimal places.

### Example in JavaScript

```javascript
// Value in cents
const balanceInCents = 100000; // Represents 1,000 (e.g., 1,000 kwanzas)

// Function to format the value in Kwanza
function formatCurrency(cents) {
  const kwanzas = cents / 100;
  return `Kz ${kwanzas.toFixed(2)}`; // Returns the formatted value with two decimal places
}

// Displaying the formatted balance
console.log(`Balance: ${formatCurrency(balanceInCents)}`); // Balance: Kz 1000.00

// To send values to the backend, convert to cents
const amountInKwanza = 75.25; // 75.25 kwanzas
const amountInCents = Math.round(amountInKwanza * 100); // Convert to cents
console.log(`Amount to be sent: ${amountInCents} cents`); // Amount to be sent: 7525 cents
```

##

6.  Roadmap / Next Steps

The project is constantly evolving, focusing on continuous learning and adding features to enhance the robustness and best practices in backend development. Below are the next planned steps for the payment system's development, organized to facilitate gradual learning:

1. **Swagger Documentation**

   - **Goal**: Automate and provide documentation for the API endpoints.
   - **Step**: Implement **Swagger** integration to generate automatic API route documentation, allowing users to view requests and possible responses, as well as to test the endpoints directly via the graphical interface.

2. **Include `status` and `transactionType` Fields**

   - **Goal**: Categorize transactions and improve auditing.
   - **Step**: Add `status` (for audit tracking) and `transactionType` (to indicate whether it’s a debit or credit transaction) fields to the transaction entity. This will help monitor the transaction state and provide insights into financial flow.

3. **Authentication and Authorization**

   - **Goal**: Include authentication to protect endpoints, ensuring only authenticated users can perform financial operations.
   - **Step**: Implement JWT (JSON Web Tokens) authentication to control access to API resources, and ensure only authorized transactions can occur between accounts.

4. **Transaction Limits**

   - **Goal**: Introduce rules to limit the number of daily transactions or the total amount allowed per account.
   - **Step**: Add validations to control the transaction limit per day and/or the maximum amount that can be transferred, based on the account type or specific business rules.

5. **Queue Management and Retry**

   - **Goal**: Improve the system’s resilience and performance.
   - **Step**: Implement a queue for transaction management, handling transaction failures and integrating retry mechanisms to ensure operations are processed reliably.

6. **Logs and Monitoring**

   - **Goal**: Facilitate debugging and monitoring of the API in production.
   - **Step**: Add a solution for structured logs and integrate monitoring tools to track system performance and detect issues in real-time.

7. **Automated Testing**

   - **Goal**: Ensure code quality and robustness through testing.
   - **Step**: Create an automated test suite with **Jest** or **Mocha**, covering the system’s main functionalities (unit tests, integration tests, etc.).

8. **Support for Multiple Currencies**

   - **Goal**: Make the system flexible to support transactions in different currencies.
   - **Step**: Adapt the account and transaction model to support multiple currencies and allow value conversion when needed.

9. **Security Best Practices**

   - **Goal**: Implement recommended security practices to ensure the system is secure against common attacks.
   - **Step**: Introduce additional security controls, such as password encryption, sensitive data validation, and protection against vulnerabilities like SQL injection and brute force attacks.

## 7. Contribution

The project is open to contributions! Feel free to send as many Pull Requests (PRs) as you like. I’d be happy to review and accept your contributions! If you have any questions about the project or suggestions for improvements, don’t hesitate to contact me.

- **Email**: mateuscelestinofreacker@gmail.com
- **LinkedIn**: [Connect with me](https://www.linkedin.com/in/mateus-nelito)

Thanks for your help and interest!

## 8. License

This project is licensed under the [MIT License](LICENSE).
