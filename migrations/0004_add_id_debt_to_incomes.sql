ALTER TABLE "incomes" ADD COLUMN "id_debt" integer REFERENCES "debts"("id");
