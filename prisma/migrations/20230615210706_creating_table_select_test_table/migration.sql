-- CreateTable
CREATE TABLE "SelectTestTable" (
    "id" SERIAL NOT NULL,
    "testId" INTEGER NOT NULL,

    CONSTRAINT "SelectTestTable_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SelectTestTable" ADD CONSTRAINT "SelectTestTable_testId_fkey" FOREIGN KEY ("testId") REFERENCES "TestTable"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
