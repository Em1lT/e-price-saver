/*
  Warnings:

  - You are about to alter the column `price` on the `Price` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Float`.
  - Added the required column `from` to the `Price` table without a default value. This is not possible if the table is not empty.
  - Added the required column `to` to the `Price` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Price" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "price" REAL NOT NULL DEFAULT 0.00,
    "from" DATETIME NOT NULL,
    "to" DATETIME NOT NULL
);
INSERT INTO "new_Price" ("id", "price") SELECT "id", "price" FROM "Price";
DROP TABLE "Price";
ALTER TABLE "new_Price" RENAME TO "Price";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
