#!/usr/bin/env node
import { Command } from 'commander';
import { runX3Test } from '../src/runX3Test.js';

const program = new Command();
program
  .name('x3test')
  .description('Run X3D/X3DOM scene performance benchmark')
  .requiredOption('-u, --url <string>', 'URL of the page with X3D scene')
  .option('-d, --duration <number>', 'Duration of test in seconds', '20')
  .option('-o, --output <string>', 'Output file path', 'fps-log.json')
  .option('-t, --trigger <string>', 'CSS selector for animation trigger', '#beginTest')
  .parse(process.argv);

const opts = program.opts();

runX3Test({
  url: opts.url,
  duration: parseInt(opts.duration),
  outputFile: opts.output,
  triggerSelector: opts.trigger
});
