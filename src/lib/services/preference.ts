import {SystemPreference} from "@/lib/types/models/system-preference";
import {dbService} from "@/lib/services/db";

class SystemPreferenceService {
  get(key: Omit<SystemPreference, '_id' | 'createdAt' | 'updatedAt'>) {
    return dbService.systemPreference.findOne(key);
  }
  set<T>(key: Omit<SystemPreference, '_id' | 'createdAt' | 'updatedAt'>, value: T) {
    return dbService.systemPreference.update({
      key
    }, {
      value: JSON.stringify(value),
    }, {
      upsert: true,
      new: true,
    });
  }
  delete(key: Omit<SystemPreference, '_id' | 'createdAt' | 'updatedAt'>) {
    return dbService.systemPreference.delete({
      key,
    });
  }
}

export const preferenceService = new SystemPreferenceService();
