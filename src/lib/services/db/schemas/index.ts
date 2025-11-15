export * from './user';
export * from './systemPreference';
export * from './email';

export enum SystemPreferenceKey {
  AllowRegistration = 'allowRegistration',
  MailgunKey = 'mailgunKey',
}

export enum Schemas {
  User = 'User',
  SystemPreference = 'SystemPreference',
  Domain = 'Domain',
  Email = 'Email',
}
