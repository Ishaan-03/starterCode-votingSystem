-- CreateTable
CREATE TABLE "Poll" (
    "id" TEXT NOT NULL,
    "questions" TEXT NOT NULL,

    CONSTRAINT "Poll_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "option" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "votes" INTEGER NOT NULL DEFAULT 0,
    "pollid" TEXT NOT NULL,

    CONSTRAINT "option_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "option" ADD CONSTRAINT "option_pollid_fkey" FOREIGN KEY ("pollid") REFERENCES "Poll"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
