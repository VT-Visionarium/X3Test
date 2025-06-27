import puppeteer from "puppeteer";
import { writeFileSync } from "fs";

export async function runX3Test({
  url,
  duration,
  outputFile,
  triggerSelector,
}) {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--enable-webgl", "--no-sandbox"],
  });

  const page = await browser.newPage();
  await page.goto(url);
  await page.waitForSelector("x3d");

  if (triggerSelector) {
    await page.waitForSelector(triggerSelector);
    await page.click(triggerSelector);
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const fpsData = await page.evaluate((duration) => {
    return new Promise((resolve) => {
      const x3d = document.querySelector("x3d");
      let results = [];
      let frameCount = 0;
      let secondCounter = 0;
      let lastTime = performance.now();

      function loop() {
        frameCount++;
        const now = performance.now();
        const elapsed = now - lastTime;

        if (elapsed >= 1000) {
          const fps = frameCount / (elapsed / 1000);
          results.push({
            second: ++secondCounter,
            fps: parseFloat(fps.toFixed(2)),
          });
          frameCount = 0;
          lastTime = now;
        }

        if (secondCounter < duration) {
          requestAnimationFrame(loop);
        } else {
          resolve(results);
        }
      }

      requestAnimationFrame(loop);
    });
  }, duration);

  writeFileSync(outputFile, JSON.stringify(fpsData, null, 2));
  console.log(`✅ Test completed. Results saved to ${outputFile}`);

  await browser.close();
}
