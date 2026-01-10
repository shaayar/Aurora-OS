import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { tmpdir } from 'os';

const __dirname = dirname(fileURLToPath(import.meta.url));
const LOCALES_DIR = join(__dirname, '../src/i18n/locales');
const SRC_DIR = join(__dirname, '../src');

// Reuse getDict from check-i18n.js
async function getDict(filename) {
    const filePath = join(LOCALES_DIR, filename);
    let content = readFileSync(filePath, 'utf-8');

    content = content.replace(/^import.*$/gm, '');
    content = content.replace(/: TranslationDict/g, '');
    const langMatch = filename.match(/^([a-z]+)\.ts/);
    const lang = langMatch ? langMatch[1] : filename.replace('.ts', '');
    content = content.replace(`export const ${lang} =`, `global.${lang} =`);

    const tempFile = join(tmpdir(), `check-unused-${lang}-${Date.now()}.js`);
    writeFileSync(tempFile, content);

    await import(pathToFileURL(tempFile).href);
    return global[lang];
}

function getAllKeys(obj, prefix = '') {
    let keys = [];
    if (!obj || typeof obj !== 'object') return keys;

    for (const key in obj) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
            keys = keys.concat(getAllKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

function getAllSrcFiles(dir) {
    let results = [];
    const list = readdirSync(dir);
    
    list.forEach(file => {
        const filePath = join(dir, file);
        const stat = statSync(filePath);
        if (stat.isDirectory()) {
            results = results.concat(getAllSrcFiles(filePath));
        } else if (file.endsWith('.ts') || file.endsWith('.tsx')) {
            results.push(filePath);
        }
    });

    return results;
}

async function run() {
    let enDict;
    try {
        enDict = await getDict('en.ts');
    } catch (e) {
        console.error('Failed to parse en.ts:', e);
        process.exit(1);
    }

    const baselineKeys = getAllKeys(enDict);
    console.log(`Found ${baselineKeys.length} keys in en.ts`);

    const srcFiles = getAllSrcFiles(SRC_DIR);
    // Exclude the locales file itself from search to avoid false positives (searching en.ts for its own keys)
    const filesToSearch = srcFiles.filter(f => !f.includes('i18n/locales/'));
    
    console.log(`Searching in ${filesToSearch.length} source files...`);

    // Concatenate all file content for faster searching (naive approach but works for reasonable size)
    // For exact matching we might want to check for 'key' or "key"
    let allContent = '';
    filesToSearch.forEach(f => {
        allContent += readFileSync(f, 'utf-8') + '\n';
    });

    const unused = [];
    
    baselineKeys.forEach(key => {
        // We look for the key in quotes or passing as variable.
        // A simple string includes check is a good heuristic.
        // It might have false negatives (dynamic keys) but false positives are unlikely (if key is "ok" and it appears in "look" -> strict substring match is risky for short words)
        // Let's assume keys are reasonably unique or wrapped in quotes usually.
        // If we strictly check for 'key' or "key", we miss `t(key)` where key is a var.
        
        // Strict approach: check if the exact string exists.
        if (!allContent.includes(key)) {
            unused.push(key);
        }
    });

    if (unused.length > 0) {
        console.warn(`\n[WARN] Found ${unused.length} potentially unused keys:`);
        unused.forEach(k => console.log(`  - ${k}`));
        console.log('\nNote: These might be used dynamically/Constructed. Verify manually before deleting.');
    } else {
        console.log('\n[OK] All keys seem to be used.');
    }
}

run();
