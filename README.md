<div align="center">
  <img width="1200" height="475" alt="Vasilicò Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

  <h1>🌿 Vasilicò</h1>
  <p><strong>La tua app premium per la salute e la nutrizione</strong></p>
  <p>
    Monitoraggio del peso · Pianificazione pasti · Ricettario intelligente · Lista della spesa automatica
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

## 📖 Indice

- [Panoramica](#-panoramica)
- [Screenshot](#-screenshot)
- [Funzionalità](#-funzionalità)
- [Stack Tecnologico](#-stack-tecnologico)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Installazione e Avvio](#-installazione-e-avvio)
- [Variabili d'Ambiente](#-variabili-dambiente)
- [API Endpoints](#-api-endpoints)
- [Schema del Database](#-schema-del-database)
- [Script Disponibili](#-script-disponibili)

---

## 🌟 Panoramica

**Vasilicò** è un'applicazione web full-stack per il monitoraggio della salute e della nutrizione personale. Progettata con un'interfaccia moderna e intuitiva, permette di gestire il proprio peso, pianificare i pasti settimanali, esplorare un ricettario con oltre 100 ricette generate tramite AI e generare automaticamente la lista della spesa.

L'app utilizza un backend **Express.js** con database **SQLite** per la persistenza dei dati e integra **Google Gemini AI** per la generazione intelligente delle ricette. Il frontend è costruito con **React 19** e **Tailwind CSS**, offrendo un'esperienza utente fluida con animazioni e design responsive.

---

## 📸 Screenshot

### Dashboard
La dashboard offre una panoramica completa: peso attuale, nutrizione giornaliera, programma settimanale e accesso rapido a ricettario e lista della spesa.

<div align="center">
  <img src="https://github.com/user-attachments/assets/f3d193b1-2c27-451d-b11d-ad05a7ec7c83" alt="Dashboard" width="900" />
</div>

### Monitoraggio Peso
Registra il tuo peso giorno per giorno e visualizza i progressi nel tempo con grafici interattivi.

<div align="center">
  <img src="https://github.com/user-attachments/assets/0345494a-f5a0-4397-a022-97e586e6ecc8" alt="Monitoraggio Peso" width="900" />
</div>

### Piano Pasti
Organizza la tua alimentazione settimanale giorno per giorno, con riepilogo calorico e nutrizionale per ogni giornata.

<div align="center">
  <img src="https://github.com/user-attachments/assets/d159ae31-886c-456e-a883-b4724cf3e64c" alt="Piano Pasti" width="900" />
</div>

### Ricettario
Sfoglia oltre 100 ricette suddivise per categoria (Colazione, Pranzo, Cena, Spuntino) con dettagli nutrizionali completi, ingredienti e istruzioni.

<div align="center">
  <img src="https://github.com/user-attachments/assets/dbade01e-a1a0-4a9e-8066-66bbd6a3aab5" alt="Ricettario" width="900" />
</div>

### Lista della Spesa
Generata automaticamente dal piano pasti settimanale, con aggregazione intelligente degli ingredienti duplicati e organizzazione per categoria.

<div align="center">
  <img src="https://github.com/user-attachments/assets/d39a69cd-3ab8-4e9b-bc04-b5e74cdfc590" alt="Lista della Spesa" width="900" />
</div>

### Autenticazione
Sistema di login e registrazione sicuro con crittografia delle password e sessioni JWT.

<div align="center">
  <img src="https://github.com/user-attachments/assets/5af5d20a-ada6-4130-88d0-3dd708b02d48" alt="Login e Registrazione" width="900" />
</div>

---

## ✨ Funzionalità

### 🔐 Autenticazione Utente
- Registrazione e login con email e password
- Sessioni sicure con **JWT** (scadenza a 7 giorni)
- Crittografia delle password con **bcryptjs**
- Gestione profilo utente personalizzabile

### ⚖️ Monitoraggio del Peso
- Registrazione giornaliera del peso
- Grafico interattivo dei progressi (area chart)
- Cronologia completa delle registrazioni
- Analisi dell'andamento nel tempo

### 🍽️ Piano Pasti Settimanale
- Pianificazione giorno per giorno
- Navigazione tra le settimane
- Riepilogo calorico e nutrizionale per giornata
- Aggiunta pasti dal ricettario o manuali
- Note personalizzate per ogni pasto

### 📖 Ricettario Intelligente
- **100+ ricette** generate automaticamente con Google Gemini AI
- Categorie: Colazione, Pranzo, Cena, Spuntino
- Informazioni nutrizionali dettagliate (calorie, proteine, carboidrati, grassi)
- Lista ingredienti con quantità e unità di misura
- Ricerca e filtri per nome o categoria
- Possibilità di creare ricette personalizzate

### 🛒 Lista della Spesa Automatica
- Generazione automatica dal piano pasti settimanale
- Aggregazione intelligente degli ingredienti duplicati
- Organizzazione per categoria (verdure, proteine, latticini, ecc.)
- Check-off degli articoli durante la spesa
- Funzione di stampa

### 📊 Dashboard
- Panoramica del peso attuale e variazione
- Riepilogo nutrizione giornaliera
- Programma settimanale a colpo d'occhio
- Accesso rapido a ricettario e lista della spesa

### 💾 Import/Export Dati
- Esportazione completa dei dati in formato JSON
- Importazione dati da backup precedenti
- Storage locale nel browser (localStorage)

---

## 🛠️ Stack Tecnologico

### Frontend
| Tecnologia | Versione | Utilizzo |
|---|---|---|
| [React](https://react.dev) | 19.0 | Libreria UI principale |
| [TypeScript](https://www.typescriptlang.org) | 5.8 | Type-safety e sviluppo robusto |
| [Vite](https://vite.dev) | 6.2 | Build tool e dev server |
| [Tailwind CSS](https://tailwindcss.com) | 4.1 | Styling utility-first |
| [Motion](https://motion.dev) | 12.x | Animazioni fluide |
| [Recharts](https://recharts.org) | 3.7 | Grafici interattivi |
| [Lucide React](https://lucide.dev) | 0.546 | Icone |
| [date-fns](https://date-fns.org) | 4.1 | Formattazione date |

### Backend
| Tecnologia | Versione | Utilizzo |
|---|---|---|
| [Express.js](https://expressjs.com) | 4.21 | Server HTTP e API REST |
| [Better-sqlite3](https://github.com/WiseLibs/better-sqlite3) | 12.4 | Database SQLite embedded |
| [Google Gemini AI](https://ai.google.dev) | 1.29 | Generazione ricette con AI |
| [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) | 9.0 | Autenticazione JWT |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | 3.0 | Hashing password |
| [cookie-parser](https://github.com/expressjs/cookie-parser) | 1.4 | Gestione cookie |
| [dotenv](https://github.com/motdotla/dotenv) | 17.2 | Variabili d'ambiente |

---

## 📁 Struttura del Progetto

```
Vasilicò/
├── index.html                  # Entry point HTML
├── server.ts                   # Server Express.js (backend)
├── vite.config.ts              # Configurazione Vite
├── tsconfig.json               # Configurazione TypeScript
├── package.json                # Dipendenze e script
├── metadata.json               # Metadati dell'app
├── .env.example                # Template variabili d'ambiente
├── public/                     # Asset statici
└── src/
    ├── main.tsx                # Entry point React
    ├── App.tsx                 # Componente principale con navigazione
    ├── index.css               # Stili globali e Tailwind
    ├── types.ts                # Interfacce TypeScript
    ├── components/
    │   ├── Auth.tsx            # Login e registrazione
    │   ├── Dashboard.tsx       # Dashboard principale
    │   ├── WeightTracker.tsx   # Monitoraggio peso
    │   ├── MealPlanner.tsx     # Pianificazione pasti
    │   ├── RecipeBook.tsx      # Ricettario
    │   ├── RecipeViewModal.tsx # Modale dettaglio ricetta
    │   ├── ShoppingList.tsx    # Lista della spesa
    │   └── Profile.tsx         # Profilo utente
    ├── constants/
    │   └── defaultRecipes.ts   # Ricette predefinite di fallback
    ├── lib/
    │   └── utils.ts            # Utility (cn per classi CSS)
    └── services/
        └── storageService.ts   # Servizio localStorage
```

---

## 🚀 Installazione e Avvio

### Prerequisiti

- **Node.js** (versione 18 o superiore)
- **npm** (incluso con Node.js)
- Una **chiave API Google Gemini** (per la generazione ricette con AI) — [Ottienila qui](https://ai.google.dev)

### Passaggi

1. **Clona il repository**

   ```bash
   git clone https://github.com/iAlias/Vasilico.git
   cd Vasilico
   ```

2. **Installa le dipendenze**

   ```bash
   npm install
   ```

3. **Configura le variabili d'ambiente**

   Copia il file di esempio e inserisci i tuoi valori:

   ```bash
   cp .env.example .env
   ```

   Modifica il file `.env` con i tuoi dati (vedi [Variabili d'Ambiente](#-variabili-dambiente)).

4. **Avvia il server di sviluppo**

   ```bash
   npm run dev
   ```

5. **Apri il browser**

   Vai su [http://localhost:3000](http://localhost:3000) 🎉

> **Nota:** Al primo avvio, se la chiave API Gemini è configurata correttamente, il server genererà automaticamente oltre 100 ricette utilizzando l'intelligenza artificiale. Questo processo avviene una sola volta.

---

## 🔑 Variabili d'Ambiente

Crea un file `.env` nella root del progetto basandoti su [`.env.example`](.env.example):

| Variabile | Obbligatoria | Descrizione |
|---|---|---|
| `GEMINI_API_KEY` | ✅ | Chiave API per Google Gemini AI. Necessaria per la generazione delle ricette. |
| `JWT_SECRET` | ✅ | Chiave segreta per la firma dei token JWT. Usa una stringa lunga e casuale. |
| `APP_URL` | ❌ | URL dove l'app è ospitata (default: `http://localhost:3000`). |

```env
GEMINI_API_KEY="la_tua_chiave_gemini"
JWT_SECRET="una_stringa_segreta_molto_lunga_e_casuale"
APP_URL="http://localhost:3000"
```

---

## 🔌 API Endpoints

Tutte le API richiedono autenticazione tramite cookie JWT (eccetto le rotte di auth).

### Autenticazione

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `POST` | `/api/auth/signup` | Registra un nuovo utente |
| `POST` | `/api/auth/login` | Effettua il login |
| `POST` | `/api/auth/logout` | Effettua il logout |
| `GET` | `/api/auth/me` | Ottiene l'utente corrente |

### Peso

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/weight` | Lista tutte le registrazioni del peso |
| `POST` | `/api/weight` | Registra un nuovo peso |
| `DELETE` | `/api/weight/:id` | Elimina una registrazione |

### Ricette

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/recipes` | Lista tutte le ricette |
| `POST` | `/api/recipes` | Crea una nuova ricetta |
| `DELETE` | `/api/recipes/:id` | Elimina una ricetta |

### Pasti

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/meals?start=YYYY-MM-DD&end=YYYY-MM-DD` | Lista i pasti in un intervallo di date |
| `POST` | `/api/meals` | Registra un nuovo pasto |
| `DELETE` | `/api/meals/:id` | Elimina un pasto |

### Lista della Spesa

| Metodo | Endpoint | Descrizione |
|---|---|---|
| `GET` | `/api/shopping-list` | Genera e restituisce la lista della spesa |
| `PATCH` | `/api/shopping-list/:id` | Segna/deseleziona un articolo |
| `DELETE` | `/api/shopping-list` | Svuota la lista della spesa |

---

## 🗄️ Schema del Database

L'applicazione utilizza **SQLite** con le seguenti tabelle:

```sql
-- Utenti registrati
users (id, email, password, name, created_at)

-- Registrazioni del peso
weight_logs (id, user_id, weight, date)

-- Ricette (user_id = 0 per le ricette di sistema generate da AI)
recipes (id, user_id, title, category, calories, protein, carbs, fat, servings, instructions)

-- Ingredienti delle ricette
ingredients (id, recipe_id, name, amount, unit, category)

-- Pasti pianificati/registrati
meal_logs (id, user_id, recipe_id, title, category, calories, protein, carbs, fat, servings, date, notes)

-- Lista della spesa
shopping_list (id, user_id, name, amount, unit, category, is_checked)
```

Le categorie degli ingredienti includono: `vegetables`, `proteins`, `carbs`, `dairy`, `fruit`, `pantry`, `other`.

---

## 📜 Script Disponibili

| Comando | Descrizione |
|---|---|
| `npm run dev` | Avvia il server di sviluppo su `http://localhost:3000` |
| `npm run build` | Compila il frontend per la produzione nella cartella `dist/` |
| `npm run preview` | Anteprima della build di produzione |
| `npm run lint` | Controllo dei tipi TypeScript (`tsc --noEmit`) |
| `npm run clean` | Rimuove la cartella `dist/` |

---

<div align="center">
  <p>Fatto con 💚 — <strong>Vasilicò</strong></p>
</div>
