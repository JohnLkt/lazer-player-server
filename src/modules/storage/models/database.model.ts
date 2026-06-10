// src/storage/realm.model.ts
import Realm from 'realm';

// ==========================================
// 1. EMBEDDED OBJECTS (Child objects owned by parent records)
// ==========================================

export class BeatmapDifficulty extends Realm.Object<BeatmapDifficulty> {
  DrainRate!: number;
  CircleSize!: number;
  OverallDifficulty!: number;
  ApproachRate!: number;
  SliderMultiplier!: number;
  SliderTickRate!: number;

  static schema: Realm.ObjectSchema = {
    name: 'BeatmapDifficulty',
    embedded: true,
    properties: {
      DrainRate: 'float',
      CircleSize: 'float',
      OverallDifficulty: 'float',
      ApproachRate: 'float',
      SliderMultiplier: 'double',
      SliderTickRate: 'double',
    },
  };
}

export class BeatmapUserSettings extends Realm.Object<BeatmapUserSettings> {
  Offset!: number;

  static schema: Realm.ObjectSchema = {
    name: 'BeatmapUserSettings',
    embedded: true,
    properties: {
      Offset: 'double',
    },
  };
}

export class RealmNamedFileUsage extends Realm.Object<RealmNamedFileUsage> {
  File!: File;
  Filename?: string;

  static schema: Realm.ObjectSchema = {
    name: 'RealmNamedFileUsage',
    embedded: true,
    properties: {
      File: 'File',
      Filename: 'string?',
    },
  };
}

export class RealmUser extends Realm.Object<RealmUser> {
  OnlineID!: number;
  Username?: string;
  CountryCode?: string;

  static schema: Realm.ObjectSchema = {
    name: 'RealmUser',
    embedded: true,
    properties: {
      OnlineID: 'int',
      Username: 'string?',
      CountryCode: 'string?',
    },
  };
}

// ==========================================
// 2. STANDARD OBJECTS (Independent database tables)
// ==========================================

export class File extends Realm.Object<File> {
  Hash?: string;

  static schema: Realm.ObjectSchema = {
    name: 'File',
    primaryKey: 'Hash',
    properties: {
      Hash: 'string?',
    },
  };
}

export class Ruleset extends Realm.Object<Ruleset> {
  ShortName?: string;
  Name?: string;
  InstantiationInfo?: string;
  Available!: boolean;
  OnlineID!: number;
  LastAppliedDifficultyVersion!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Ruleset',
    primaryKey: 'ShortName',
    properties: {
      ShortName: 'string?',
      Name: 'string?',
      InstantiationInfo: 'string?',
      Available: 'bool',
      OnlineID: { type: 'int', indexed: true },
      LastAppliedDifficultyVersion: 'int',
    },
  };
}

export class BeatmapMetadata extends Realm.Object<BeatmapMetadata> {
  Title?: string;
  TitleUnicode?: string;
  Artist?: string;
  ArtistUnicode?: string;
  Source?: string;
  Tags?: string;
  PreviewTime!: number;
  AudioFile?: string;
  BackgroundFile?: string;
  Author?: RealmUser;
  UserTags?: Realm.List<string>;

  static schema: Realm.ObjectSchema = {
    name: 'BeatmapMetadata',
    properties: {
      Title: 'string?',
      TitleUnicode: 'string?',
      Artist: 'string?',
      ArtistUnicode: 'string?',
      Source: 'string?',
      Tags: 'string?',
      PreviewTime: 'int',
      AudioFile: 'string?',
      BackgroundFile: 'string?',
      Author: 'RealmUser',
      UserTags: { type: 'list', objectType: 'string', optional: true },
    },
  };
}

export class Beatmap extends Realm.Object<Beatmap> {
  ID!: Realm.BSON.UUID;
  DifficultyName?: string;
  Ruleset?: Ruleset;
  Difficulty?: BeatmapDifficulty;
  Metadata?: BeatmapMetadata;
  BeatmapSet?: BeatmapSet;
  Status!: number;
  Length!: number;
  BPM!: number;
  Hash?: string;
  StarRating!: number;
  MD5Hash?: string;
  Hidden!: boolean;
  BeatDivisor!: number;
  OnlineID!: number;
  UserSettings?: BeatmapUserSettings;
  OnlineMD5Hash?: string;
  LastOnlineUpdate?: Date;
  LastPlayed?: Date;
  LastLocalUpdate?: Date;
  EditorTimestamp?: number;
  EndTimeObjectCount!: number;
  TotalObjectCount!: number;

  static schema: Realm.ObjectSchema = {
    name: 'Beatmap',
    primaryKey: 'ID',
    properties: {
      ID: 'uuid',
      DifficultyName: 'string?',
      Ruleset: 'Ruleset',
      Difficulty: 'BeatmapDifficulty',
      Metadata: 'BeatmapMetadata',
      BeatmapSet: 'BeatmapSet',
      Status: 'int',
      Length: 'double',
      BPM: 'double',
      Hash: 'string?',
      StarRating: 'double',
      MD5Hash: { type: 'string', indexed: true, optional: true },
      Hidden: 'bool',
      BeatDivisor: 'int',
      OnlineID: { type: 'int', indexed: true },
      UserSettings: 'BeatmapUserSettings',
      OnlineMD5Hash: 'string?',
      LastOnlineUpdate: 'date?',
      LastPlayed: 'date?',
      LastLocalUpdate: 'date?',
      EditorTimestamp: 'double?',
      EndTimeObjectCount: 'int',
      TotalObjectCount: 'int',
    },
  };
}

export class BeatmapSet extends Realm.Object<BeatmapSet> {
  ID!: Realm.BSON.UUID;
  DateAdded!: Date;
  Beatmaps!: Realm.List<Beatmap>;
  Files!: Realm.List<RealmNamedFileUsage>;
  DeletePending!: boolean;
  Hash?: string;
  Protected!: boolean;
  OnlineID!: number;
  Status!: number;
  DateSubmitted?: Date;
  DateRanked?: Date;

  static schema: Realm.ObjectSchema = {
    name: 'BeatmapSet',
    primaryKey: 'ID',
    properties: {
      ID: 'uuid',
      DateAdded: 'date',
      Beatmaps: 'Beatmap[]',
      Files: 'RealmNamedFileUsage[]',
      DeletePending: 'bool',
      Hash: 'string?',
      Protected: 'bool',
      OnlineID: { type: 'int', indexed: true },
      Status: 'int',
      DateSubmitted: 'date?',
      DateRanked: 'date?'
    },
  };
}

export class BeatmapCollection extends Realm.Object<BeatmapCollection> {
  ID!: Realm.BSON.UUID;
  Name?: string;
  BeatmapMD5Hashes?: Realm.List<string>;
  LastModified!: Date;

  static schema: Realm.ObjectSchema = {
    name: 'BeatmapCollection',
    primaryKey: 'ID',
    properties: {
      ID: 'uuid',
      Name: 'string?',
      BeatmapMD5Hashes: {type: 'list', objectType: 'string', optional: true},
      LastModified: 'date',
    },
  };
}

export class KeyBinding extends Realm.Object<KeyBinding> {
  ID!: Realm.BSON.UUID;
  Variant?: number;
  Action!: number;
  KeyCombination?: string;
  RulesetName?: string;

  static schema: Realm.ObjectSchema = {
    name: 'KeyBinding',
    primaryKey: 'ID',
    properties: {
      ID: 'uuid',
      Variant: 'int?',
      Action: 'int',
      KeyCombination: 'string?',
      RulesetName: 'string?',
    },
  };
}

export class ModPreset extends Realm.Object<ModPreset> {
  ID!: Realm.BSON.UUID;
  Ruleset?: Ruleset;
  Name?: string;
  Description?: string;
  Mods?: string;
  DeletePending!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'ModPreset',
    primaryKey: 'ID',
    properties: {
      ID: 'uuid',
      Ruleset: 'Ruleset',
      Name: 'string?',
      Description: 'string?',
      Mods: 'string?',
      DeletePending: 'bool',
    },
  };
}

export class RulesetSetting extends Realm.Object<RulesetSetting> {
  Variant!: number;
  Key!: string;
  Value!: string;
  RulesetName?: string;

  static schema: Realm.ObjectSchema = {
    name: 'RulesetSetting',
    properties: {
      Variant: { type: 'int', indexed: true },
      Key: 'string',
      Value: 'string',
      RulesetName: { type: 'string', indexed: true, optional: true },
    },
  };
}

export class Score extends Realm.Object<Score> {
  ID!: Realm.BSON.UUID;
  BeatmapInfo?: Beatmap;
  Ruleset?: Ruleset;
  Files!: Realm.List<RealmNamedFileUsage>;
  Hash?: string;
  DeletePending!: boolean;
  TotalScore!: number;
  MaxCombo!: number;
  Accuracy!: number;
  Date!: Date;
  PP?: number;
  OnlineID!: number;
  User?: RealmUser;
  Mods?: string;
  Statistics?: string;
  Rank!: number;
  Combo!: number;
  MaximumStatistics?: string;
  BeatmapHash?: string;
  IsLegacyScore!: boolean;
  TotalScoreVersion!: number;
  LegacyTotalScore?: number;
  BackgroundReprocessingFailed!: boolean;
  LegacyOnlineID!: number;
  ClientVersion?: string;
  TotalScoreWithoutMods!: number;
  Pauses!: Realm.List<number>;

  static schema: Realm.ObjectSchema = {
    name: 'Score',
    primaryKey: 'ID',
    properties: {
      ID: 'uuid',
      BeatmapInfo: 'Beatmap',
      Ruleset: 'Ruleset',
      Files: 'RealmNamedFileUsage[]',
      Hash: 'string?',
      DeletePending: 'bool',
      TotalScore: 'int',
      MaxCombo: 'int',
      Accuracy: 'double',
      Date: 'date',
      PP: 'double?',
      OnlineID: { type: 'int', indexed: true },
      User: 'RealmUser',
      Mods: 'string?',
      Statistics: 'string?',
      Rank: 'int',
      Combo: 'int',
      MaximumStatistics: 'string?',
      BeatmapHash: { type: 'string', indexed: true, optional: true },
      IsLegacyScore: 'bool',
      TotalScoreVersion: 'int',
      LegacyTotalScore: 'int?',
      BackgroundReprocessingFailed: 'bool',
      LegacyOnlineID: { type: 'int', indexed: true },
      ClientVersion: 'string?',
      TotalScoreWithoutMods: 'int',
      Pauses: 'int[]',
    },
  };
}

export class Skin extends Realm.Object<Skin> {
  ID!: Realm.BSON.UUID;
  Name?: string;
  Creator?: string;
  InstantiationInfo?: string;
  Hash?: string;
  Protected!: boolean;
  Files!: Realm.List<RealmNamedFileUsage>;
  DeletePending!: boolean;

  static schema: Realm.ObjectSchema = {
    name: 'Skin',
    primaryKey: 'ID',
    properties: {
      ID: 'uuid',
      Name: 'string?',
      Creator: 'string?',
      InstantiationInfo: 'string?',
      Hash: 'string?',
      Protected: 'bool',
      Files: 'RealmNamedFileUsage[]',
      DeletePending: 'bool',
    },
  };
}

// ==========================================
// 3. EXPORT ALL SCHEMAS FOR APPLICATION INITIALIZATION
// ==========================================

export const realmSchema = [
  File,
  Ruleset,
  RealmUser,
  BeatmapDifficulty,
  BeatmapUserSettings,
  RealmNamedFileUsage,
  BeatmapMetadata, 
  Beatmap,
  BeatmapSet,
  BeatmapCollection,
  KeyBinding,
  ModPreset,
  RulesetSetting,
  Score,
  Skin,
];