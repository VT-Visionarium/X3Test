import puppeteer from "puppeteer";
import { writeFileSync } from "fs";

export async function runX3Test({
  url,
  duration,
  outputFile,
  triggerSelector,
  format = "detailed", // "detailed" or "summary"
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

  const performanceData = await page.evaluate(
    (duration, format) => {
      return new Promise((resolve) => {
        const x3d = document.querySelector("x3d");
        let results = [];
        let fpsLog = [];
        let frameCount = 0;
        let secondCounter = 0;
        let lastTime = performance.now();
        let totalFps = 0;
        let finalNodeCount = 0;

        function getNodeCount() {
          try {
            // Get nodecount from X3DOM runtime states
            const runtime = x3d.runtime;
            if (runtime && runtime.states && runtime.states.infos) {
              const infos = runtime.states.infos.valueOf();

              // Check if infos has #NODES property directly
              if (infos["#NODES:"]) {
                return infos["#NODES:"];
              }

              // Parse the #NODES value from the infos array/string
              if (Array.isArray(infos)) {
                for (let i = 0; i < infos.length; i++) {
                  const info = infos[i];
                  if (typeof info === "string" && info.includes("#NODES::")) {
                    const match = info.match(/#NODES::\s*(\d+)/);
                    if (match) {
                      return parseInt(match[1]);
                    }
                  }
                }
              }

              // If infos is a string, parse it directly
              if (typeof infos === "string" && infos.includes("#NODES::")) {
                const match = infos.match(/#NODES::\s*(\d+)/);
                if (match) {
                  return parseInt(match[1]);
                }
              }
            }
          } catch (error) {
            console.warn("Could not get node count:", error);
            return null;
          }
        }

        function loop() {
          frameCount++;
          const now = performance.now();
          const elapsed = now - lastTime;

          if (elapsed >= 1000) {
            const fps = frameCount / (elapsed / 1000);
            const nodeCount = getNodeCount();
            const roundedFps = parseFloat(fps.toFixed(2));

            // Collect data for detailed format
            if (format === "detailed") {
              results.push({
                second: ++secondCounter,
                fps: roundedFps,
                nodeCount: nodeCount,
              });
            } else {
              // Collect data for summary format
              secondCounter++;
              fpsLog.push(Math.round(fps));
              totalFps += roundedFps;
              finalNodeCount = nodeCount; // Keep updating to get final count
            }

            frameCount = 0;
            lastTime = now;
          }

          if (secondCounter < duration) {
            requestAnimationFrame(loop);
          } else {
            if (format === "summary") {
              const averageFPS = parseFloat((totalFps / duration).toFixed(1));
              const renderTimeMs = parseFloat((1000 / averageFPS).toFixed(1));

              resolve({
                scene: "AnimatedModel",
                duration: duration,
                fpsLog: fpsLog,
                averageFPS: averageFPS,
                nodeCount: finalNodeCount,
                renderTimeMs: renderTimeMs,
              });
            } else {
              resolve(results);
            }
          }
        }

        requestAnimationFrame(loop);
      });
    },
    duration,
    format,
  );

  writeFileSync(outputFile, JSON.stringify(performanceData, null, 2));
  console.log(
    `✅ Test completed. Results (${format} format) saved to ${outputFile}`,
  );

  await browser.close();
}
