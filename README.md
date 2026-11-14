# 📱 Secure React Native Calculator

A React Native calculator built with Expo and TypeScript, designed with input validation and defensive coding in mind.

## ✨ Features
- 🔢 **Safe expression evaluation:** Uses a custom parser instead of `eval()`, with input sanitization
- ➗ **Edge-case handling:** Division-by-zero checks and graceful error handling
- 🌗 **Dark / Light mode:** [Automatic system detection / Manual toggle]
- 🌍 **RTL and LTR layouts:** Adapts to right-to-left and left-to-right languages [languages supported, e.g., Arabic and English]
- 🧩 **Modular structure:** Calculation logic is separated from UI components

## 🛠️ Tech Stack
- React Native + Expo
- TypeScript / JavaScript
- StyleSheet for styling

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo Go app or an Android/iOS emulator

### Installation
git clone <repo-url>
cd calculator-app
npm install

### Run
npx expo start

## 📁 Project Structure
src/
├── components/   # UI components (display, buttons)
├── logic/        # Calculation and parsing logic
└── utils/        # Helpers

## 📸 Screenshots
(add screenshots here)

## 🗺️ Roadmap
- [ ] Unit tests for calculation logic
- [ ] Calculation history

## 📄 License
MIT
