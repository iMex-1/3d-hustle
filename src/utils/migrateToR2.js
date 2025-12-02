// Migration script to update Firebase URLs from local paths to R2 paths
import { ref, get, update } from 'firebase/database';
import { database } from '../firebase/config';
import { generateModelPaths } from './storageHelpers';

/**
 * Migrate all models from old local file structure to new R2 structure
 * 
 * OLD: /files/input/Building-Architecture.ifc
 * NEW: /models/building-architecture/building-architecture.ifc
 */
export async function migrateFirebaseToR2Structure() {
  try {
    console.log('🔄 Starting migration to R2 structure...');
    
    // Get all models from Firebase
    const modelsRef = ref(database, 'models');
    const snapshot = await get(modelsRef);
    
    if (!snapshot.exists()) {
      console.log('❌ No models found in database');
      return { success: false, message: 'No models found' };
    }
    
    const models = snapshot.val();
    const updates = {};
    let migratedCount = 0;
    let skippedCount = 0;
    
    // Process each model
    for (const [modelId, modelData] of Object.entries(models)) {
      console.log(`\n📦 Processing: ${modelData.model_name}`);
      
      // Check if already migrated (has model_folder field)
      if (modelData.model_folder) {
        console.log(`  ⏭️  Already migrated, skipping...`);
        skippedCount++;
        continue;
      }
      
      // Generate new R2 paths
      const paths = generateModelPaths(modelData.model_name);
      
      // Update URLs from old to new structure
      updates[`models/${modelId}/model_folder`] = paths.folder;
      updates[`models/${modelId}/model_ifc_url`] = paths.ifcPath;
      updates[`models/${modelId}/model_xkt_url`] = paths.xktPath;
      
      console.log(`  ✅ Will migrate:`);
      console.log(`     Folder: ${paths.folder}`);
      console.log(`     IFC: ${paths.ifcPath}`);
      console.log(`     XKT: ${paths.xktPath}`);
      
      migratedCount++;
    }
    
    // Apply all updates at once
    if (Object.keys(updates).length > 0) {
      console.log(`\n💾 Applying ${Object.keys(updates).length} updates to Firebase...`);
      await update(ref(database), updates);
      console.log('✅ Migration complete!');
    } else {
      console.log('\n✅ No updates needed - all models already migrated');
    }
    
    return {
      success: true,
      migratedCount,
      skippedCount,
      totalCount: Object.keys(models).length,
      message: `Migrated ${migratedCount} models, skipped ${skippedCount} already migrated`
    };
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    return {
      success: false,
      error: error.message,
      message: 'Migration failed'
    };
  }
}

/**
 * Preview migration without applying changes
 */
export async function previewMigration() {
  try {
    const modelsRef = ref(database, 'models');
    const snapshot = await get(modelsRef);
    
    if (!snapshot.exists()) {
      return { models: [], message: 'No models found' };
    }
    
    const models = snapshot.val();
    const preview = [];
    
    for (const [modelId, modelData] of Object.entries(models)) {
      const paths = generateModelPaths(modelData.model_name);
      
      preview.push({
        modelId,
        modelName: modelData.model_name,
        alreadyMigrated: !!modelData.model_folder,
        old: {
          ifcUrl: modelData.model_ifc_url,
          xktUrl: modelData.model_xkt_url
        },
        new: {
          folder: paths.folder,
          ifcUrl: paths.ifcPath,
          xktUrl: paths.xktPath
        }
      });
    }
    
    return {
      models: preview,
      totalCount: preview.length,
      alreadyMigrated: preview.filter(m => m.alreadyMigrated).length,
      needsMigration: preview.filter(m => !m.alreadyMigrated).length
    };
    
  } catch (error) {
    console.error('Preview failed:', error);
    return { models: [], error: error.message };
  }
}

/**
 * Rollback migration (restore old paths)
 * USE WITH CAUTION!
 */
export async function rollbackMigration() {
  try {
    console.log('⚠️  Starting rollback...');
    
    const modelsRef = ref(database, 'models');
    const snapshot = await get(modelsRef);
    
    if (!snapshot.exists()) {
      return { success: false, message: 'No models found' };
    }
    
    const models = snapshot.val();
    const updates = {};
    let rollbackCount = 0;
    
    for (const [modelId, modelData] of Object.entries(models)) {
      if (!modelData.model_folder) {
        console.log(`  ⏭️  ${modelData.model_name} - not migrated, skipping`);
        continue;
      }
      
      // Extract filename from model_name
      const filename = modelData.model_name.replace(/\s+/g, '-');
      
      // Restore old paths
      updates[`models/${modelId}/model_ifc_url`] = `/files/input/${filename}.ifc`;
      updates[`models/${modelId}/model_xkt_url`] = `/files/output/${filename}.xkt`;
      updates[`models/${modelId}/model_folder`] = null; // Remove folder field
      
      console.log(`  ↩️  Rolling back: ${modelData.model_name}`);
      rollbackCount++;
    }
    
    if (Object.keys(updates).length > 0) {
      await update(ref(database), updates);
      console.log(`✅ Rolled back ${rollbackCount} models`);
    }
    
    return {
      success: true,
      rollbackCount,
      message: `Rolled back ${rollbackCount} models`
    };
    
  } catch (error) {
    console.error('❌ Rollback failed:', error);
    return { success: false, error: error.message };
  }
}
