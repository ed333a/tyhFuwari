// scripts/subset-font.mjs
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { glob } from 'glob';
import { JSDOM } from 'jsdom';
import subsetFont from 'subset-font';

// your font root, do not add a '/' suffix.
const fontRoot = "public/fonts";
// for clean dist fonts
const distFontRoot = "dist/fonts"
// font subset output direction
const outputDir = "dist/_astro/fonts";
const fontTypeConfig = {in: "ttf", out: "woff2"};

// font lists
const fontConfigs = [
    // { family: 'Yozai'                   , file: 'yozai/Yozai-Light'                              , weight: 300, style: "normal", },
    { family: 'Yozai'                   , file: 'yozai/Yozai-Regular'                            , weight: 400, style: "normal", },
    // { family: 'Yozai'                   , file: 'yozai/Yozai-Medium'                             , weight: 500, style: "normal", },
    // { family: 'LXGWWenKaiMonoGB'        , file: 'lxgw-wenkai-gb/LXGWWenKaiMonoGB-Light'          , weight: 300, style: "normal", },
    { family: 'LXGWWenKaiMonoGB'        , file: 'lxgw-wenkai-gb/LXGWWenKaiMonoGB-Regular'        , weight: 400, style: "normal", },
    // { family: 'LXGWWenKaiMonoGB'        , file: 'lxgw-wenkai-gb/LXGWWenKaiMonoGB-Medium'         , weight: 500, style: "normal", },
    { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Regular'           , weight: 400, style: "normal", },
    // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-SemiBold'          , weight: 600, style: "normal", },
    // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-SemiBoldItalic'    , weight: 600, style: "italic", },
    // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Thin'              , weight: 100, style: "normal", },
    // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-ThinItalic'        , weight: 100, style: "italic", },
    // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Bold'              , weight: 700, style: "normal", },
    // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-BoldItalic'        , weight: 700, style: "italic", },
    // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-ExtraBold'         , weight: 800, style: "normal", },
    // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-ExtraBoldItalic'   , weight: 800, style: "italic", },
    // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-ExtraLight'        , weight: 200, style: "normal", },
    // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-ExtraLightItalic'  , weight: 200, style: "italic", },
    { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-Italic'            , weight: 400, style: "italic", },
    // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Light'             , weight: 300, style: "normal", },
    // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-LightItalic'       , weight: 300, style: "italic", },
    // { family: 'JetBrainsMono'           , file: 'jetbrains-mono/JetBrainsMono-Medium'            , weight: 500, style: "normal", },
    // { family: 'JetBrainsMono-Italic'    , file: 'jetbrains-mono/JetBrainsMono-MediumItalic'      , weight: 500, style: "italic", },
    // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Bold'            , weight: 700, style: "normal", },
    // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-BoldItalic'      , weight: 700, style: "italic", },
    // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-ExtraBold'       , weight: 800, style: "normal", },
    // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-ExtraBoldItalic' , weight: 800, style: "italic", },
    // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-ExtraLight'      , weight: 200, style: "normal", },
    // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-ExtraLightItalic', weight: 200, style: "italic", },
    // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-Italic'          , weight: 400, style: "italic", },
    // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Light'           , weight: 300, style: "normal", },
    // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-LightItalic'     , weight: 300, style: "italic", },
    // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Medium'          , weight: 500, style: "normal", },
    // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-MediumItalic'    , weight: 500, style: "italic", },
    // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Regular'         , weight: 400, style: "normal", },
    // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-SemiBold'        , weight: 600, style: "normal", },
    // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-SemiBoldItalic'  , weight: 600, style: "italic", },
    // { family: 'JetBrainsMonoNL'         , file: 'jetbrains-mono/JetBrainsMonoNL-Thin'            , weight: 100, style: "normal", },
    // { family: 'JetBrainsMonoNL-Italic'  , file: 'jetbrains-mono/JetBrainsMonoNL-ThinItalic'      , weight: 100, style: "italic", },
];

// Collect all characters in html.
async function collectChars(dir) {
    const htmlFiles = await glob(`${dir}/**/*.html`);
    const charSet = new Set();
    for (const file of htmlFiles) {
        const html = fs.readFileSync(file, 'utf-8');
        const dom = new JSDOM(html);
        const text = dom.window.document.body?.textContent || '';
        for (const c of text) charSet.add(c);
    }
    return [...charSet].join('');
}

// Calculate and keep a 16-bit hash value.
function contentHash(buffer) {
    return crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 16);
}

// Man progress
async function run() {
    console.log('🔍 Collecting characters...');
    const chars = await collectChars('dist');
    if (!chars) {
        console.warn('⚠ An empty result is returned, skipping.');
        return;
    }
    console.log(`✅ Collected ${chars.length} characters.`);

    // Make sure the output dir is an existed dir.
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const hashMap = {}; // family -> hash

    for (const { family, file } of fontConfigs) {
        const inputPath = `${fontRoot}/${file}.${fontTypeConfig.in}`;
        if (!fs.existsSync(inputPath)) {
            console.error(`❌ Full font file is not exists: ${inputPath}`);
            process.exit(1);
        }
        const fontBuffer = fs.readFileSync(inputPath);

        console.log(`⏳ Generating subset font for '${family}' ...`);
        const subsetBuffer = await subsetFont(fontBuffer, chars, {
            targetFormat: `${fontTypeConfig.out}`,
            preserveNameTable: true,
        });

        const hash = contentHash(subsetBuffer);
        const outFile = path.join(outputDir, `${hash}.${fontTypeConfig.out}`);
        fs.writeFileSync(outFile, subsetBuffer);
        console.log(`   → ${hash}.${fontTypeConfig.out} (${(subsetBuffer.length / 1024).toFixed(1)} KB)`);

        hashMap[family] = hash;
    }

    // Replace placeholders.
    console.log('🔄 Replacing placeholders in css...');
    const cssFiles = await glob('dist/**/*.css');
    for (const cssFile of cssFiles) {
        let content = fs.readFileSync(cssFile, 'utf-8');
        let replaced = false;
        for (const [family, hash] of Object.entries(hashMap)) {
            const placeholder = `__FONT_HASH_${family}__`;
            if (content.includes(placeholder)) {
                content = content.replaceAll(placeholder, `/_astro/fonts/${hash}.${fontTypeConfig.out}`);
                replaced = true;
            }
        }
        if (replaced) {
            fs.writeFileSync(cssFile, content);
            console.log(`   ✔ Updated: ${cssFile}`);
        }
    }

    // Clean fonts at 'dist' folder
    if (distFontRoot && fs.existsSync('dist/fonts')) {
        fs.rmSync('dist/fonts', { recursive: true, force: true });
        console.log('🗑 cleaned dist font');
    }

    console.log('✨ Font subsets generated done!');
}

run().catch(err => {
    console.error(err);
    process.exit(1);
});
