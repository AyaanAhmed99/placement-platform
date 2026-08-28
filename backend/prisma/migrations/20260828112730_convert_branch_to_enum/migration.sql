/*
  Warnings:

  - The `allowedBranches` column on the `Job` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `fieldOfStudy` on the `Education` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Branch" AS ENUM ('CSE', 'IT', 'ECE', 'EEE', 'MECH', 'CIVIL', 'CHEMICAL', 'OTHER');

-- AlterTable: Education.fieldOfStudy (String -> Branch)
ALTER TABLE "Education"
  ALTER COLUMN "fieldOfStudy" TYPE "Branch"
  USING ("fieldOfStudy"::"Branch");

-- AlterTable: Job.allowedBranches (String[] -> Branch[])
ALTER TABLE "Job"
  ALTER COLUMN "allowedBranches" TYPE "Branch"[]
  USING ("allowedBranches"::"Branch"[]);
