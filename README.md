#  Car Rental API - Node.js  

Car Rental API is an API built with **Node.js, Express, MongoDB, and JWT authentication**.  
This API allows users to:  

-  Register and log in  
-  View their profile
-  Add cars to the system  
-  Filter rental cars based on different parameters  

---

## Prerequisites  
To use this API, you need to have the following installed:  

- **Node.js** (Recommended: LTS version)  
- **MongoDB** (locally or on a remote server)  
- **Postman** or any other API testing tool  

---

## Install the required dependencies:

- **npm init -y** 
- **npm install express mongodb bcryptjs jsonwebtoken body-parser dotenv**

---

## Create a .env file in the root directory and add the following details:

- **SECRET_KEY=secretkey** 
- **MONGODB_URI=mongodb://localhost:27017/carRental**
- **PORT=3000**

---

## Endpoints 
- **POST /register: Register a new user 
- **POST /login: Login a user and receive a JWT token 
- **GET /my-profile: Get user profile (protected route) 
- **POST /add-car: Add a car to the rental (protected route) 
- **GET /rental-cars: List rental cars with filters

## Running the Application

### Start the server: node server.js

---
##  Installation  

### Clone the repository to your device:  
```sh
git clone <repo-url>
cd <repo-folder>
