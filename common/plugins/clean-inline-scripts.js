import fs from "node:fs";
import path from "node:path";

const buildDir = path.resolve("build");
const htmlPath = path.join(buildDir, "index.html");

if (fs.existsSync(htmlPath)) {
  let html = fs.readFileSync(htmlPath, "utf-8");

  // Regex to find Svelte's inline script
  const scriptRegex = /<script>([\s\S]*?)<\/script>/i;
  const match = html.match(scriptRegex);

  if (match) {
    let inlineScriptContent = match[1].trim();
    // Resolve absolute imports in the extracted initializer script too
    inlineScriptContent = inlineScriptContent.replaceAll('import("/', 'import("./');

    const externalScriptName = `start-sveltekit-${Date.now()}.js`;
    const externalScriptPath = path.join(buildDir, externalScriptName);

    // Save the inline script code into an external file
    fs.writeFileSync(externalScriptPath, inlineScriptContent, "utf-8");
    console.log(`Extracted SvelteKit inline script to ${externalScriptName}`);

    // Replace inline script with external script reference
    html = html.replace(scriptRegex, `<script src="./${externalScriptName}"></script>`);
    // Ensure all absolute paths in build/index.html to svelte kit scripts/assets are relative for chrome-extension:// protocol
    html = html.replaceAll('src="/', 'src="./');
    html = html.replaceAll('href="/', 'href="./');
    html = html.replaceAll('import("/', 'import("./');
    fs.writeFileSync(htmlPath, html, "utf-8");
    console.log("Successfully updated index.html to load SvelteKit externally.");
  } else {
    console.log("No inline script found in index.html to extract.");
  }
} else {
  console.error("build/index.html not found! Ensure build succeeds first.");
}
