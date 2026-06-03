> Project Name : " Aether Wallet — Personal Expense Tracker"
>Link : https://6a1ffc47b5f1dd007d31648c--warm-cajeta-52f064.netlify.app/
//Host the frontend application on Netlify with a free domain provided by Netlify.

A clean, browser-based expense tracker built with vanilla HTML, CSS, and JavaScript. Created for the Friendsware Solutions 2025 Summer Internship Program.



 > Features:

- Add Expenses — Log a transaction with a title, amount (PKR), and category
- Live Total — Running total updates automatically with every add or delete
- Category Filter — Filter the transaction history by category
- Delete Transactions — Remove any entry with a smooth fade-out animation
- Form Validation — Real-time inline error messages for all fields
- Empty State — Friendly message shown when no transactions exist



>Project Structure:


├── index.html   # App layout and markup
├── style.css    # Styling, animations, and theme variables
└── app.js       # All logic  state, validation, rendering, events




> How to Run:

No build tools or dependencies required.

1. Download or clone the project folder
2. Open 'index.html' in any modern browser

That's it  the app runs entirely in the browser.



> Expense Categories:

| Category      | Description               |
|---------------|---------------------------|
| Food          | Meals, groceries, dining  |
| Transport     | Fuel, fares, rides        |
| Utilities     | Bills, internet, services |
| Entertainment | Leisure, subscriptions    |
| Other         | Anything else             |



> How It Works:

- Expenses are stored in a JavaScript array in memory (data resets on page refresh)
- Each expense gets a unique ID using `Date.now()`
- The table re-renders whenever an expense is added, deleted, or the filter changes
- User input is sanitized with `escapeHTML()` to prevent XSS


> Tech Stack:

- HTML5 — Semantic structure
- CSS3 — Custom properties, glassmorphism, keyframe animations
- JavaScript (ES6+) — DOM manipulation, event handling, array state management
- Google Fonts — Outfit & Plus Jakarta Sans
