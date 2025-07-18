export interface EditorVersion {
  id: string;
  name: string;
  content: string;
  timestamp: Date;
  author?: string;
}

export interface EditorComment {
  id: string;
  content: string;
  author: string;
  timestamp: Date;
  position: number;
  resolved: boolean;
}

export interface EditorState {
  content: string;
  versions: EditorVersion[];
  comments: EditorComment[];
  currentVersion: string;
}

export interface FindReplaceState {
  searchTerm: string;
  replaceTerm: string;
  caseSensitive: boolean;
  wholeWord: boolean;
  currentMatch: number;
  totalMatches: number;
}

export type PageFormat = 'portrait-a4' | 'landscape-a4' | 'continuous';

export interface EditorSettings {
  pageFormat: PageFormat;
  showComments: boolean;
  showVersions: boolean;
  autoSave: boolean;
}