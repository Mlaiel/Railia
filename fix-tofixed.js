#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixToFixedCalls(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;
  
  // Pattern to match .toFixed() calls that aren't already protected
  const patterns = [
    // Direct property access like obj.prop.toFixed()
    /(\w+)\.(\w+)\.toFixed\(/g,
    // Chain access like obj.prop.subprop.toFixed()
    /(\w+)\.(\w+)\.(\w+)\.toFixed\(/g,
    // Array access like arr[0].prop.toFixed()
    /(\w+)\[(\d+|\w+)\]\.(\w+)\.toFixed\(/g,
  ];
  
  patterns.forEach(pattern => {
    const originalContent = content;
    content = content.replace(pattern, (match, ...groups) => {
      // Skip if already protected with || operator
      if (match.includes(' || ')) return match;
      
      const beforeToFixed = match.replace('.toFixed(', '');
      const replacement = `(${beforeToFixed} || 0).toFixed(`;
      modified = true;
      return replacement;
    });
  });
  
  // Handle more complex patterns manually
  const complexPatterns = [
    // latestMetric?.prop.toFixed() -> (latestMetric?.prop || 0).toFixed()
    /(\w+)\?\.(\w+)\.toFixed\(/g,
    // obj.prop?.toFixed() -> (obj.prop || 0).toFixed()
    /(\w+)\.(\w+)\?\.toFixed\(/g,
  ];
  
  complexPatterns.forEach(pattern => {
    content = content.replace(pattern, (match, obj, prop) => {
      if (match.includes(' || ')) return match;
      
      if (match.includes('?.')) {
        // Already has optional chaining, just add fallback
        const beforeToFixed = match.replace('.toFixed(', '');
        return `(${beforeToFixed} || 0).toFixed(`;
      }
      
      modified = true;
      return match;
    });
  });
  
  if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${filePath}`);
  }
}

function processDirectory(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      processDirectory(filePath);
    } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
      fixToFixedCalls(filePath);
    }
  });
}

// Start processing from src directory
processDirectory('/workspaces/spark-template/src');
console.log('Finished fixing toFixed calls');