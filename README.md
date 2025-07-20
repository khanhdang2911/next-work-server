# Nextwork System – Backend

## Introduction

This is the Backend service of the **Nextwork Internal Messaging System**, serving as the backbone of the application. It handles all business logic, data management, and provides APIs for the Frontend. Built with Node.js and Express, the Backend system ensures high performance, security, and scalability to meet the internal communication needs of enterprises.

The Backend also integrates Socket.IO to provide real-time messaging capabilities, ensuring instant information delivery between users.

### **User Authentication**

* Traditional account registration and login
* Email verification and password recovery
* Support for Google (OAuth) and Auth0 login
* Utilizes JWT (JSON Web Tokens) for session management and security
* Supports Two-Factor Authentication (2FA) for enhanced security

### **User Management**

* CRUD (Create, Read, Update, Delete) APIs for user information
* Management of user roles and permissions (member, admin)
* APIs for System Admin to lock/unlock user accounts system-wide

### **Workspace Management**

* CRUD APIs for creating, editing, and deleting workspaces
* Management of members within a workspace (add, remove, assign roles)
* APIs for System Admin to manage workspaces system-wide

### **Channel Management**

* CRUD APIs for creating, editing, and deleting chat channels
* Management of members within a channel (add, remove, assign roles)

### **Messaging System**

* APIs for sending and receiving text messages, images, and file attachments
* Supports personal messages (Direct Message) and group messages (Channel Message)
* APIs allowing message editing and deletion
* APIs for reacting to messages
* Stores chat history and supports search functionality

### **Real-time Communication**

* Uses Socket.IO for instant message delivery, notifications, and status updates

### **Attachment Management**

* APIs for uploading and managing file attachments (images, documents)

### **Invitation Management**

* APIs for creating and managing invitations to join workspaces/channels via email

### **Chatbot Interaction**

* APIs supporting interaction with an AI Assistant powered by Azure OpenAI

### **Data Security**

* Hashes and encrypts user passwords before storing them in the database
* Uses HTTPS to encrypt all data during transmission between client and server

## Technology Stack

| Category | Technology | Purpose |
|----------|------------|---------|
| **Runtime** | Node.js | High-performance JavaScript runtime environment |
| **Framework** | Express | Fast, minimalist web framework for building APIs |
| **Database** | MongoDB | Flexible NoSQL database for application data |
| **ODM** | Mongoose | Object Data Modeling library for MongoDB |
| **Real-time** | Socket.IO | Bidirectional communication between clients and servers |
| **Language** | TypeScript | Type-safe JavaScript development |
| **Authentication** | JWT | Secure, stateless authentication method |
| **OAuth** | Auth0 | User authentication and authorization |
| **AI Service** | Azure OpenAI | AI Assistant capabilities (GPT-3.5 Turbo) |
| **File Storage** | Azure Blob Storage | Cloud storage for file attachments |
| **Load Balancer** | Nginx | Distributes requests across multiple instances |
| **Containerization** | Docker | Application packaging and deployment |
| **CI/CD** | GitHub Actions | Automated deployment pipeline |
| **Hosting** | Azure Virtual Machines | Cloud server infrastructure |

## Quick Start

### Prerequisites

* **Node.js** (version 18.x or higher)
* **npm** or **Yarn** package manager
* **MongoDB** (running locally or accessible via remote instance)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nextwork-backend.git
   cd nextwork-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Configuration**
   
   Create a `.env` file in the project root directory and configure the necessary environment variables:

   ```env
   # Application URLs
   BE_URL = "xxx"
   FE_URL_MAIN = "xxx"

   # Server Port
   PORT = "8099"

   # MongoDB Configuration
   MONGO_DB_URL = "mongodb+srv://xxx:xxx@xxx" # Your MongoDB connection string
   MONGO_DB_NAME = "xxx"                      # Your MongoDB database name
   MONGO_DB_USER = "xxx"                      # Your MongoDB username
   MONGO_DB_PASSWORD = "xxx"                  # Your MongoDB password

   # JWT & OTP Configuration
   SECRET_PASSWORD = "xxx"                 # Secret key for password hashing
   EXPIRE_IN = "xh"                        # JWT expiration time (e.g., "1h", "7d")
   JWT_REFRESH_TOKEN_SIZE = x             # Size of JWT refresh token in characters
   OTP_TOKEN_SIZE = x                      # Size of OTP token
   OTP_SALT_ROUNDS = x                    # Salt rounds for OTP hashing

   # Auth0 Configuration
   AUTH0_AUDIENCE = "xxx"                  # Auth0 Audience
   AUTH0_ISSUER = "xxx"                   # Auth0 Issuer URL

   # Email Service Configuration
   MAIL_USER = "xxx"                       # Email sender username
   MAIL_PASS = 'xxx'                       # Email sender password
   MAIL_HOST = "xxx"                       # Email host (e.g., smtp.gmail.com)
   MAIL_PORT = xxx                         # Email port (e.g., 587 for TLS)

   # Account Verification Link
   VERIFICATION_LINK = "xxxxx/verify-account"

   # Azure Storage Configuration
   AZURE_STORAGE_CONNECTION_STRING = "DefaultEndpointsProtocol=https;AccountName=xxx" # Azure Storage Connection String
   AZURE_STORAGE_ACCOUNT_NAME = "xxx"                                                 # Azure Storage Account Name
   AZURE_STORAGE_ACCOUNT_KEY = "xxx"                                                  # Azure Storage Account Key
   AZURE_STORAGE_CONTAINER_NAME = "xxx"                                               # Azure Storage Container Name

   # Azure OpenAI Configuration
   AZURE_OPENAI_API_KEY="xxx"                  # Azure OpenAI API Key
   AZURE_OPENAI_ENDPOINT="xxx"                 # Azure OpenAI Endpoint
   AZURE_OPENAI_DEPLOYMENT_NAME="gpt-35-turbo" # Azure OpenAI Deployment Name
   ```

   **Note:** Ensure to replace all "xxx" placeholders with your actual configuration values.

### Running the Application

```bash
npm run dev
# or
yarn dev
```

The server will run on the port specified in the `.env` file (default is 8099).

### Running with Docker

You can also run the application using Docker:

1. **Build the Docker image**
   ```bash
   docker build -t nextwork-backend .
   ```

2. **Run the container**
   ```bash
   docker run -p 8099:8099 --env-file .env nextwork-backend
   ```

The API will be available at `http://localhost:8099`.


## API Endpoints

API endpoints are clearly defined within the `src/routes` directory. The system provides nearly **70 RESTful APIs** covering all aspects of the messaging system. For detailed information on each API, please refer to the source code or use a tool like Postman to explore the endpoints.

### Main API Categories

* **Authentication APIs** - User registration, login, password recovery
* **User Management APIs** - Profile management, user roles
* **Workspace APIs** - Workspace CRUD operations
* **Channel APIs** - Channel management and operations
* **Message APIs** - Sending, receiving, editing messages
* **File APIs** - File upload and attachment management
* **Invitation APIs** - Workspace and channel invitations
* **AI Assistant APIs** - Chatbot interactions

## Deployment

The Backend is deployed on **Azure Virtual Machines** and managed using **Docker**. An **Nginx Load Balancer** is used to distribute incoming requests across multiple instances of the API Service, ensuring high availability and performance. The deployment process is automated via **GitHub Actions**.

### Deployment Architecture

1. **Load Balancing**: Nginx distributes traffic across multiple backend instances
2. **Containerization**: Docker ensures consistent deployment environments
3. **Auto Scaling**: Multiple VM instances handle varying loads
4. **CI/CD Pipeline**: GitHub Actions automates testing and deployment
5. **Monitoring**: Real-time monitoring of system performance and health

## Contributing

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request
We welcome contributions to improve the Nextwork system! Please fork the repository and submit a pull request.

### Development Guidelines

* Follow TypeScript best practices
* Maintain consistent code style with existing codebase
* Write meaningful commit messages
* Include proper error handling and logging
* Test your changes thoroughly
* Document any new APIs or significant changes

## Support

For questions, issues, or suggestions, please:

* Open an issue on GitHub
* Check the API documentation for endpoint details
