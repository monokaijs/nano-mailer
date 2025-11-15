import mongoose from 'mongoose';
import {SystemPreference} from "@/lib/types/models/system-preference";
import {SystemPreferenceKey} from "@/lib/services/db/schemas/index";

export const SystemPreferenceSchema = new mongoose.Schema<SystemPreference>({
  key: {
    type: String,
    enum: SystemPreferenceKey,
    required: true,
    unique: true,
  },
  value: String,
}, {
  timestamps: true,
});

