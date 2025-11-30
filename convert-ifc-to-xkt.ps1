# PowerShell script to convert all IFC files to XKT format
# Make sure you have xeokit-convert installed: npm install -g @xeokit/xeokit-convert

Write-Host "Starting IFC to XKT conversion..." -ForegroundColor Green
Write-Host ""

# Check if xeokit-convert is installed
try {
    $null = Get-Command xeokit-convert -ErrorAction Stop
} catch {
    Write-Host "ERROR: xeokit-convert is not installed!" -ForegroundColor Red
    Write-Host "Please install it first: npm install -g @xeokit/xeokit-convert" -ForegroundColor Yellow
    exit 1
}

# Create output directory if it doesn't exist
$outputDir = "public/files/output"
if (-not (Test-Path $outputDir)) {
    New-Item -ItemType Directory -Path $outputDir -Force | Out-Null
    Write-Host "Created output directory: $outputDir" -ForegroundColor Cyan
}

# Get all IFC files from input directory
$ifcFiles = Get-ChildItem -Path "public/files/input" -Filter "*.ifc"

if ($ifcFiles.Count -eq 0) {
    Write-Host "No IFC files found in public/files/input/" -ForegroundColor Yellow
    exit 0
}

Write-Host "Found $($ifcFiles.Count) IFC file(s) to convert" -ForegroundColor Cyan
Write-Host ""

$successCount = 0
$failCount = 0

foreach ($file in $ifcFiles) {
    $outputFile = Join-Path $outputDir ($file.BaseName + ".xkt")
    $fileName = $file.Name
    
    # Check if XKT already exists
    if (Test-Path $outputFile) {
        Write-Host "⏭️  Skipping $fileName (XKT already exists)" -ForegroundColor Yellow
        continue
    }
    
    Write-Host "🔄 Converting $fileName..." -ForegroundColor Cyan
    
    try {
        xeokit-convert -s $file.FullName -o $outputFile
        
        if (Test-Path $outputFile) {
            $xktSize = (Get-Item $outputFile).Length / 1KB
            Write-Host "✅ Success! Created $($file.BaseName).xkt ($([math]::Round($xktSize, 2)) KB)" -ForegroundColor Green
            $successCount++
        } else {
            Write-Host "❌ Failed to create $($file.BaseName).xkt" -ForegroundColor Red
            $failCount++
        }
    } catch {
        Write-Host "❌ Error converting $fileName : $_" -ForegroundColor Red
        $failCount++
    }
    
    Write-Host ""
}

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Conversion Complete!" -ForegroundColor Green
Write-Host "✅ Success: $successCount" -ForegroundColor Green
Write-Host "❌ Failed: $failCount" -ForegroundColor Red
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Files location:" -ForegroundColor Yellow
Write-Host "  Input (IFC):  public/files/input/" -ForegroundColor White
Write-Host "  Output (XKT): public/files/output/" -ForegroundColor White
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. All models are already configured in src/data/objects.js" -ForegroundColor White
Write-Host "2. Clear browser localStorage (F12 → Application → Clear Storage)" -ForegroundColor White
Write-Host "3. Run: npm run dev" -ForegroundColor White
