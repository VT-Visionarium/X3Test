# X3Test

**X3Test** is a comprehensive automated performance benchmarking framework for X3D/X3DOM web scenes. It uses Puppeteer to simulate user interactions and collect detailed performance metrics including FPS and node count data from X3DOM's runtime.

## ✨ Features

- 🎯 **Dual Output Formats**: Choose between detailed per-second data or compact summary format
- 📊 **FPS Monitoring**: Real-time frame rate collection every second
- 🔢 **Node Count Tracking**: Extract actual scene complexity from X3DOM runtime
- 🖥️ **CLI & API**: Full command-line interface and JavaScript API
- 🚀 **Zero Configuration**: Works with any X3DOM-based web page without modification
- 📈 **Rich Metrics**: Average FPS, render time, and scene statistics
- 🎮 **Interactive Testing**: Support for animation triggers and user interactions

## 📦 Installation

### Global Installation (CLI)
```bash
npm install -g x3test
```

### Local Installation (API)
```bash
npm install x3test
```

## 🚀 Quick Start

### Command Line Interface

**Basic usage:**
```bash
x3test -u https://example.com/scene.html
```

**With custom options:**
```bash
x3test -u https://example.com/scene.html -d 15 -o results.json -f summary
```

**View all options:**
```bash
x3test --help
```

### JavaScript API

```javascript
import { runX3Test } from 'x3test';

await runX3Test({
  url: 'https://example.com/scene.html',
  duration: 10,
  outputFile: 'results.json',
  triggerSelector: '#startButton',
  format: 'detailed'
});
```

## 📋 CLI Options

| Option | Short | Description | Default |
|--------|-------|-------------|---------|
| `--url` | `-u` | URL of the page with X3D scene | **Required** |
| `--duration` | `-d` | Duration of test in seconds | `20` |
| `--output` | `-o` | Output file path | `fps-log.json` |
| `--trigger` | `-t` | CSS selector for animation trigger | `#beginTest` |
| `--format` | `-f` | Output format: `detailed` or `summary` | `detailed` |
| `--help` | `-h` | Display help information | - |

## 📊 Output Formats

### Detailed Format (`detailed`)

Per-second data with FPS and node count for each measurement:

```json
[
  {
    "second": 1,
    "fps": 59.87,
    "nodeCount": 2386
  },
  {
    "second": 2,
    "fps": 60.12,
    "nodeCount": 2390
  }
]
```

**Use cases:**
- Frame-by-frame analysis
- Performance debugging
- Detailed timeline visualization
- Identifying performance drops

### Summary Format (`summary`)

Compact overview with aggregated statistics:

```json
{
  "scene": "AnimatedModel",
  "duration": 15,
  "fpsLog": [60, 60, 59, 57, 60, 60, 58, 59, 60, 60, 60, 59, 60, 58, 60],
  "averageFPS": 59.3,
  "nodeCount": 2322,
  "renderTimeMs": 16.7
}
```

**Use cases:**
- Performance benchmarking
- Comparative analysis
- Automated testing pipelines
- Quick performance overviews

## 🔧 JavaScript API Reference

### `runX3Test(options)`

**Parameters:**

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| `url` | `string` | URL of the X3D scene page | **Required** |
| `duration` | `number` | Test duration in seconds | `20` |
| `outputFile` | `string` | Path for results file | `fps-log.json` |
| `triggerSelector` | `string` | CSS selector to trigger animation | `#beginTest` |
| `format` | `string` | Output format: `detailed` or `summary` | `detailed` |

**Returns:** `Promise<void>`

**Example:**
```javascript
import { runX3Test } from 'x3test';

// Detailed analysis
await runX3Test({
  url: 'https://mysite.com/3d-scene.html',
  duration: 30,
  outputFile: 'performance-detailed.json',
  triggerSelector: '.start-animation',
  format: 'detailed'
});

// Quick benchmark
await runX3Test({
  url: 'https://mysite.com/3d-scene.html',
  duration: 10,
  outputFile: 'benchmark.json',
  format: 'summary'
});
```

## 📈 Metrics Explained

### FPS (Frames Per Second)
- Real-time frame rate measurement
- Calculated using `requestAnimationFrame` timing
- Measured every second during the test duration

### Node Count
- Extracted from X3DOM runtime: `x3d.runtime.states.infos.valueOf()["#NODES:"]`
- Represents actual scene complexity
- Updates dynamically as scene changes
- Includes all X3D nodes in the scene graph

### Average FPS
- Arithmetic mean of all FPS measurements
- Provides overall performance indicator
- Useful for comparing different scenes or optimizations

### Render Time (ms)
- Calculated as `1000 / averageFPS`
- Time in milliseconds to render one frame
- Lower values indicate better performance

## 🎯 Use Cases

### Performance Testing
```bash
# Quick performance check
x3test -u https://mysite.com/scene.html -d 10 -f summary

# Detailed analysis
x3test -u https://mysite.com/scene.html -d 60 -f detailed
```

### Automated CI/CD
```javascript
// In your test suite
import { runX3Test } from 'x3test';

describe('3D Scene Performance', () => {
  it('should maintain 30+ FPS', async () => {
    await runX3Test({
      url: 'http://localhost:3000/scene.html',
      duration: 10,
      outputFile: 'ci-results.json',
      format: 'summary'
    });

    const results = JSON.parse(fs.readFileSync('ci-results.json'));
    expect(results.averageFPS).toBeGreaterThan(30);
  });
});
```

### Comparative Analysis
```bash
# Test different scenes
x3test -u https://site.com/scene-v1.html -o v1-results.json -f summary
x3test -u https://site.com/scene-v2.html -o v2-results.json -f summary

# Compare results programmatically
```

## 🛠️ Advanced Usage

### Custom Animation Triggers

Many X3D scenes require user interaction to start animations:

```bash
# Trigger with button click
x3test -u https://example.com/scene.html -t "#playButton"

# Trigger with custom selector
x3test -u https://example.com/scene.html -t ".animation-start"

# No trigger needed
x3test -u https://example.com/scene.html -t ""
```

### Long-running Tests

For comprehensive performance analysis:

```bash
# 5-minute detailed test
x3test -u https://example.com/scene.html -d 300 -f detailed -o long-test.json
```

### Batch Testing

```javascript
const scenes = [
  'https://example.com/scene1.html',
  'https://example.com/scene2.html',
  'https://example.com/scene3.html'
];

for (const [index, url] of scenes.entries()) {
  await runX3Test({
    url,
    duration: 15,
    outputFile: `scene-${index + 1}-results.json`,
    format: 'summary'
  });
}
```

## 🔍 Troubleshooting

### Common Issues

**Scene not loading:**
- Ensure the URL is accessible
- Check if the page contains `<x3d>` elements
- Verify X3DOM is properly loaded

**No animation trigger found:**
- Check if the trigger selector exists: `-t "#yourSelector"`
- Use browser dev tools to verify the selector
- Some scenes auto-start and don't need triggers

**Low FPS readings:**
- This might be accurate - check scene complexity
- Ensure hardware acceleration is enabled
- Consider the test environment (headless browser limitations)

**Node count is null:**
- X3DOM runtime might not be fully initialized
- Try increasing the wait time before measurement
- Verify X3DOM version compatibility

### Debug Mode

For troubleshooting, you can modify the source to run in non-headless mode:

```javascript
// In your local copy, modify the browser launch options
const browser = await puppeteer.launch({
  headless: false, // Set to false for debugging
  args: ["--enable-webgl", "--no-sandbox"],
});
```

## 📝 Requirements

- **Node.js**: 14.0.0 or higher
- **X3DOM**: Any version (tested with 1.8+)
- **Browser**: Chromium-based (automatically handled by Puppeteer)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues and pull requests.

### Development Setup

```bash
git clone https://github.com/VT-Visionarium/X3Test
cd X3Test
npm install
npm test
```

## 📄 License

MIT License - see LICENSE file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/VT-Visionarium/X3Test)
- [npm Package](https://www.npmjs.com/package/x3test)
- [X3DOM Official Site](https://www.x3dom.org/)

## 📊 Example Outputs

### Detailed Format Example
```json
[
  {
    "second": 1,
    "fps": 59.87,
    "nodeCount": 2386
  },
  {
    "second": 2,
    "fps": 60.12,
    "nodeCount": 2390
  },
  {
    "second": 3,
    "fps": 58.94,
    "nodeCount": 2386
  }
]
```

### Summary Format Example
```json
{
  "scene": "AnimatedModel",
  "duration": 15,
  "fpsLog": [60, 60, 59, 57, 60, 60, 58, 59, 60, 60, 60, 59, 60, 58, 60],
  "averageFPS": 59.3,
  "nodeCount": 2322,
  "renderTimeMs": 16.7
}
```

---

**Made with ❤️ for the X3D/X3DOM community at the Visionarium Lab in Virginia Tech**
