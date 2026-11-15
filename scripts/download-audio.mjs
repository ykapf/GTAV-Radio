// Downloads every MP3 listed in the public/audio/**/_files.txt checklists from its YouTube link.
//
//   npm run audio:download                 every missing file
//   npm run audio:download -- gta-5        one game (or gta-5/non-stop-pop-100-7-fm for one station)
//   npm run audio:download -- --jobs 1     fewer downloads at once (default 2)
//   npm run audio:download -- --cookies    use Chrome's YouTube login if YouTube asks to confirm you're not a bot
//
// Needs yt-dlp and ffmpeg (brew install yt-dlp ffmpeg). Files that already exist are skipped,
// so it's safe to stop with Ctrl+C and run again. Failures are listed in public/audio/_failed.txt.
// Run `npm run audio` afterwards to record the new files.

import { spawn } from "node:child_process";
import { existsSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const AUDIO = join(dirname(fileURLToPath(import.meta.url)), "..", "public", "audio");
const FAILED = join(AUDIO, "_failed.txt");
/** YouTube serves ~130 kbps audio, so a constant 160 kbps keeps its quality and seeks exactly in every browser. */
const BITRATE = "160K";
/** Long enough for the 2-hour commercials and news videos; anything slower has stalled. */
const TIMEOUT_MS = 20 * 60 * 1000;
/** YouTube sometimes refuses a download (403) that works a minute later, so each file gets this many tries. */
const ATTEMPTS = 3;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const jobsAt = args.indexOf("--jobs");
const jobs = jobsAt >= 0 ? Math.max(1, Number(args[jobsAt + 1]) || 1) : 2;
const filters = args.filter((a, i) => !a.startsWith("--") && args[i - 1] !== "--jobs");

function checklists(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return checklists(path);
    return name === "_files.txt" ? [path] : [];
  });
}

/** Every [ ] entry: the file name is followed by a title line and its YouTube link. */
function missingFiles() {
  const out = [];
  for (const list of checklists(AUDIO)) {
    const dir = dirname(list);
    const folder = relative(AUDIO, dir).split("\\").join("/");
    if (folder.startsWith("gta-6")) continue;
    if (filters.length && !filters.some((f) => folder === f || folder.startsWith(`${f}/`))) continue;
    const lines = readFileSync(list, "utf8").split("\n");
    for (let i = 0; i < lines.length; i++) {
      const match = lines[i].match(/^\[[ x]\] (.+\.mp3)$/);
      if (!match) continue;
      const url = lines.slice(i + 1, i + 4).find((l) => l.trim().startsWith("https://"))?.trim();
      const file = join(dir, match[1]);
      if (url && !existsSync(file)) out.push({ file, url: url.replace(/\?t=\d+$/, ""), name: `${folder}/${match[1]}` });
    }
  }
  return out;
}

function download({ file, url }) {
  const base = file.slice(0, -".mp3".length);
  const ytArgs = [
    "--no-playlist",
    "--no-progress",
    "--quiet",
    "--no-warnings",
    "--format", "bestaudio/best",
    "--extract-audio",
    "--audio-format", "mp3",
    "--audio-quality", BITRATE,
    "--retries", "3",
    "--fragment-retries", "3",
    "--sleep-requests", "1",
    "--output", `${base}.%(ext)s`,
    ...(flag("--cookies") ? ["--cookies-from-browser", "chrome"] : []),
    url,
  ];
  return new Promise((resolve) => {
    const child = spawn("yt-dlp", ytArgs, { stdio: ["ignore", "ignore", "pipe"] });
    let error = "";
    const timer = setTimeout(() => {
      error += "\ntimed out";
      child.kill("SIGKILL");
    }, TIMEOUT_MS);
    child.stderr.on("data", (d) => (error += d));
    child.on("error", (e) => resolve(e.code === "ENOENT" ? "yt-dlp isn't installed (brew install yt-dlp ffmpeg)" : e.message));
    child.on("close", (code) => {
      clearTimeout(timer);
      if (code === 0 && existsSync(file)) return resolve(null);
      // Leave no half-finished file behind, so the next run retries it.
      for (const name of readdirSync(dirname(file))) {
        const path = join(dirname(file), name);
        if (path.startsWith(`${base}.`) && path !== file) rmSync(path, { force: true });
      }
      resolve(error.trim().split("\n").pop() || `yt-dlp exited with code ${code}`);
    });
  });
}

const queue = missingFiles();
const total = queue.length;
const failed = [];
let done = 0;
let interrupted = false;
process.on("SIGINT", () => {
  interrupted = true;
  console.log("\nStopping after the current downloads finish. Run it again to carry on.");
});

console.log(total ? `Downloading ${total} missing MP3s, ${jobs} at a time.` : "Nothing to download: every listed MP3 is already there.");

async function worker() {
  while (queue.length && !interrupted) {
    const item = queue.shift();
    const error = await download(item);
    item.tries = (item.tries ?? 0) + 1;
    if (error && item.tries < ATTEMPTS && !interrupted) {
      queue.push(item);
      console.log(`[retry later] ${item.name}: ${error}`);
      continue;
    }
    done++;
    if (error) failed.push(`${item.name}\n    ${item.url}\n    ${error}`);
    console.log(`[${done}/${total}] ${error ? "FAILED" : "ok    "} ${item.name}${error ? `: ${error}` : ""}`);
  }
}

await Promise.all(Array.from({ length: jobs }, worker));

if (failed.length) {
  writeFileSync(FAILED, `${failed.length} downloads failed. Run the script again to retry them.\n\n${failed.join("\n\n")}\n`);
  console.log(`\n${failed.length} failed; they're listed in public/audio/_failed.txt.`);
} else if (existsSync(FAILED)) {
  rmSync(FAILED);
}
console.log(`\nDone: ${done - failed.length} downloaded. Now run \`npm run audio\` to record them.`);
