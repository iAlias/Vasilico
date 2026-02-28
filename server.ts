import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import Database from "better-sqlite3";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("nutritrack.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS weight_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    weight REAL NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    category TEXT, -- Breakfast, Lunch, Dinner, Snack
    calories REAL,
    protein REAL,
    carbs REAL,
    fat REAL,
    servings INTEGER DEFAULT 1,
    instructions TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS ingredients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    recipe_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    unit TEXT NOT NULL,
    category TEXT, -- vegetables, proteins, etc.
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
  );

  CREATE TABLE IF NOT EXISTS meal_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    recipe_id INTEGER,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    calories REAL,
    protein REAL,
    carbs REAL,
    fat REAL,
    servings REAL DEFAULT 1,
    date DATE NOT NULL,
    notes TEXT,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (recipe_id) REFERENCES recipes(id)
  );

  CREATE TABLE IF NOT EXISTS shopping_list (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    amount REAL NOT NULL,
    unit TEXT NOT NULL,
    category TEXT,
    is_checked INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );
`);

const app = express();
const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

app.use(express.json());
app.use(cookieParser());

// Auth Middleware
const authenticate = (req: any, res: any, next: any) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};

// --- Auth Routes ---
app.post("/api/auth/signup", async (req, res) => {
  const { email, password, name } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const info = db.prepare("INSERT INTO users (email, password, name) VALUES (?, ?, ?)").run(email, hashedPassword, name);
    const token = jwt.sign({ id: info.lastInsertRowid, email, name }, JWT_SECRET, { expiresIn: "7d" });
    res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
    res.json({ id: info.lastInsertRowid, email, name });
  } catch (err) {
    res.status(400).json({ error: "Email already exists" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  const user: any = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "7d" });
  res.cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" });
  res.json({ id: user.id, email: user.email, name: user.name });
});

app.post("/api/auth/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
});

app.get("/api/auth/me", authenticate, (req: any, res) => {
  res.json(req.user);
});

// --- Weight Routes ---
app.get("/api/weight", authenticate, (req: any, res) => {
  const logs = db.prepare("SELECT * FROM weight_logs WHERE user_id = ? ORDER BY date ASC").all(req.user.id);
  res.json(logs);
});

app.post("/api/weight", authenticate, (req: any, res) => {
  const { weight, date } = req.body;
  db.prepare("INSERT INTO weight_logs (user_id, weight, date) VALUES (?, ?, ?)").run(req.user.id, weight, date);
  res.json({ success: true });
});

app.delete("/api/weight/:id", authenticate, (req: any, res) => {
  db.prepare("DELETE FROM weight_logs WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

// --- Recipe Routes ---
app.get("/api/recipes", authenticate, (req: any, res) => {
  const recipes = db.prepare("SELECT * FROM recipes WHERE user_id = ? OR user_id = 0").all(req.user.id);
  const recipesWithIngredients = recipes.map((r: any) => {
    const ingredients = db.prepare("SELECT * FROM ingredients WHERE recipe_id = ?").all(r.id);
    return { ...r, ingredients };
  });
  res.json(recipesWithIngredients);
});

app.post("/api/recipes", authenticate, (req: any, res) => {
  const { title, category, calories, protein, carbs, fat, servings, instructions, ingredients } = req.body;
  
  const transaction = db.transaction(() => {
    const info = db.prepare(`
      INSERT INTO recipes (user_id, title, category, calories, protein, carbs, fat, servings, instructions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(req.user.id, title, category, calories, protein, carbs, fat, servings, instructions);
    
    const recipeId = info.lastInsertRowid;
    const insertIngredient = db.prepare("INSERT INTO ingredients (recipe_id, name, amount, unit, category) VALUES (?, ?, ?, ?, ?)");
    
    for (const ing of ingredients) {
      insertIngredient.run(recipeId, ing.name, ing.amount, ing.unit, ing.category);
    }
    return recipeId;
  });

  const recipeId = transaction();
  res.json({ id: recipeId });
});

app.delete("/api/recipes/:id", authenticate, (req: any, res) => {
  const transaction = db.transaction(() => {
    db.prepare("DELETE FROM ingredients WHERE recipe_id = ?").run(req.params.id);
    db.prepare("DELETE FROM recipes WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  });
  transaction();
  res.json({ success: true });
});

// --- Meal Routes ---
app.get("/api/meals", authenticate, (req: any, res) => {
  const { start, end } = req.query;
  const meals = db.prepare("SELECT * FROM meal_logs WHERE user_id = ? AND date BETWEEN ? AND ? ORDER BY date DESC").all(req.user.id, start, end);
  res.json(meals);
});

app.post("/api/meals", authenticate, (req: any, res) => {
  const { recipe_id, title, category, calories, protein, carbs, fat, servings, date, notes } = req.body;
  db.prepare(`
    INSERT INTO meal_logs (user_id, recipe_id, title, category, calories, protein, carbs, fat, servings, date, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(req.user.id, recipe_id, title, category, calories, protein, carbs, fat, servings, date, notes);
  res.json({ success: true });
});

app.delete("/api/meals/:id", authenticate, (req: any, res) => {
  db.prepare("DELETE FROM meal_logs WHERE id = ? AND user_id = ?").run(req.params.id, req.user.id);
  res.json({ success: true });
});

// --- Shopping List Routes ---
app.get("/api/shopping-list", authenticate, (req: any, res) => {
  // Automatically update shopping list based on current week's meal plan
  const start = format(startOfWeek(new Date()), "yyyy-MM-dd");
  const end = format(endOfWeek(new Date()), "yyyy-MM-dd");
  
  const transaction = db.transaction(() => {
    // Clear existing shopping list for this user
    db.prepare("DELETE FROM shopping_list WHERE user_id = ?").run(req.user.id);

    // Get all meals planned for this week
    const meals = db.prepare("SELECT * FROM meal_logs WHERE user_id = ? AND date BETWEEN ? AND ?").all(req.user.id, start, end);
    
    const ingredientsMap = new Map();

    for (const meal of meals as any[]) {
      if (!meal.recipe_id) continue;
      
      const recipe: any = db.prepare("SELECT servings FROM recipes WHERE id = ?").get(meal.recipe_id);
      if (!recipe) continue;

      const ingredients = db.prepare("SELECT * FROM ingredients WHERE recipe_id = ?").all(meal.recipe_id);
      const multiplier = meal.servings / (recipe.servings || 1);

      for (const ing of ingredients as any[]) {
        const key = `${ing.name.toLowerCase()}-${ing.unit.toLowerCase()}`;
        if (ingredientsMap.has(key)) {
          const existing = ingredientsMap.get(key);
          existing.amount += ing.amount * multiplier;
        } else {
          ingredientsMap.set(key, {
            name: ing.name,
            amount: ing.amount * multiplier,
            unit: ing.unit,
            category: ing.category
          });
        }
      }
    }

    const insertItem = db.prepare("INSERT INTO shopping_list (user_id, name, amount, unit, category) VALUES (?, ?, ?, ?, ?)");
    for (const item of ingredientsMap.values()) {
      insertItem.run(req.user.id, item.name, item.amount, item.unit, item.category);
    }
  });

  transaction();

  const list = db.prepare("SELECT * FROM shopping_list WHERE user_id = ?").all(req.user.id);
  res.json(list);
});

app.post("/api/shopping-list/generate", authenticate, (req: any, res) => {
  // This is now handled automatically by the GET request to ensure it's always up to date
  res.json({ success: true });
});

app.patch("/api/shopping-list/:id", authenticate, (req: any, res) => {
  const { is_checked } = req.body;
  db.prepare("UPDATE shopping_list SET is_checked = ? WHERE id = ? AND user_id = ?").run(is_checked ? 1 : 0, req.params.id, req.user.id);
  res.json({ success: true });
});

app.delete("/api/shopping-list", authenticate, (req: any, res) => {
  db.prepare("DELETE FROM shopping_list WHERE user_id = ?").run(req.user.id);
  res.json({ success: true });
});

// --- Seeding Logic ---
async function seedRecipesIfEmpty() {
  const count: any = db.prepare("SELECT COUNT(*) as count FROM recipes").get();
  if (count.count > 0) return;

  console.log("Seeding recipes using Gemini...");
  
  try {
    const prompt = `Generate 100 diverse and healthy recipes in JSON format. 
    Each recipe should have: title, category (Breakfast, Lunch, Dinner, Snack), calories, protein, carbs, fat, servings, instructions, and ingredients (array of {name, amount, unit, category}).
    Categories for ingredients: vegetables, proteins, carbs, dairy, fruit, pantry, other.
    Make them varied: Italian, Asian, Mexican, Mediterranean, Vegetarian, Vegan, etc.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              category: { type: Type.STRING },
              calories: { type: Type.NUMBER },
              protein: { type: Type.NUMBER },
              carbs: { type: Type.NUMBER },
              fat: { type: Type.NUMBER },
              servings: { type: Type.NUMBER },
              instructions: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    name: { type: Type.STRING },
                    amount: { type: Type.NUMBER },
                    unit: { type: Type.STRING },
                    category: { type: Type.STRING }
                  },
                  required: ["name", "amount", "unit", "category"]
                }
              }
            },
            required: ["title", "category", "calories", "protein", "carbs", "fat", "servings", "instructions", "ingredients"]
          }
        }
      }
    });

    const recipes = JSON.parse(response.text || "[]");
    
    const insertRecipe = db.prepare(`
      INSERT INTO recipes (user_id, title, category, calories, protein, carbs, fat, servings, instructions)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const insertIngredient = db.prepare("INSERT INTO ingredients (recipe_id, name, amount, unit, category) VALUES (?, ?, ?, ?, ?)");

    const transaction = db.transaction((recipeList) => {
      for (const r of recipeList) {
        const info = insertRecipe.run(0, r.title, r.category, r.calories, r.protein, r.carbs, r.fat, r.servings, r.instructions);
        const recipeId = info.lastInsertRowid;
        for (const ing of r.ingredients) {
          insertIngredient.run(recipeId, ing.name, ing.amount, ing.unit, ing.category);
        }
      }
    });

    transaction(recipes);
    console.log(`Successfully seeded ${recipes.length} recipes.`);
  } catch (err) {
    console.error("Failed to seed recipes:", err);
  }
}

// --- Vite Setup ---
async function startServer() {
  await seedRecipesIfEmpty();
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
