# X3Test

**X3Test** is an automated performance benchmarking tool for X3D/X3DOM web scenes. It uses Puppeteer to simulate user interactions and collect FPS stats from X3DOM’s runtime.

## 📦 Install

```bash
npm install -g x3test
```

## 🚀 Usage

```bash
x3test --url https://example.com/scene.html --duration 20 --trigger "#startButton"
```

## 📈 Output

Logs are saved to `fps-log.json` by default, showing FPS every second.

## 💡 Features

- CLI and programmatic API
- No scene modification needed
- Works with any X3DOM-based web page
