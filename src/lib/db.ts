// Re-export storage methods from storageService to maintain compatibility across the codebase
export type { Creation } from './storageService';
export { 
  saveCreation, 
  getCreations, 
  deleteCreation,
  initSQLiteDB
} from './storageService';
