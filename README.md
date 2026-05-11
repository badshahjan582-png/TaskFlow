# TaskFlow

A full-stack task management and team collaboration application built with Node.js, PostgreSQL, and React.

## Overview

TaskFlow provides teams with a centralized platform to create, manage, and track tasks across distinct workspaces. The application leverages a REST API backend for secure data persistence and authentication, coupled with a responsive frontend client for task orchestration.

## Features

### Authentication
- Session-based user authentication via Passport.js.
- Hashed password storage using `bcrypt`.
- Restricted client-side views via global route guards.

### Team Management
- Workspace creation and management.
- Centralized tracking of total active tasks per team.
- Listing and retrieval of assigned team members.

### Task Operations
- Full CRUD functionality for individual tasks.
- Task classification by priority levels (Low, Medium, High).
- Workflow state management (Todo, In Progress, Completed).
- Single-click task completion toggles from board views.
- Date handling for target delivery deadlines.

### Search & Filtering
- Query tasks dynamically by title and content fields.
- Filter tasks by status or individual assignee.

### User Interface
- Dynamic theme detection supporting OS preference for dark mode rendering.
- Fully responsive layout for mobile and desktop viewport scaling.
- Optimized asset bundle using Vite.

## Tech Stack

### Frontend
- **React 19** - UI Component library.
- **Tailwind CSS** - Styling and layout utilities.
- **React Router** - Client-side view resolution.
- **Axios** - Asynchronous HTTP processing.

### Backend
- **Node.js & Express** - REST API orchestration.
- **PostgreSQL** - Relational data persistence.
- **Passport.js** - Core authentication strategy.
- **express-session** - Node-native session tracking.
- **connect-pg-simple** - SQL-backed session storage.

## Project Structure

```text
TASKFLOW/
├── backend/                # Express API and database configs
│   ├── src/
│   │   ├── config/         # DB connectivity and strategies
│   │   ├── controllers/    # Request orchestration logic
│   │   ├── routes/         # Endpoint definition mapping
│   │   ├── services/       # Core processing logic
│   │   └── app.js          # Express instance configuration
│   ├── schema.sql          # Database table and index creation
│   └── package.json
│
├── frontend/               # React SPA
│   ├── src/
│   │   ├── components/     # Reusable layout components
│   │   ├── context/        # Global state providers (Auth)
│   │   ├── pages/          # Routable view containers
│   │   └── services/       # Client-side API configuration
│   ├── vite.config.js      # Bundler directives
│   └── package.json
```

## Setup & Installation

### Prerequisites
- Node.js v18 or higher
- PostgreSQL 12 or higher

### 1. Database Configuration
Initialize your database instance and run the schema generator:
```bash
createdb taskflow_db
psql taskflow_db < backend/schema.sql
```

### 2. Backend Setup
Configure environment credentials and start node processes:
```bash
cd backend
npm install
```
Populate your `.env` file within the `/backend` directory:
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:pass@localhost:5432/taskflow_db
SESSION_SECRET=your_random_key_string
FRONTEND_URL=http://localhost:5173
```
Run deployment server:
```bash
npm run dev
```

### 3. Frontend Setup
Configure dynamic API injection and start client:
```bash
cd frontend
npm install
```
Define the API target in `/frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```
Execute local instance:
```bash
npm run dev
```
Navigate to `http://localhost:5173`.

## API Reference

### Authentication
- `POST /api/auth/register` - Account initialization.
- `POST /api/auth/login` - User sign-in.
- `POST /api/auth/logout` - Session invalidation.
- `GET /api/auth/me` - Current context validation.

### Workspace Operations
- `GET /api/teams` - List accessible teams.
- `POST /api/teams` - Construct new workspace.
- `GET /api/teams/:id` - Fetch specific team analytics.

### Task Operations
- `GET /api/tasks/team/:teamId` - Retrieve contextual workspace tasks.
- `POST /api/tasks` - Submit new ticket definition.
- `PUT /api/tasks/:id` - Modify attributes or state flags.
- `DELETE /api/tasks/:id` - Hard deletion of records.

## Security Hardening
- **SQL Parameterization**: Preventative query structuring guarding against injection vulnerabilities.
- **Trust-Proxy Propagation**: Configured `trust proxy` settings enabling encrypted transmission behind managed load balancers.
- **Secure Cookie Handling**: Enforcement of HTTP-only and Secure flags in production deployments.

## Deployment Configuration
The standard deployment topology maps each independent environment to suitable cloud tiers:
- **Backend Environment**: Deployed on **Railway**, sourcing directly from the `/backend` directory.
- **Frontend Client**: Hosted on **Vercel**, sourcing static optimized bundle from `/frontend`.
- **Database Layer**: Cloud-hosted via **Neon Serverless PostgreSQL**.
