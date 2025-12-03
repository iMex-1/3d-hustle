/**
 * Contrast Ratio Checker for WCAG AA Compliance
 * Checks all text colors against backgrounds in the dark theme
 */

// Convert hex to RGB
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

// Calculate relative luminance
function getLuminance(r, g, b) {
    const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
    const lum1 = getLuminance(color1.r, color1.g, color1.b);
    const lum2 = getLuminance(color2.r, color2.g, color2.b);
    const lighter = Math.max(lum1, lum2);
    const darker = Math.min(lum1, lum2);
    return (lighter + 0.05) / (darker + 0.05);
}

// WCAG AA Standards
const WCAG_AA_NORMAL = 4.5;  // Normal text (< 18pt or < 14pt bold)
const WCAG_AA_LARGE = 3.0;   // Large text (>= 18pt or >= 14pt bold)

// Theme colors from theme.css
const backgrounds = {
    'Primary Background': '#1a1a1a',
    'Surface': '#393939',
    'Surface Elevated': '#2a2a2a',
    'Surface Hover': '#333333',
};

const textColors = {
    'Primary Text (--color-on-background)': '#E5E7EB',
    'Secondary Text (--color-on-surface-secondary)': '#9CA3AF',
    'White Text': '#ffffff',
    'Error Text': '#ff4444',
    'Success Text': '#4CAF50',
    'Username Gray': '#999999',
    'Light Gray': '#aaaaaa',
    'Mid Gray': '#666666',
};

// Additional specific combinations from CSS files (UPDATED AFTER FIXES)
const specificCombinations = [
    { name: 'Nav Brand on Navigation', text: '#ffffff', bg: '#1a1a1a' },
    { name: 'Nav Links on Navigation', text: '#ffffff', bg: '#1a1a1a' },
    { name: 'Card Icon on Surface', text: '#e5e5e5', bg: '#393939' },
    { name: 'Card Title on Surface', text: '#ffffff', bg: '#393939' },
    { name: 'Card Description on Surface (FIXED)', text: '#aaaaaa', bg: '#393939' },
    { name: 'Button Primary Text', text: '#ffffff', bg: '#1a1a1a' },
    { name: 'Notification Success', text: '#10b981', bg: '#393939' },
    { name: 'Notification Error (FIXED)', text: '#ff5555', bg: '#393939' },
    { name: 'Notification Close (FIXED)', text: '#aaaaaa', bg: '#393939' },
    { name: 'Username (FIXED)', text: '#aaaaaa', bg: '#1a1a1a' },
    { name: 'Form Labels (FIXED)', text: '#aaaaaa', bg: '#1a1a1a' },
    { name: 'Secondary Text Elements (FIXED)', text: '#aaaaaa', bg: '#393939' },
];

console.log('='.repeat(80));
console.log('WCAG AA CONTRAST RATIO VERIFICATION');
console.log('Dark Theme - Lighter Glassmorphism');
console.log('='.repeat(80));
console.log('\nStandards:');
console.log('  - Normal text: 4.5:1 minimum');
console.log('  - Large text (18pt+): 3.0:1 minimum');
console.log('='.repeat(80));

// Check all text colors against all backgrounds
console.log('\n\n1. GENERAL TEXT COLOR COMBINATIONS\n');
console.log('-'.repeat(80));

let totalTests = 0;
let passedNormal = 0;
let passedLarge = 0;
let failedNormal = 0;

for (const [bgName, bgColor] of Object.entries(backgrounds)) {
    console.log(`\n${bgName} (${bgColor}):`);
    console.log('-'.repeat(80));
    
    const bgRgb = hexToRgb(bgColor);
    
    for (const [textName, textColor] of Object.entries(textColors)) {
        const textRgb = hexToRgb(textColor);
        const ratio = getContrastRatio(bgRgb, textRgb);
        totalTests++;
        
        const passNormal = ratio >= WCAG_AA_NORMAL;
        const passLarge = ratio >= WCAG_AA_LARGE;
        
        if (passNormal) passedNormal++;
        else if (passLarge) passedLarge++;
        else failedNormal++;
        
        const status = passNormal ? '✓ PASS (Normal)' : 
                      passLarge ? '⚠ PASS (Large only)' : 
                      '✗ FAIL';
        
        console.log(`  ${textName}`);
        console.log(`    Color: ${textColor}`);
        console.log(`    Ratio: ${ratio.toFixed(2)}:1`);
        console.log(`    Status: ${status}`);
    }
}

// Check specific combinations
console.log('\n\n2. SPECIFIC UI ELEMENT COMBINATIONS\n');
console.log('-'.repeat(80));

for (const combo of specificCombinations) {
    const textRgb = hexToRgb(combo.text);
    const bgRgb = hexToRgb(combo.bg);
    const ratio = getContrastRatio(bgRgb, textRgb);
    totalTests++;
    
    const passNormal = ratio >= WCAG_AA_NORMAL;
    const passLarge = ratio >= WCAG_AA_LARGE;
    
    if (passNormal) passedNormal++;
    else if (passLarge) passedLarge++;
    else failedNormal++;
    
    const status = passNormal ? '✓ PASS (Normal)' : 
                  passLarge ? '⚠ PASS (Large only)' : 
                  '✗ FAIL';
    
    console.log(`\n${combo.name}:`);
    console.log(`  Text: ${combo.text} on Background: ${combo.bg}`);
    console.log(`  Ratio: ${ratio.toFixed(2)}:1`);
    console.log(`  Status: ${status}`);
}

// Summary
console.log('\n\n' + '='.repeat(80));
console.log('SUMMARY');
console.log('='.repeat(80));
console.log(`Total combinations tested: ${totalTests}`);
console.log(`✓ Pass for normal text (4.5:1+): ${passedNormal} (${((passedNormal/totalTests)*100).toFixed(1)}%)`);
console.log(`⚠ Pass for large text only (3.0:1+): ${passedLarge} (${((passedLarge/totalTests)*100).toFixed(1)}%)`);
console.log(`✗ Fail (< 3.0:1): ${failedNormal} (${((failedNormal/totalTests)*100).toFixed(1)}%)`);

// Recommendations
console.log('\n\n' + '='.repeat(80));
console.log('RECOMMENDATIONS');
console.log('='.repeat(80));

if (failedNormal > 0) {
    console.log('\n⚠ ATTENTION REQUIRED:');
    console.log('Some text colors do not meet WCAG AA standards even for large text.');
    console.log('These should be adjusted for better accessibility.');
}

if (passedLarge > 0) {
    console.log('\n⚠ CAUTION:');
    console.log('Some text colors only meet standards for large text (18pt+ or 14pt+ bold).');
    console.log('Ensure these are only used for headings and large UI elements.');
}

if (failedNormal === 0 && passedLarge === 0) {
    console.log('\n✓ EXCELLENT:');
    console.log('All text colors meet WCAG AA standards for normal text!');
}

console.log('\n' + '='.repeat(80));
