# AI Co-Browsing Chatbot (Next.js + Gemini)

An AI-powered co-browsing assistant for a portfolio website.
It can understand the current page content dynamically and perform actions like:

- Scroll up/down
- Navigate to sections (Projects, Skills, Contact)
- Highlight elements
- Click buttons/links
- Fill forms

This project uses **Next.js (React)** + **Gemini API** and a simple tool-command system:
`[TOOL:name{...}]`

---

## Setup Instructions

### 1) Clone & Install

```bash
git clone https://github.com/rakesh-jaiswal23/portfolio-co-browsing.git
npm install
```

### 2) Create `.env`

Create a file named `.env` in the root directory:

```env
# Gemini API Key (Get key from Google AI Studio)
NEXT_PUBLIC_GEMINI_API_KEY=YOUR_GEMINI_API_KEY_HERE
```

> ⚠️ Never commit `.env` to GitHub.

### 3) Run the Project

```bash
npm run dev
```

Open:
[http://localhost:3000](http://localhost:3000)

---

## 🔑 Gemini API Configuration

This project uses the official Gemini SDK:

```js
import { GoogleGenerativeAI } from "@google/generative-ai";
```

Gemini is called from:

- `lib/gemini.js`

The model used:

- `gemini-2.5-flash`

The assistant is prompted to return actions in this format:

```txt
[TOOL:scroll{"direction":"down"}] Scrolling down!
```

---

## 🏗️ Architecture Overview

### 1) ChatInterface (UI + Controller)

**File:** `components/ChatBot/ChatInterface.jsx`

Responsibilities:

- Shows chat UI
- Stores messages + loading state
- Sends user message to Gemini
- Parses tool commands from Gemini response
- Executes actions via `ActionHandler`

---

### 2) DOMExtractor (Website Context Builder)

**File:** `components/CoBrowsing/DOMExtractor.js`

Responsibilities:

- Scans current website DOM
- Extracts:
  - Sections
  - Projects
  - Skills
  - Forms

- Builds a structured JSON context
- Sends this context to Gemini so the AI understands the page dynamically

---

### 3) ActionHandler (Tool Executor)

**File:** `components/CoBrowsing/ActionHandler.js`

Responsibilities:

- Executes tool calls returned by Gemini:
  - `scroll`
  - `navigate`
  - `highlight`
  - `click`
  - `fillForm`

Example:

```js
ActionHandler.handleToolCall("scroll", { direction: "down" });
```

---

### 4) Tool Parsing System

Gemini returns commands in the response:

```txt
[TOOL:navigate{"section":"projects"}] Taking you to projects!
```

The chat interface extracts tool calls using regex, converts JSON params to objects,
and executes them in the browser.

---

##  Notes / Security

- `.env` is ignored using `.gitignore`
- Never expose API keys in public repos
- If a key is leaked, revoke it immediately in Google AI Studio

---

##  Example Commands

User can type:

- `scroll down`
- `scroll up`
- `go to projects`
- `go to skills`
- `go to contact`
- `highlight LocalMart`
- `click Contact`
- `fill form`

---

##  License
MIT
