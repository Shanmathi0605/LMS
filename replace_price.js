const fs = require('fs');
const path = require('path');

const directoryPath = path.join(process.cwd(), 'frontend', 'src');

function replacePriceInDirectory(dir) {
    const files = fs.readdirSync(dir);
    
    files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
            replacePriceInDirectory(filePath);
        } else if (filePath.endsWith('.jsx') || filePath.endsWith('.js')) {
            let content = fs.readFileSync(filePath, 'utf8');
            let updated = false;

            if (content.includes('₹{course.price}')) {
                content = content.replace(/₹\{course\.price\}/g, '₹{Math.round(course.price)}');
                updated = true;
            }
            if (content.includes('amount: course.price')) {
                content = content.replace(/amount: course\.price/g, 'amount: Math.round(course.price)');
                updated = true;
            }

            if (updated) {
                fs.writeFileSync(filePath, content, 'utf8');
                console.log(`Updated ${filePath}`);
            }
        }
    });
}

replacePriceInDirectory(directoryPath);
console.log('Finished updating course prices');
