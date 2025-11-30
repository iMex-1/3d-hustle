# Converting IFC Files to XKT Format

Your project is now configured to use xeokit for displaying XKT files. You have IFC files in `/public/ifcs/` but they need to be converted to XKT format for visualization.

## Option 1: Using xeokit-convert (Recommended)

Install the xeokit converter:
```bash
npm install -g @xeokit/xeokit-convert
```

Convert your IFC files:
```bash
xeokit-convert -s public/ifcs/Building-Architecture.ifc -o public/ifcs/Building-Architecture.xkt
xeokit-convert -s public/ifcs/Building-Hvac.ifc -o public/ifcs/Building-Hvac.xkt
xeokit-convert -s public/ifcs/Building-Structural.ifc -o public/ifcs/Building-Structural.xkt
xeokit-convert -s public/ifcs/Building-Landscaping.ifc -o public/ifcs/Building-Landscaping.xkt
xeokit-convert -s public/ifcs/Infra-Bridge.ifc -o public/ifcs/Infra-Bridge.xkt
xeokit-convert -s public/ifcs/Infra-Road.ifc -o public/ifcs/Infra-Road.xkt
```

## Option 2: Using xeokit-gltf-to-xkt

If you have GLTF files, you can convert them:
```bash
npm install -g @xeokit/xeokit-gltf-to-xkt
gltf2xkt -s model.gltf -o model.xkt
```

## Option 3: Online Converter

Use the xeokit online converter at:
https://xeokit.github.io/xeokit-convert/

## Batch Conversion Script

Create a script to convert all IFC files at once:

```bash
# convert-all.sh
for file in public/ifcs/*.ifc; do
    filename=$(basename "$file" .ifc)
    xeokit-convert -s "$file" -o "public/ifcs/${filename}.xkt"
done
```

## Current Project Structure

- **IFC files**: Used for download (original BIM data)
- **XKT files**: Used for web visualization (optimized format)

The app will:
1. Display XKT files in the xeokit viewer
2. Allow users to download the original IFC files
