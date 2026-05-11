# TaskFlow - Team Task Manager

A full-stack, production-ready project management system designed for teams to organize projects and track their daily tasks effortlessly.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, React Router, Axios
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: Passport.js (Local), Express Session, Bcrypt

---

## Project Structure
```
TASKFLOW/
├── backend/         # Node server & Express REST API
├── frontend/        # Vite React dashboard UI
```

---

## Getting Started Locally

### 1. Database Configuration
1. Ensure you have **PostgreSQL** installed locally and running.
2. Create a database named `taskflow_db`.
3. Run the SQL script located at `backend/schema.sql` inside that database to create tables required for this app.

### 2. Setup Backend
1. Open the terminal inside the `backend` directory.
2. Install dependencies: `npm install`
3. Modify the `.env` file variables to match your setup:
   - `DATABASE_URL`: Your PostgreSQL connection string e.g., `postgresql://user:password@localhost:5432/taskflow_db`
   - `SESSION_SECRET`: A custom secret key string.
4. Start the development server: `npm run dev`
*(The server should output successfully connected to PostgreSQL and listening on Port 5000)*

### 3. Setup Frontend
1. Open another terminal window inside the `frontend` directory.
2. Install dependencies: `npm install`
3. If needed, verify your `.env` file points to the backend endpoint (default is `http://localhost:5000/api`).
4. Launch the frontend client: `npm run dev`

Open `http://localhost:5173` in your browser to start using TaskFlow!

---

## Core Features
- **Authentication**: Secure session-based auth with persistence and hashed passwords.
- **Team Collaboration**: Create specialized teams and invite registered users to collaborate.
- **Dynamic Tasks**: Set priority levels, statuses, due dates, and delegate to teammates.
- **Dashboard filters**: Instantly query tasks by search query or filter by completion states.
- **Modern Layout**: High performance responsive UI with seamless dark mode detection support.
