const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'data', 'homepage.html'), 'utf8');

const navMatch = html.match(/<nav[^>]*>([\s\S]*?)<\/nav>/g);
if (navMatch) {
  navMatch.forEach((nav, idx) => {
    console.log(`\n=== NAV BLOCK ${idx + 1} ===`);
    const regex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let m;
    while ((m = regex.exec(nav)) !== null) {
      const text = m[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        console.log(`  ${text} -> ${m[1]}`);
      }
    }
  });
}

// Also look for mobile drawer / menu
const menuMatches = html.match(/<ul[^>]*class="[^"]*menu[^"]*"[^>]*>([\s\S]*?)<\/ul>/gi);
if (menuMatches) {
  console.log(`\nFound ${menuMatches.length} menu lists:`);
  menuMatches.slice(0, 3).forEach((menu, idx) => {
    console.log(`\n=== MENU LIST ${idx + 1} ===`);
    const regex = /<a[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/g;
    let m;
    while ((m = regex.exec(menu)) !== null) {
      const text = m[2].replace(/<[^>]+>/g, '').trim();
      if (text) {
        console.log(`  ${text} -> ${m[1]}`);
      }
    }
  });
}
