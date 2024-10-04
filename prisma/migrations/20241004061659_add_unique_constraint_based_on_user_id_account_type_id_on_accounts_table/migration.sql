/*
  Warnings:

  - A unique constraint covering the columns `[user_id,account_type_id]` on the table `accounts` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "accounts_user_id_account_type_id_key" ON "accounts"("user_id", "account_type_id");
