🕒 Clock Learning Game (עולם השעון)

A colorful, interactive, and voiced React application designed to teach children how to read analog clocks in Hebrew. The app covers full hours, half-hours, and quarters with interactive lessons and quizzes.

📺 Project Preview

Once installed, your project structure and the running app will look like this:

Folder Structure

clock-game/
├── node_modules/
├── public/
├── src/
│   ├── App.jsx        <-- (Paste the game code here)
│   ├── index.css      <-- (Add Tailwind directives here)
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js <-- (Configuration file)
└── vite.config.js


Game Interface

The application features a clean, child-friendly UI with:

Analog Clock: Animated SVG hands.

Progress Tracking: Star system for completed lessons.

Responsive Layout: Optimized for both mobile and desktop.

🚀 Getting Started Locally

Follow these steps to get the project running on your own computer.

1. Prerequisites

Make sure you have Node.js (version 18 or higher) installed. You can download it from nodejs.org.

2. Create the Project

We recommend using Vite for a fast development experience. Open your terminal/command prompt and run:

# Create a new React project
npm create vite@latest clock-game -- --template react

# Enter the project directory
cd clock-game


3. Install Dependencies

This project uses Tailwind CSS for styling and Lucide React for icons.

# Install Lucide React icons
npm install lucide-react


4. Setup Tailwind CSS

To make the styles look correct, you need to initialize Tailwind:

Install Tailwind and its peers:

npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p


Open tailwind.config.js and replace its content with:

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}


Open src/index.css and replace everything with:

@tailwind base;
@tailwind components;
@tailwind utilities;


5. Add the Game Code

Open the project in your code editor (like VS Code).

Open src/App.jsx.

Delete all the existing code in that file.

Copy the entire code from the App.jsx file in the Canvas and paste it into src/App.jsx.

6. Run the App

Go back to your terminal and run:

npm run dev


The terminal will provide a link (usually http://localhost:5173). Open it in your browser to start playing!

🛠 Features Included

Interactive Analog Clock: Rendered using SVG for sharp visuals.

Hebrew Voiceover: Integrated with Google Gemini TTS API.

Responsive Design: Works on desktops, tablets, and mobile phones.

Progression System: Three structured levels of learning.

📝 Note on Voice Support

The speakText function in the code uses an empty apiKey. To enable the AI voice features locally, you would need to provide a valid Google Gemini API key. If left empty, the game remains fully playable but will remain silent.
