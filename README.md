# 🎫 Service Desk System

> A modern incident management system built with Ionic Angular and Node.js/Express

## 📋 Overview

This Service Desk system is designed for managing IT incidents with user authentication, role-based permissions, and complete CRUD operations. The project demonstrates modern web development practices using Ionic Framework for cross-platform mobile applications and Express.js for API backend.

**Academic Context**: This project was developed for a Mobile Development course at IFSC, evolving from a traditional XAMPP/PHP stack to modern technologies for better performance, structure, and development experience.

## 🏗️ Architecture

The project is structured as a full-stack application with two main components:

### 📱 Frontend (`service-desk-app`)
- **Framework**: Ionic 8 with Angular 20 (Standalone Components)
- **Platform**: Cross-platform (Web, iOS, Android via Capacitor)
- **Features**: 
  - Responsive design
  - Modern UI components
  - Real-time data updates
  - Role-based interface

### 🔧 Backend (`service-desk-api`)
- **Runtime**: Node.js with Express.js
- **Database**: MariaDB
- **Features**:
  - RESTful API
  - User authentication
  - CRUD operations
  - Role-based permissions

## ✨ Features

### 🔐 Authentication System
- Secure login with email/password
- Session management with local storage
- Role-based access control (Solicitante, Atendente, Administrador)

### 📊 Incident Management
- **View Incidents**: List all available incidents or filter by assigned attendant
- **Create Incidents**: Add new incidents with detailed information
- **Edit Incidents**: Update incident details (Admin only)
- **Delete Incidents**: Remove incidents from system (Admin only)
- **Assign Incidents**: Attendants can take ownership of incidents

### 👥 User Roles
- **Solicitante**: View incidents only
- **Atendente**: View, create, and assign incidents
- **Administrador**: Full CRUD access to all incidents

### 🎨 User Experience
- Modern, responsive interface
- Pull-to-refresh functionality
- Loading states and error handling
- Toast notifications for user feedback
- Confirmation dialogs for destructive actions

## 🛠️ Technology Stack

| Component | Technology | Version |
|-----------|------------|---------|
| Frontend Framework | Ionic Angular | 8.x |
| Frontend Language | TypeScript | 5.x |
| UI Components | Angular Standalone | 20.x |
| Backend Runtime | Node.js | Latest LTS |
| Backend Framework | Express.js | 4.x |
| Database | MariaDB | Latest |
| Development Environment | GitHub Codespaces | - |

## 🚀 Getting Started

### Prerequisites
- Node.js (LTS version recommended)
- MariaDB Server
- GitHub Codespaces or Ubuntu environment

### 📦 Installation & Setup

#### 1. Database Setup
```bash
# Start MariaDB service
sudo service mariadb start

# Verify MariaDB status
sudo service mariadb status

# Access MariaDB console
sudo mysql
```

#### 2. Backend API Setup
```bash
# Navigate to API directory
cd service-desk-api

# Install dependencies
npm install

# Start the API server
npm start
```

#### 3. Frontend App Setup
```bash
# Navigate to app directory
cd service-desk-app

# Install dependencies
npm install

# Start the development server
npm start
```

### 🌐 Development Environment

**GitHub Codespaces Note**: When using GitHub Codespaces, you'll need to make the API port public each time you run `npm start` in the `service-desk-api` directory. This is currently the only limitation when developing in Codespaces.

## 📡 API Endpoints

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| POST | `/api/login` | User authentication | Public |
| GET | `/api/incidents` | List incidents | Authenticated |
| GET | `/api/incidents?attendantId=X` | List user's incidents | Authenticated |
| POST | `/api/incidents` | Create new incident | Atendente+ |
| PUT | `/api/incidents/:id` | Update incident | Atendente+ |
| DELETE | `/api/incidents/:id` | Delete incident | Admin only |
| GET | `/api/attendants` | List attendants | Authenticated |

## 🗄️ Database Schema

### Users Table (`usuarios`)
- `cod_usuario` (INT, Primary Key)
- `nome` (VARCHAR)
- `email` (VARCHAR, Unique)
- `cpf` (VARCHAR)
- `senha` (VARCHAR)
- `nivel` (ENUM: 'Solicitante', 'Atendente', 'Administrador')

### Incidents Table (`incidentes`)
- `cod_incidente` (INT, Primary Key)
- `usuario` (INT, Foreign Key)
- `atendente` (INT, Foreign Key, Nullable)
- `assunto` (VARCHAR)
- `descricao` (TEXT)
- `data_abertura` (DATE)
- `data_previsao` (DATE, Nullable)
- `data_resolucao` (DATE)
- `urgencia` (VARCHAR)
- `status` (VARCHAR)

## 🔄 Workflow

1. **User Login**: Authenticate with email and password
2. **Dashboard Access**: View incidents based on user role
3. **Incident Management**: Create, view, edit, or delete incidents
4. **Assignment**: Attendants can assign incidents to themselves
5. **Resolution**: Track incident progress and resolution

---

*Built with ❤️ by Rapha P. Gomes*