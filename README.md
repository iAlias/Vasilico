<div align="center">

  <h1>🌿 Vasilicò</h1>
  <p><strong>Your premium health and nutrition tracker.</strong></p>
  <p>
    Weight tracking · Meal planning · AI-powered recipe book · Automatic shopping list
  </p>

  <p>
    <img src="https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=white" alt="React" />
    <img src="https://img.shields.io/badge/TypeScript-5.8-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Vite-6.2-646CFF?logo=vite&logoColor=white" alt="Vite" />
    <img src="https://img.shields.io/badge/Tailwind_CSS-4.1-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
    <img src="https://img.shields.io/badge/Express-4.21-000000?logo=express&logoColor=white" alt="Express" />
    <img src="https://img.shields.io/badge/SQLite-3-003B57?logo=sqlite&logoColor=white" alt="SQLite" />
    <img src="https://img.shields.io/badge/Gemini_AI-Powered-4285F4?logo=google&logoColor=white" alt="Gemini AI" />
  </p>
</div>

---

🇮🇹 [Leggi in italiano](README.it.md)

## 📖 Contents

- [Overview](#-overview)
- [Screenshots](#-screenshots)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation and Setup](#-installation-and-setup)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Database Schema](#-database-schema)
- [Available Scripts](#-available-scripts)
- [License](#-license)

---

## 🌟 Overview

**Vasilicò** is a full-stack web application for personal health and nutrition tracking. Built
around a modern, intuitive interface, it lets you log your weight, plan weekly meals, browse a
recipe book of 100+ AI-generated recipes, and automatically build your shopping list.

The app is powered by an **Express.js** backend backed by a **SQLite** database, and integrates
**Google Gemini AI** for intelligent recipe generation. The frontend is built with **React 19**
and **Tailwind CSS**, offering a smooth, animated, and fully responsive experience.

---

## 📸 Screenshots

### Dashboard
The dashboard gives you a full overview: current weight, daily nutrition, the weekly schedule, and
quick access to the recipe book and shopping list.

<div align="center">
  <img src="https://github.com/user-attachments/assets/f3d193b1-2c27-451d-b11d-ad05a7ec7c83" alt="Dashboard" width="900" />
</div>

### Weight Tracking
Log your weight day by day and watch your progress over time with interactive charts.

<div align="center">
  <img src="https://github.com/user-attachments/assets/0345494a-f5a0-4397-a022-97e586e6ecc8" alt="Weight tracking" width="900" />
</div>

### Meal Plan
Organize your weekly diet day by day, with a calorie and nutrition summary for each day.

<div align="center">
  <img src="https://github.com/user-attachments/assets/d159ae31-886c-456e-a883-b4724cf3e64c" alt="Meal plan" width="900" />
</div>

### Recipe Book
Browse 100+ recipes organized by category (Breakfast, Lunch, Dinner, Snack), with full nutritional
details, ingredients and instructions.

<div align="center">
  <img src="https://github.com/user-attachments/assets/dbade01e-a1a0-4a9e-8066-66bbd6a3aab5" alt="Recipe book" width="900" />
</div>

### Shopping List
Generated automatically from the weekly meal plan, with smart aggregation of duplicate ingredients
and organization by category.

<div align="center">
  <img src="https://github.com/user-attachments/assets/d39a69cd-3ab8-4e9b-bc04-b5e74cdfc590" alt="Shopping list" width="900" />
</div>

### Authentication
Secure login and registration, with password hashing and JWT sessions.

<div align="center">
  <img src="https://github.com/user-attachments/assets/5af5d20a-ada6-4130-88d0-3dd708b02d48" alt="Login and registration" width="900" />
</div>

---

## ✨ Features

### 🔐 User Authentication
- Sign-up and login with email and password
- Secure sessions with **JWT** (7-day expiry)
- Password hashing with **bcryptjs**
- Customizable user profile

### ⚖️ Weight Tracking
- Daily weight logging
- Interactive progress chart (area chart)
- Full log history
- Trend analysis over time

### 🍽️ Weekly Meal Planner
- Day-by-day planning
- Navigation between weeks
- Calorie and nutrition summary per day
- Add meals from the recipe book or manually
- Custom notes for each meal

### 📖 Smart Recipe Book
- **100+ recipes** auto-generated with Google Gemini AI
- Categories: Breakfast, Lunch, Dinner, Snack
- Detailed nutritional information (calories, protein, carbs, fat)
- Ingredient list with quantities and units
- Search and filter by name or category
- Ability to create custom recipes

### 🛒 Automatic Shopping List
- Automatically generated from the weekly meal plan
- Smart aggregation of duplicate ingredients
- Organized by category (vegetables, proteins, dairy, etc.)
- Check items off while shopping
- Print function

### 📊 Dashboard
- Overview of current weight and its trend
- Daily nutrition summary
- Weekly schedule at a glance
- Quick access to the recipe book and shopping list

### 💾 Data Import/Export
- Full data export in JSON format
- Import data from a previous backup
- Local browser storage (localStorage)

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| [React](https://react.dev) | 19.0 | Core UI library |
| [TypeScript](https://www.typescriptlang.org) | 5.8 | Type safety and robust development |
| [Vite](https://vite.dev) | 6.2 | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4.1 | Utility-first styling |
| [Motion](https://motion.dev) | 12.x | Smooth animations |
| [Recharts](https://recharts.org) | 3.7 | Interactive charts |
| [Lucide React](https://lucide.dev) | 0.546 | Icons |
| [date-fns](https://date-fns.org) | 4.1 | Date formatting |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| [Express.js](https://expressjs.com) | 4.21 | HTTP server and REST API |
| [Better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | 12.4 | Embedded SQLite database |
| [Google Gemini AI](https://ai.google.dev) | 1.29 | AI-powered recipe generation |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.0 | JWT authentication |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3.0 | Password hashing |
| [cookie-parser](https://github.com/expressjs/cookie-parser) | 1.4 | Cookie handling |
| [dotenv](https://github.com/motdotla/dotenv) | 17.2 | Environment variables |

---

## 📁 Project Structure

```
Vasilicò/
├── index.html                  # HTML entry point
├── server.ts                   # Express.js server (backend)
├── vite.config.ts              # Vite configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── metadata.json                # App metadata
├── .env.example                 # Environment variable template
├── public/                      # Static assets
└── src/
    ├── main.tsx                 # React entry point
    ├── App.tsx                  # Main component with navigation
    ├── index.css                 # Global styles and Tailwind
    ├── types.ts                  # TypeScript interfaces
    ├── components/
    │   ├── Auth.tsx              # Login and sign-up
    │   ├── Dashboard.tsx         # Main dashboard
    │   ├── WeightTracker.tsx     # Weight tracking
    │   ├── MealPlanner.tsx       # Meal planning
    │   ├── RecipeBook.tsx        # Recipe book
    │   ├── RecipeViewModal.tsx   # Recipe detail modal
    │   ├── ShoppingList.tsx      # Shopping list
    │   └── Profile.tsx           # User profile
    ├── constants/
    │   └── defaultRecipes.ts     # Default fallback recipes
    ├── lib/
    │   └── utils.ts              # Utilities (cn for CSS classes)
    └── services/
        └── storageService.ts     # localStorage service
```

---

## 🚀 Installation and Setup

### Prerequisites

- **Node.js** (version 18 or later)
- **npm** (bundled with Node.js)
- A **Google Gemini API key** (for AI recipe generation) — [get one here](https://ai.google.dev)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/iAlias/Vasilico.git
   cd Vasilico
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy the example file and fill in your own values:

   ```bash
   cp .env.example .env
   ```

   Edit the `.env` file with your data (see [Environment Variables](#-environment-variables)).

4. **Start the development server**

   ```bash
   npm run dev
   ```

5. **Open your browser**

   Go to [http://localhost:3000](http://localhost:3000) 🎉

> **Note:** On the first run, if the Gemini API key is configured correctly, the server will
> automatically generate 100+ recipes using AI. This happens only once.

---

## 🔑 Environment Variables

Create a `.env` file in the project root based on [`.env.example`](.env.example):

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | API key for Google Gemini AI. Required for recipe generation. |
| `JWT_SECRET` | ✅ | Secret key used to sign JWT tokens. Use a long, random string. |
| `APP_URL` | ❌ | The URL where the app is hosted (default: `http://localhost:3000`). |

```env
GEMINI_API_KEY="your_gemini_api_key"
JWT_SECRET="a_long_random_secret_string"
APP_URL="http://localhost:3000"
```

---

## 🔌 API Endpoints

All APIs require JWT cookie authentication (except the auth routes themselves).

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/signup` | Registers a new user |
| `POST` | `/api/auth/login` | Logs in |
| `POST` | `/api/auth/logout` | Logs out |
| `GET` | `/api/auth/me` | Gets the current user |

### Weight

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/weight` | Lists all weight log entries |
| `POST` | `/api/weight` | Logs a new weight entry |
| `DELETE` | `/api/weight/:id` | Deletes a log entry |

### Recipes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/recipes` | Lists all recipes |
| `POST` | `/api/recipes` | Creates a new recipe |
| `DELETE` | `/api/recipes/:id` | Deletes a recipe |

### Meals

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/meals?start=YYYY-MM-DD&end=YYYY-MM-DD` | Lists meals within a date range |
| `POST` | `/api/meals` | Logs a new meal |
| `DELETE` | `/api/meals/:id` | Deletes a meal |

### Shopping List

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/shopping-list` | Generates and returns the shopping list |
| `PATCH` | `/api/shopping-list/:id` | Checks/unchecks an item |
| `DELETE` | `/api/shopping-list` | Clears the shopping list |

---

## 🗄️ Database Schema

The application uses **SQLite** with the following tables:

```sql
-- Registered users
users (id, email, password, name, created_at)

-- Weight log entries
weight_logs (id, user_id, weight, date)

-- Recipes (user_id = 0 for system recipes generated by AI)
recipes (id, user_id, title, category, calories, protein, carbs, fat, servings, instructions)

-- Recipe ingredients
ingredients (id, recipe_id, name, amount, unit, category)

-- Planned/logged meals
meal_logs (id, user_id, recipe_id, title, category, calories, protein, carbs, fat, servings, date, notes)

-- Shopping list
shopping_list (id, user_id, name, amount, unit, category, is_checked)
```

Ingredient categories include: `vegetables`, `proteins`, `carbs`, `dairy`, `fruit`, `pantry`, `other`.

---

## 📜 Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Starts the development server on `http://localhost:3000` |
| `npm run build` | Builds the frontend for production into the `dist/` folder |
| `npm run preview` | Previews the production build |
| `npm run lint` | TypeScript type checking (`tsc --noEmit`) |
| `npm run clean` | Removes the `dist/` folder |

---

## License

[MIT](LICENSE) © 2026 iAlias

---

<div align="center">
  <p>Made with 💚 — <strong>Vasilicò</strong></p>
</div>
