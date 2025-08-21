# onepage
The most complex single page application EVER

## Getting Started

Prereqs: Node.js 20.18+ (Node 20.19+ recommended by Vite), npm 10+.

1. Install deps

```
cd web
npm install
```

2. Run the dev server

```
npm run dev
```

Visit `http://localhost:5173`.

3. Build for production

```
npm run build
npm run preview
```

## Project Structure

- `web/`: Vite + React + TypeScript app
- Single, ultra-rich page composed of:
  - 3D interactive scene (react-three-fiber + drei) with orbit controls
  - Animated rainbow background and glitter/sparkles overlay
  - Live data dashboard: chart + virtualized list (React Query + MSW)
  - Global state via Redux Toolkit

## Vision: One Very, Very Complex Page

This project intentionally avoids multi-page routing. The goal is a maximal single page that combines:

- Interactive 3D elements (stars, sparkles, glossy objects)
- Rich animated visuals (rainbows, blur, glassmorphism)
- Real-time-esque data widgets (charts, big lists) using mocked APIs
- Robust client architecture (Redux, React Query, Tailwind)

Feel free to request more over-the-top visual or data features and we’ll stack them into the single page.