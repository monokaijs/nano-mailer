import {BaseRepository} from "@/lib/services/db/repository";
import dbConnect from "@/lib/services/db/client";
import {Schemas} from "@/lib/services/db/schemas";
import {User} from "@/lib/types/models/user";
import {UserSchema} from "@/lib/services/db/schemas/user";
import {SystemPreference} from "@/lib/types/models/system-preference";
import {SystemPreferenceSchema} from "@/lib/services/db/schemas/systemPreference";
import { Domain } from "@/lib/types/models/domain";
import {DomainSchema} from "@/lib/services/db/schemas/domain";
import { Email } from "@/lib/types/email";
import { EmailSchema } from "@/lib/services/db/schemas/email";


class DBService {
  user: BaseRepository<User>;
  systemPreference: BaseRepository<SystemPreference>;
  domain: BaseRepository<Domain>;
  email: BaseRepository<Email>;

  constructor() {
    this.user = new BaseRepository<User>(Schemas.User, UserSchema);
    this.systemPreference = new BaseRepository<SystemPreference>(Schemas.SystemPreference, SystemPreferenceSchema);
    this.domain = new BaseRepository<Domain>(Schemas.Domain, DomainSchema);
    this.email = new BaseRepository<Email>(Schemas.Email, EmailSchema);

  }

  connect() {
    return dbConnect();
  }
}

export const dbService = new DBService();
