# TaskFlow - Team Task Manager

A **production-ready, full-stack team collaboration platform** for organizing projects and managing tasks effortlessly. Built with modern technologies and professional UI/UX design inspired by Notion and Linear.

![TaskFlow](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Node](https://img.shields.io/badge/Node-18%2B-blue)
![React](https://img.shields.io/badge/React-19-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-12%2B-blue)

---

## ✨ Features

### 🔐 Authentication & Security
- ✅ Secure session-based authentication with Passport.js
- ✅ Bcrypt password hashing
- ✅ HTTP-only cookies with CSRF protection
- ✅ Rate limiting on auth endpoints (20 req/15 min)
- ✅ SQL injection prevention with parameterized queries
- ✅ SSL certificate validation in production

### 👥 Team Collaboration
- ✅ Create and manage teams
- ✅ Invite team members by email
- ✅ Role-based access (admin/member)
- ✅ Real-time team member list
- ✅ Team settings and management

### 📋 Task Management
- ✅ Create, read, update, delete tasks
- ✅ Set priority levels (Low, Medium, High)
- ✅ Task status tracking (Todo, In Progress, Completed)
- ✅ Assign tasks to team members
- ✅ Set due dates with calendar picker
- ✅ Task descriptions and notes
- ✅ One-click task completion toggle

### 🔍 Search & Filter
- ✅ Real-time task search by title/description
- ✅ Filter by team member
- ✅ Filter by task status
- ✅ Combined filter support
- ✅ Instant results with memoization

### 🎨 Professional UI/UX
- ✅ Notion/Linear-inspired design
- ✅ Clean, minimal interface
- ✅ Dark mode support
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Smooth animations and transitions
- ✅ Loading skeletons
- ✅ Professional empty states
- ✅ Toast notifications

### 📱 Responsive Design
- ✅ Mobile-first approach
- ✅ Adaptive sidebar (drawer on mobile)
- ✅ Touch-friendly buttons and inputs
- ✅ Optimized for all screen sizes
- ✅ Proper spacing and typography

---

## 🛠️ Tech Stack

### Frontend
- **React 19** - UI library
- **Vite** - Build tool (lightning fast)
- **Tailwind CSS** - Utility-first styling
- **React Router v7** - Client-side routing
- **Axios** - HTTP client
- **Lucide React** - Icon library
- **date-fns** - Date formatting
- **react-hot-toast** - Notifications

### Backend
- **Node.js 18+** - Runtime
- **Express.js 5** - Web framework
- **PostgreSQL 12+** - Database
- **Passport.js** - Authentication
- **express-session** - Session management
- **connect-pg-simple** - PostgreSQL session store
- **Joi** - Input validation
- **Bcrypt** - Password hashing
- **Helmet** - Security headers
- **CORS** - Cross-origin requests
- **Morgan** - HTTP logging
- **express-rate-limit** - Rate limiting

### DevOps
- **Git** - Version control
- **npm** - Package management
- **Vite** - Frontend bundling
- **PostgreSQL** - Data persistence

---

## 📋 Project Structure

```
TASKFLOW/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js              # Database connection
│   │   │   └── passport.js        # Auth strategy
│   │   ├── controllers/
│   │   │   ├── authController.js  # Auth logic
│   │   │   ├── taskController.js  # Task CRUD
│   │   │   └── teamController.js  # Team management
│   │   ├── middleware/
│   │   │   ├── auth.js            # Auth guards
│   │   │   ├── errorHandler.js    # Error handling
│   │   │   └── validate.js        # Input validation
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── taskRoutes.js
│   │   │   └── teamRoutes.js
│   │   ├── services/
│   │   │   ├── userService.js
│   │   │   ├── taskService.js
│   │   │   └── teamService.js
│   │   ├── validators/
│   │   │   ├── authValidator.js
│   │   │   ├── taskValidator.js
│   │   │   └── teamValidator.js
│   │   ├── app.js                 # Express app
│   │   └── server.js              # Server entry
│   ├── schema.sql                 # Database schema
│   ├── .env.example               # Environment template
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   │       ├── Button.jsx
│   │   │       ├── Input.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── Skeleton.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Auth state
│   │   ├── layouts/
│   │   │   └── DashboardLayout.jsx
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Teams.jsx
│   │   │   └── TeamBoard.jsx
│   │   ├── services/
│   │   │   └── api.js             # Axios instance
│   │   ├── utils/
│   │   │   └── cn.js              # Class merge utility
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── DEPLOYMENT.md                  # Deployment guide
└── README.md                       # This file
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** 18 or higher
- **PostgreSQL** 12 or higher
- **Git**

### Local Development

1. **Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/taskflow.git
cd TASKFLOW
```

2. **Install Dependencies**
```bash
npm install --prefix backend
npm install --prefix frontend
```

3. **Setup Database**
```bash
# Create database
createdb taskflow_db

# Run schema
psql taskflow_db < backend/schema.sql
```

4. **Configure Environment**

**Backend** (`backend/.env`):
```env
PORT=5000
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow_db
SESSION_SECRET=your_random_secret_key_here_min_32_chars
FRONTEND_URL=http://localhost:5173
```

**Frontend** (`frontend/.env`):
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start Development Servers**

Terminal 1 - Backend:
```bash
cd backend
npm run dev
```

Terminal 2 - Frontend:
```bash
cd frontend
npm run dev
```

6. **Open Application**
```
http://localhost:5173
```

---

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Sign in
- `POST /api/auth/logout` - Sign out
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/teams` - List user's teams
- `POST /api/teams` - Create team
- `GET /api/teams/:id` - Get team details
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/members` - Add member

### Tasks
- `GET /api/tasks/team/:teamId` - List team tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

---

## 🔒 Security Features

✅ **Authentication**
- Passport.js Local Strategy
- Session-based with express-session
- PostgreSQL session store (connect-pg-simple)
- Bcrypt password hashing (10 rounds)

✅ **Authorization**
- Protected routes with auth middleware
- Team membership verification
- Admin-only operations

✅ **Data Protection**
- Parameterized SQL queries (no injection)
- Input validation with Joi
- HTTP-only cookies
- CSRF protection via SameSite cookies
- Helmet security headers

✅ **Rate Limiting**
- 20 requests per 15 minutes on auth endpoints
- Prevents brute-force attacks

✅ **SSL/TLS**
- Production enforces certificate validation
- Development allows self-signed certs

---

## 📊 Database Schema

### Users Table
```sql
id (PK) | username | email | password | full_name | created_at | updated_at
```

### Teams Table
```sql
id (PK) | name | description | created_by (FK) | created_at | updated_at
```

### Team Members Table
```sql
id (PK) | team_id (FK) | user_id (FK) | role | joined_at
```

### Tasks Table
```sql
id (PK) | title | description | status | priority | due_date | assigned_to (FK) | team_id (FK) | created_by (FK) | created_at | updated_at
```

### Indexes
- `tasks(team_id)` - Fast team task queries
- `tasks(assigned_to)` - Fast assignee queries
- `team_members(team_id)` - Fast member lookups
- `team_members(user_id)` - Fast user team lookups

---

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

**Quick Options:**
- **Frontend**: Vercel, Netlify, Render
- **Backend**: Railway, Render, Fly.io
- **Database**: Neon, Railway, Render PostgreSQL

---

## 🎯 Performance

- ✅ Frontend: 377KB JS, 27KB CSS (gzipped)
- ✅ Vite build: 2.07s
- ✅ Database indexes on all foreign keys
- ✅ Connection pooling enabled
- ✅ Compression middleware enabled
- ✅ Memoized task filtering
- ✅ Optimistic UI updates

---

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## 📝 Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development|production
DATABASE_URL=postgresql://...
SESSION_SECRET=random_32_char_string
FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🙋 Support

For issues and questions:
1. Check [DEPLOYMENT.md](./DEPLOYMENT.md) for deployment help
2. Review API documentation above
3. Check database schema
4. Verify environment variables

---

## 🎉 Credits

Built with ❤️ using React, Node.js, and PostgreSQL.

Inspired by Notion, Linear, and modern SaaS applications.

---

**Ready to deploy? Check out [DEPLOYMENT.md](./DEPLOYMENT.md)** 🚀
