
# Monolithic_ts Application

A monolithic TypeScript application using Node.js and MongoDB, containerized with Docker.


## Table of Contents

- Prerequisites
- Setup and Installation
- Environment Variables
- Docker Usage
- API Documentation
- Contributing
- License

## Prerequisites

- Node.js (version 18+ recommended)
- Docker and Docker Compose
- MongoDB (for local setup) or use Docker to manage MongoDB as a service


## Setup and Installation

1. Clone the repository:

```bash
 git clone https://github.com/yourusername/your-repo.git

 cd your-repo

```

2. Install dependencies:

```bash
    npm install
```
3. Set up environment variables:
Copy the .env.example to .env and fill in the necessary values. Refer to the Environment Variables section for details.


## Environment variables 
Below are the required environment variables for the project. Add these to your .env file:
```bash 
PORT=7000
APP_SECRET=yourSecretKey
MONGODB_URI=mongodb://admin:admin@db:27017/monolithic_ts?authSource=admin
NODE_ENV = dev
```
or simply run in your terminal. :
```bash
cp .env.example .env
```

## Docker Usage
Building and Running the Application with Docker

1. Build and start the Docker containers:
```bash 
    docker-compose up --build
```
This command builds the Docker image (if it hasn’t been built) and starts both the application and MongoDB containers.

2. Shutting down the containers: 
```bash
docker-compose down

```
This stops and removes the containers but preserves the volume data.

## Accessing the MongoDB Database
The MongoDB service is exposed on port 27017. If you want to inspect or manage the database locally, you can connect using a MongoDB client like MongoDB Compass with the connection URI provided in .env.

## Docker Volumes
The MongoDB data is persisted in a Docker volume named mongodb_data, defined in the docker-compose.yaml file. This allows the database data to persist even if the containers are stopped or removed.
## API Documentation

This project’s API is documented using Swagger to provide detailed and interactive API documentation for developers. You can use this documentation to understand the available endpoints, request methods, authentication, and response formats.


## Swagger UI Access
To access the Swagger UI:

1. Local Environment:
-  Open your browser and go to http://localhost:7000/api-docs (replace with the correct port if different).
2. Using Docker:
- If you are running the project in Docker, ensure that the api-docs path is exposed properly, and navigate to the same URL.

## Authentication with bearerAuth
Note: Some routes require JWT-based authentication. To access these secured endpoints:
- Use the Authorize button in the Swagger UI and provide a valid JWT token.
- The JWT should be prefixed with Bearer (e.g., Bearer <your_token>).

### Some available endpoints:

| Endpoints | Method     | Description                |
| :-------- | :------- | :------------------------- |
| `/product/create` | POST | Creates a new product |
| `/category/{type}` | GET     | Retrieves product by category                |
| `/product/{id}` | GET | Retrieves product by ID |
| `/wishlist` | PUT | Adds a product to the wishlist (Auth required) |
| `cart` | PUT     | Add a product to cart (Auth required)                |
| `/cart/{id}` | DELETE | Removes a product from the cart (Auth required) |


## Example Request Using `curl`
For those who want to test the API directly from the command line:

```bash 
curl -i -X POST "http://localhost:{PORT}/customer/login" -H "Content-Type: application/json" -d '{"email": "example@gmail.com", "password": "your_password"}'

```
### Expected output if using `-i` flag in the curl

```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: *
Set-Cookie: authToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6Imtpc2hhbkBnbWFpbC5jb20iLCJfaWQiOiI2NzM0YjQwOGVmNGNkZjkzZWNiMWI5OTkiLCJpYXQiOjE3MzE1MTAyNDUsImV4cCI6MTczNDEwMjI0NX0.1OOqkeS_hgmBlPffRjZ_DSSsn6M5TMh68mHzSiLLelU; Path=/; HttpOnly; SameSite=Strict
Content-Type: application/json; charset=utf-8
Content-Length: 227
ETag: W/"e3-gctCJe90Ul97Dmkg2L1EIlwc/vg"
Date: Wed, 13 Nov 2024 15:04:05 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```
This will include both the response body and the response headers. Look for a Set-Cookie header in the response, which should look something like:

```bash
Set-Cookie: token=<JWT_TOKEN>; Path=/; HttpOnly; Max-Age=3600; SameSite=Strict;

```

If the cookie is set, it will appear in the Set-Cookie header, and the browser (or curl in this case) will store it for subsequent requests.



## Contributing

Contributions are welcome! Please create an issue or a pull request to discuss any potential changes.
## 🔗 Links

[![linkedin](https://img.shields.io/badge/linkedin-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/kishan-ta)
[![medium](https://img.shields.io/badge/medium-12100E?style=for-the-badge&logo=medium&logoColor=white)](https://medium.com/@kishantashok)


## License
This project is licensed under the [MIT License](https://opensource.org/license/mit).