import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import {Domain} from "@/lib/types/models/domain";

export const DomainSchema = new mongoose.Schema<Domain>({
  name: {
    type: String,
    unique: true,
    validate: {
      validator: function (v: string) {
        return /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,6}$/.test(v);
      },
      message: 'Please enter a valid domain',
    },
    required: true,
  },
  description: {
    type: String,
    required: false,
    default: '',
  },
  connected: {
    type: Boolean,
    default: false,
  },
  isPublic: {
    type: Boolean,
    default: false,
  },
});

DomainSchema.plugin(mongoosePaginate);
