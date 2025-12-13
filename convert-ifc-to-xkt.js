/**
 * IFC to XKT Converter using xeokit-convert
 * 
 * ⚠️  DEVELOPMENT ONLY - This script is for development/build time use only
 * The @xeokit/xeokit-convert package has security vulnerabilities but is
 * safe to use in development environments for model conversion.
 * 
 * Installation:
 * npm install @xeokit/xeokit-convert --save-dev
 * 
 * Usage:
 * node convert-ifc-to-xkt.js path/to/model.ifc
 * 
 * This will create a valid XKT file that xeokit can load
 */

const fs = require('fs');
const path = require('path');
const { convert2xkt } = require('@xeokit/xeokit-convert/dist/convert2xkt.cjs.js');

async function convertIfcToXkt(ifcFilePath) {
  try {
    console.log('🔄 Converting IFC to XKT...');
    console.log('Input:', ifcFilePath);

    // Validate input file exists
    if (!fs.existsSync(ifcFilePath)) {
      throw new Error(`IFC file not found: ${ifcFilePath}`);
    }

    // Generate output path
    const outputPath = ifcFilePath.replace(/\.ifc$/i, '.xkt');
    console.log('Output:', outputPath);

    // Convert IFC to XKT
    await convert2xkt({
      source: ifcFilePath,
      output: outputPath,
      log: (msg) => console.log('  ', msg)
    });

    console.log('✅ Conversion complete!');
    console.log('📄 XKT file created:', outputPath);

    // Show file sizes
    const ifcSize = fs.statSync(ifcFilePath).size;
    const xktSize = fs.statSync(outputPath).size;
    console.log(`📊 IFC size: ${(ifcSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 XKT size: ${(xktSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`📊 Compression: ${((1 - xktSize / ifcSize) * 100).toFixed(1)}%`);

  } catch (error) {
    console.error('❌ Conversion failed:', error.message);
    process.exit(1);
  }
}

// Get IFC file path from command line
const ifcFilePath = process.argv[2];

if (!ifcFilePath) {
  console.error('Usage: node convert-ifc-to-xkt.js <path-to-ifc-file>');
  console.error('Example: node convert-ifc-to-xkt.js ./models/building.ifc');
  process.exit(1);
}

convertIfcToXkt(ifcFilePath);
