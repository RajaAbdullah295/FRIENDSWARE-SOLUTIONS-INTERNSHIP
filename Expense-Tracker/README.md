>Project Name:  Aether Wallet — Personal Expense Tracker

A browser-based personal expense tracker built with vanilla HTML, CSS, and JavaScript. Created for the Friendsware Solutions 2025 Summer Internship Program.



> Project Files

- `index.html` — App layout and all page structure
- `style.css` — Visual styling, animations, and theme
- `app.js` — All logic: state management, validation, rendering, events


> Features

- Add an expense with a title, amount (PKR), and category
- Running total updates automatically on every add or delete
- Filter transaction history by category
- Delete any transaction with a fade-out animation
- Real-time inline form validation with error messages
- Empty state message when no transactions exist



> How to Run

No installation or build tools needed.

1. Download or clone the project folder
2. Open `index.html` in any modern browser

The app runs entirely in the browser with no server required.



> Expense Categories

| Category      | Examples                          |
|---------------|-----------------------------------|
| Food          | Meals, groceries, dining out      |
| Transport     | Fuel, bus fares, ride-hailing     |
| Utilities     | Electricity, internet, phone bills|
| Entertainment | Streaming, events, leisure        |
| Other         | Anything that does not fit above  |

 

> How the Logic Works

- Expenses are stored in a JavaScript array in memory — data resets on page refresh
- Each expense gets a unique ID using `Date.now()`
- The table re-renders whenever an expense is added, deleted, or the filter changes
- User input is sanitized via `escapeHTML()` to prevent XSS attacks
- Form validation runs in real-time on each field and again on submit
 

> Tech Stack

- HTML5 — Semantic page structure
- CSS3 — Glassmorphism design, custom properties, keyframe animations
- JavaScript (ES6+) — DOM manipulation, event handling, array-based state
- Google Fonts — Outfit & Plus Jakarta Sans



> Current Progress

I am currently working on this project. At this stage, only the HTML structure is built. In the next steps, I will add **CSS** for styling, layout, and theming — followed by **JavaScript** for interactivity and dynamic behavior.

 

© 2025 Friendsware Solutions · Summer Internship Program · Screening Task
