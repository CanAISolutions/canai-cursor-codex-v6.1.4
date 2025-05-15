import { writeFileSync } from 'fs';
import { restoreFromBackup } from '../../scripts/restore-dreamstate';
import { notifyGuardians } from '../../utils/notifications';

export async function selfRepair(file: string, content: string) {
  try {
    console.log(`Attempting self-repair for ${file}`);
    const restoredContent = await restoreFromBackup(file);
    writeFileSync(file, restoredContent);
    await notifyGuardians(`Self-repair triggered for ${file}`);
  } catch (error) {
    console.error('Self-repair failed:', error);
    await notifyGuardians(`Critical: Self-repair failed for ${file}`);
    throw error;
  }
}
