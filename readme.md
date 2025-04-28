# Finance Tracker

![Finance Tracker Logo](./public/images/logo.png)

A comprehensive personal finance management application that helps users track expenses, create budgets, connect bank accounts, and visualize financial data.

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Pages and Layouts](#pages-and-layouts)
  - [Public Pages](#public-pages)
  - [Dashboard Layout](#dashboard-layout)
- [Components](#components)
- [API Integration](#api-integration)
  - [Plaid Integration](#plaid-integration)
  - [API Endpoints](#api-endpoints)
- [CSS Styling](#css-styling)
- [State Management](#state-management)
- [Deployment](#deployment)
- [Testing](#testing)
- [Known Issues](#known-issues)
- [Future Enhancements](#future-enhancements)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgements](#acknowledgements)

## Overview

Finance Tracker is a full-featured financial management solution that provides users with the tools to take control of their personal finances. It combines automatic bank transaction imports, budgeting features, expense tracking, and financial analytics to deliver comprehensive money management capabilities in a user-friendly interface.

The application uses Plaid API for secure bank connections, React for the frontend, and Django REST Framework for the backend services.

## Features

### Core Features

- **Expense Tracking**
  - Automatic transaction import from connected bank accounts
  - Manual expense entry with category assignment
  - Advanced search and filtering options
  - Export capabilities to CSV format

- **Budget Management**
  - Daily, weekly, and monthly budget settings
  - Visual progress bars showing budget utilization
  - Budget notifications when approaching limits
  - Category-specific budget tracking

- **Bank Connectivity**
  - Secure bank account connections through Plaid
  - Automatic transaction synchronization
  - Support for multiple financial institutions
  - Privacy-focused approach to financial data

- **Visual Analytics**
  - Expense breakdown by category with pie charts
  - Daily expense trends with line charts
  - Budget progress visualization
  - Summary statistics for financial overview

- **Notifications System**
  - Budget alerts (approaching/exceeding limits)
  - Large expense notifications
  - Weekly spending summaries
  - System notifications

## Demo

Visit the live demo at [finance-tracker.example.com](https://finance-tracker.example.com)

**Demo Account:**
- Email: demo@example.com
- Password: demo123

## Tech Stack

### Frontend
- React.js
- React Router DOM
- Recharts (for data visualization)
- CSS Modules / CSS-in-JS
- React Context API

### Backend
- Django
- Django REST Framework
- JWT Authentication
- PostgreSQL

### Integration
- Plaid API (for bank connections)
- RESTful API architecture
- Axios for API requests

### Deployment
- Docker
- AWS/Azure/GCP (choose your deployment platform)
- CI/CD pipelines

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm (v6 or later) or yarn
- Python (v3.8 or later)
- pip (for Python packages)
- PostgreSQL (v12 or later)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/finance-tracker.git
   cd finance-tracker
   ```

2. Install frontend dependencies
   ```bash
   cd frontend
   npm install
   # or if using yarn
   yarn install
   ```

3. Install backend dependencies
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows, use: venv\Scripts\activate
   pip install -r requirements.txt
   ```

4. Set up the database
   ```bash
   python manage.py migrate
   ```

5. Start the development servers

   In one terminal (backend):
   ```bash
   cd backend
   python manage.py runserver
   ```

   In another terminal (frontend):
   ```bash
   cd frontend
   npm start
   # or if using yarn
   yarn start
   ```

6. Open your browser and navigate to `http://localhost:3000`

### Environment Variables

Create a `.env` file in both the frontend and backend directories:

**Frontend .env:**
```
REACT_APP_API_URL=http://localhost:8000/api
REACT_APP_PLAID_ENV=sandbox
```

**Backend .env:**
```
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=postgres://username:password@localhost:5432/finance_tracker
PLAID_CLIENT_ID=your_plaid_client_id
PLAID_SECRET=your_plaid_secret
PLAID_ENV=sandbox
```

## Project Structure

```
finance-tracker/
├── frontend/                # React frontend
│   ├── public/              # Public assets
│   │   ├── images/          # Image assets
│   │   └── index.html       # HTML template
│   │
│   ├── src/                 # Source code
│   │   ├── components/      # Reusable components
│   │   │   ├── Navbar/      
│   │   │   ├── Footer/      
│   │   │   └── ...          
│   │   │
│   │   ├── pages/           # Page components
│   │   │   ├── HomePage/
│   │   │   ├── FeaturesPage/
│   │   │   ├── HowToUsePage/
│   │   │   └── ...
│   │   │
│   │   ├── dashboardComponents/ # Dashboard-specific components
│   │   │   ├── sidebar/
│   │   │   ├── progressBar/
│   │   │   └── ...
│   │   │
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main App component
│   │   ├── main.jsx         # Entry point
│   │   └── router.jsx       # Routing configuration
│   │
│   ├── package.json         # NPM dependencies
│   └── vite.config.js       # Vite configuration
│
├── backend/                 # Django backend
│   ├── finance_tracker/     # Main Django project
│   ├── api/                 # Django app for API
│   ├── users/               # User management app
│   ├── budgets/             # Budget management app
│   ├── expenses/            # Expense tracking app
│   ├── plaid_integration/   # Plaid API integration
│   ├── manage.py            # Django management script
│   └── requirements.txt     # Python dependencies
│
├── docker/                  # Docker configuration
│   ├── Dockerfile.frontend
│   ├── Dockerfile.backend
│   └── docker-compose.yml
│
└── README.md                # Project documentation
```

## Pages and Layouts

The application uses two primary layouts:

### Public Pages

Pages accessible without authentication:

1. **Home Page** (`HomePage.jsx`)
   - Landing page introducing the application
   - Feature highlights and selling points
   - Call-to-action buttons for sign-up and login
   
2. **Features Page** (`FeaturesPage.jsx`)
   - Detailed feature descriptions
   - Visual examples of each feature
   - Comparison with other financial tools
   
3. **How To Use Page** (`HowToUsePage.jsx`)
   - Step-by-step guide for new users
   - Video tutorials section
   - FAQ section
   
4. **Login/Register Pages**
   - User authentication forms
   - Password reset functionality
   - Social login options

### Dashboard Layout

Secure pages requiring authentication:

1. **Dashboard Homepage** (`DashboardHomePage.jsx`)
   - Financial summary
   - Recent transactions
   - Budget progress
   - Notifications
   
2. **Expenses Page** (`ExpensesPage.jsx`)
   - Transaction list with search and filters
   - Add/edit expense functionality
   - Export options
   
3. **Budget Analytics** (`AnalyticsPage.jsx`)
   - Budget progress visualization
   - Spending category breakdown
   - Trend analysis
   
4. **Bank Connections** (`BankConnectionPage.jsx`)
   - Connect and manage bank accounts
   - Sync transactions manually
   - View account balances

## Components

### Core Components

- **Navbar** - Navigation component for public pages
- **Footer** - Site-wide footer with links and contact information
- **Sidebar** - Navigation for dashboard pages

### Dashboard Components

- **BudgetProgressBars** - Visual representation of budget usage
- **CategoryPieChart** - Breakdown of spending by category
- **DailyExpenseChart** - Line chart of daily expenses
- **BudgetSummaryStats** - Key financial metrics
- **ExpenseModal** - Form for adding/editing expenses
- **BudgetSetupModal** - Settings for daily/weekly/monthly budgets
- **ToastNotification** - In-app notification system

## API Integration

### Plaid Integration

The application uses Plaid to securely connect users' bank accounts. The integration flow is:

1. **Create Link Token** - Backend generates a Plaid Link token
2. **Launch Plaid Link** - Frontend launches Plaid's Link interface
3. **Exchange Token** - Backend exchanges the public token for access token
4. **Fetch Transactions** - System periodically syncs transaction data

### API Endpoints

#### Authentication
- `POST /api/auth/register/` - Create a new user account
- `POST /api/auth/login/` - Login and get JWT tokens
- `POST /api/auth/refresh/` - Refresh JWT token
- `GET /api/users/me/` - Get current user details

#### Expenses
- `GET /api/expenses/` - List user expenses with filtering
- `POST /api/expenses/` - Create a new expense
- `GET /api/expenses/{id}/` - Get expense details
- `PUT /api/expenses/{id}/` - Update an expense
- `DELETE /api/expenses/{id}/` - Delete an expense
- `GET /api/expenses/export/` - Export expenses to CSV

#### Budgets
- `GET /api/budgets/` - List user budgets
- `POST /api/budgets/` - Create a new budget
- `GET /api/budgets/summary/` - Get budget summary with progress
- `POST /api/budgets/set_budgets/` - Set all period budgets at once

#### Bank Integration
- `POST /api/plaid/create_link_token/` - Get a Plaid Link token
- `POST /api/plaid/exchange_public_token/` - Exchange public token
- `GET /api/plaid/items/` - List connected bank accounts
- `POST /api/plaid/sync_transactions/` - Manually sync transactions

#### Notifications
- `GET /api/notifications/` - List user notifications
- `POST /api/notifications/{id}/mark_as_read/` - Mark notification as read
- `POST /api/notifications/mark_all_as_read/` - Mark all as read
- `GET /api/notifications/unread_count/` - Get unread notification count

## CSS Styling

The application uses a combination of CSS strategies:

### CSS Variables

Global CSS variables for consistent theming:

```css
:root {
  --primary-color: #05074A;
  --primary-light: #0B3879;
  --accent-color: #43BBE6;
  --accent-light: #5DE7FF;
  --accent-gradient: linear-gradient(135deg, #43BBE6, #00E5BE);
  /* ... more variables ... */
}
```

### CSS Modules

CSS Modules are used to prevent style leakage between components:

- Each component has its own `.module.css` file
- Class names are automatically scoped to their component
- No CSS conflicts between components with the same class names

### Responsive Design

- Mobile-first approach with responsive breakpoints
- Adaptive layouts for different screen sizes
- Touch-friendly UI elements for mobile devices

## State Management

### React Context API

Used for managing global application state:

- **AuthContext** - User authentication state
- **NotificationsContext** - In-app notifications
- **BudgetContext** - Budget data and calculations

### Component State

Local component state for UI interactions:

- Form inputs and validation
- Modal dialogs
- Expandable/collapsible sections

## Deployment

### Docker Setup

The application is containerized using Docker for consistent deployment:

```bash
# Build and run with Docker Compose
docker-compose up -d --build
```

### Deployment Options

1. **AWS Deployment**
   - Frontend on S3 + CloudFront
   - Backend on ECS/EKS
   - RDS for PostgreSQL

2. **Azure Deployment**
   - Frontend on Static Web Apps
   - Backend on App Service
   - Azure Database for PostgreSQL

3. **Heroku Deployment**
   - Simpler deployment for MVPs
   - Heroku Postgres add-on

## Testing

### Frontend Testing

```bash
# Run frontend tests
cd frontend
npm test
```

### Backend Testing

```bash
# Run backend tests
cd backend
python manage.py test
```

## Known Issues

- Plaid sandbox mode has limited transaction data
- Mobile responsiveness issues on some dashboard components
- Performance bottlenecks with large transaction datasets

## Future Enhancements

- Mobile apps (iOS/Android)
- Dark mode support
- Investment tracking
- Goal setting and tracking
- Financial reports and insights
- Multi-currency support
- Shared budgets for families

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Plaid API](https://plaid.com) for banking integration
- [Recharts](https://recharts.org/) for data visualization
- [React Router](https://reactrouter.com/) for navigation
- [Django Rest Framework](https://www.django-rest-framework.org/) for API development
- All contributors and open-source projects that made this possible