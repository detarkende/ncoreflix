/*
  Warnings:

  - Added the required column `hashString` to the `Torrent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `Torrent` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Torrent" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "transmissionId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "hashString" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Torrent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Torrent" ("createdAt", "id", "name", "transmissionId", "updatedAt", "userId") SELECT "createdAt", "id", "name", "transmissionId", "updatedAt", "userId" FROM "Torrent";
DROP TABLE "Torrent";
ALTER TABLE "new_Torrent" RENAME TO "Torrent";
CREATE UNIQUE INDEX "Torrent_transmissionId_key" ON "Torrent"("transmissionId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
