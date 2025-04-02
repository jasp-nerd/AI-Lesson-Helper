// Script to create icons for the VU Amsterdam AI Assistant extension
const fs = require('fs');
const { createCanvas } = require('canvas');

// VU Amsterdam colors
const VU_BLUE = '#0077B3';
const VU_DARK_BLUE = '#005A87';
const VU_WHITE = '#FFFFFF';

// Create icons in different sizes
const sizes = [16, 48, 128];

sizes.forEach(size => {
  // Create canvas
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // Draw background
  ctx.fillStyle = VU_BLUE;
  ctx.fillRect(0, 0, size, size);
  
  // Draw border
  ctx.strokeStyle = VU_DARK_BLUE;
  ctx.lineWidth = Math.max(1, size / 32);
  ctx.strokeRect(ctx.lineWidth / 2, ctx.lineWidth / 2, size - ctx.lineWidth, size - ctx.lineWidth);
  
  // Draw "VU" text
  ctx.fillStyle = VU_WHITE;
  ctx.font = `bold ${Math.floor(size * 0.5)}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('VU', size / 2, size / 2);
  
  // Draw AI indicator
  const aiSize = Math.floor(size * 0.25);
  ctx.font = `${aiSize}px Arial`;
  ctx.fillText('AI', size / 2, size * 0.75);
  
  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(`./icon${size}.png`, buffer);
  
  console.log(`Created icon${size}.png`);
});

console.log('All icons created successfully!');
