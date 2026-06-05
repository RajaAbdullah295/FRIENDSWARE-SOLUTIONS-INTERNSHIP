> Aether Wallet — Personal Expense Tracker Link : https://warm-cajeta-52f064.netlify.app/

> A clean, premium, browser-based expense tracker built with pure HTML, CSS, and JavaScript — no frameworks, no dependencies.

Built for the Friendsware Solutions 2025 Summer Internship Program screening task.



>  Overview

Aether Wallet is a Single Page Application (SPA) that lets users log, track, filter, sort, and manage their daily expenses in PKR. It features a modern glassmorphism dark UI with smooth animations and full data persistence via localStorage.



> Core Features

| Feature | Description |
|---|---|
| Add Expense | Log a transaction with title, amount (PKR), and category |
| Live Total | Running total updates automatically on every add or delete |
| Category Filter | Filter transaction history by selected category |
| Delete Transaction | Remove any entry with a smooth fade-out animation |
| Form Validation | Real-time inline error messages on all fields |
| Empty State | Friendly message shown when no transactions exist |



> Bonus Tasks Completed

> B1 — Local Storage Persistence
- All expenses are saved to `localStorage` automatically
- Data is fully restored after a hard page refresh
- No data loss on browser close or reload

> B2 — Sort Controls
- Sort expenses by amount Low to High or High to Low
- Sorting works alongside the category filter
- Active sort button highlighted with a gradient state

> B3 — Category Totals Breakdown
- A dynamic panel shows the total spent per category
- Only active categories (with at least one entry) are displayed
- Updates instantly on every add, edit, or delete action

> B4 — Inline Row Editing
- Each row has a pencil edit button next to the delete button
- Clicking Edit populates the form with that row's existing values
- Form switches to Edit Mode with a glowing purple border
- Submit button label changes to Update Transaction
- Saving updates the row in place with no duplicate created
- Cancel button reverts the form back to Add Mode



> How to Run

No installation or build tools needed.

1. Download or clone the project folder
2. Open `index.html` in any modern browser

The app runs entirely in the browser with no server required.

> Optionally use VS Code Live Server for a better development experience.



> Project Structure



├── index.html   # App layout and page structure
├── style.css    # Styling, animations, and theme variables
└── app.js       # All logic — state, validation, rendering, events




> Expense Categories

| Category      | Description               |
|---------------|---------------------------|
| Food          | Meals, groceries, dining  |
| Transport     | Fuel, fares, rides        |
| Utilities     | Bills, internet, services |
| Entertainment | Leisure, subscriptions    |
| Other         | Anything else             |



> How It Works

- Expenses are stored in a JavaScript array and synced to `localStorage`
- Each expense gets a unique ID using `Date.now()`
- The table re-renders on every add, edit, delete, or filter change
- Sorting applies to the filtered subset, not the full list
- User input is sanitized with `escapeHTML()` to prevent XSS attacks
- Form switches between Add Mode and Edit Mode when editing a row
- Category breakdown aggregates totals by iterating through the active array



> Tech Stack

- HTML5 — Semantic page structure
- CSS3 — Glassmorphism design, custom properties, keyframe animations
- JavaScript (ES6+) — DOM manipulation, event handling, array-based state management
- Google Fonts — Outfit & Plus Jakarta Sans



 >Author
Muhammad Abdullah
© 2025 Friendsware Solutions · Summer Internship Program · Screening Task
