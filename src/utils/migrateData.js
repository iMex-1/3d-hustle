import { objects } from '../data/objects';
import * as databaseService from '../services/databaseService';

/**
 * Migrate static objects data to Firebase RTDB
 * This function should be called once to populate the database
 */
export async function migrateStaticDataToFirebase() {
  console.log('Starting migration of static data to Firebase...');
  
  try {
    let successCount = 0;
    let errorCount = 0;

    for (const obj of objects) {
      try {
        // Map static object structure to Firebase model structure
        const modelData = {
          filename: obj.name,
          model_name: obj.name,
          model_category: obj.category,
          model_description: obj.description,
          model_owner: 'system', // Default owner for migrated data
          model_ifc_url: obj.ifcFile,
          model_xkt_url: obj.xktFile,
          model_ifc_size: 0, // Size not available in static data
          model_xkt_size: 0, // Size not available in static data
          downloads: obj.downloads || 0,
          featured: obj.featured || false
        };

        const modelId = await databaseService.createModel(modelData);
        console.log(`✓ Migrated: ${obj.name} (ID: ${modelId})`);
        successCount++;
      } catch (error) {
        console.error(`✗ Failed to migrate: ${obj.name}`, error);
        errorCount++;
      }
    }

    console.log(`\nMigration complete!`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    
    return { successCount, errorCount };
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}
