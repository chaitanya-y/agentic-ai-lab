import { fileURLToPath } from "node:url";
import path from "node:path";
import sharp from "sharp";

const scriptsDirectory = path.dirname(fileURLToPath(import.meta.url));
const appDirectory = path.resolve(scriptsDirectory, "../app");

const faviconArtwork = Buffer.from(`
  <svg width="512" height="512" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <clipPath id="tile">
        <rect x="16" y="16" width="480" height="480" rx="112"/>
      </clipPath>
    </defs>
    <g clip-path="url(#tile)">
      <rect width="512" height="512" fill="#173b2f"/>
      <circle cx="430" cy="94" r="105" fill="#b9d8df"/>
      <circle cx="472" cy="454" r="118" fill="#d77b4d"/>
      <rect x="32" y="424" width="174" height="52" rx="26" fill="#c7d85a"/>
      <text
        x="250"
        y="382"
        fill="#fffaf0"
        font-family="Georgia, Times New Roman, serif"
        font-size="338"
        font-weight="700"
        text-anchor="middle"
      >A</text>
    </g>
  </svg>
`);

await sharp(faviconArtwork).png().toFile(path.join(appDirectory, "icon.png"));
await sharp(faviconArtwork).resize(180, 180).png().toFile(path.join(appDirectory, "apple-icon.png"));

console.log("Generated app/icon.png and app/apple-icon.png");
