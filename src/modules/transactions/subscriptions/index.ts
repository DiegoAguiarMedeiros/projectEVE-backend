
import { AfterDebtCreated } from "./afterDebtCreated";
import { AfterDebtUpdated } from "./afterDebtUpdated";
import { create as CreateTransactionsAfterDebt } from "../use-cases/create-after-debt";
import { AfterProcessedIncomeCreated } from "./afterProcessedIncomesCreated";
import { AfterProcessedIncomeUpdated } from "./afterProcessedIncomesUpdated";
import { create as CreateTransactionsAfterProcessedIncomes } from "../use-cases/create-after-processed-incomes";

// Subscriptions
new AfterDebtCreated(CreateTransactionsAfterDebt);
new AfterDebtUpdated(CreateTransactionsAfterDebt);
new AfterProcessedIncomeCreated(CreateTransactionsAfterProcessedIncomes);
new AfterProcessedIncomeUpdated(CreateTransactionsAfterProcessedIncomes);