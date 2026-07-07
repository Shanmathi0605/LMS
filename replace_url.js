const fs = require('fs');
const path = require('path');

const directoryPath = path.join(process.cwd(), 'frontend', 'src');
const oldUrl = 'http://localhost:5000';
const newUrl = 'https://lms-dg3c.onrender.com';

function replaceUrlInDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            replaceUrlInDirectory(filePath);
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            if (content.includes(oldUrl)) {
                content = content.split(oldUrl).join(newUrl);
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    });
}

replaceUrlInDirectory(directoryPath);
console.log('Finished updating URLs');
