/*
  Warnings:

  - You are about to drop the `option` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "option" DROP CONSTRAINT "option_pollid_fkey";

-- DropTable
DROP TABLE "option";

-- CreateTable
CREATE TABLE "Option" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "pollid" TEXT NOT NULL,

    CONSTRAINT "Option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Option" ADD CONSTRAINT "Option_pollid_fkey" FOREIGN KEY ("pollid") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
