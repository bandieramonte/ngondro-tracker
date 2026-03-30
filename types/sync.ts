export type SyncStatus = "pending" | "synced" | "failed";

export type SyncState =
  | "idle"
  | "syncing"
  | "success"
  | "error"
  | "offline";
  
export type SyncMetadata = {
  userId: string | null;
  updatedAt: number | null;
  syncStatus: SyncStatus;
  lastSyncedAt: number | null;
};