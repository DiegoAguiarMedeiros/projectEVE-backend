
import { AfterUserCreated } from "./afterUserCreated";
import { AfterIncomesCreated } from "./afterIncomeCreated";
import { AfterIncomesDeleted } from "./afterIncomesDeleted";
import { AfterIncomesUpdated } from "./afterIncomesUpdated";
import { AfterTransactionsUpdated } from "./afterTransactionUpdated";
import { AfterDebtCreated } from "./afterDebtCreated";
import { AfterDebtUpdated } from "./afterDebtUpdated";
import { AfterDebtDeleted } from "./afterDebtDeleted";
import { create as CreateEnvelope } from "../use-cases/create-all-envelope";
import { update as UpdateEnvelope } from "../use-cases/update-after-income";
import { update as UpdateEnvelopeAfterTransactionUpdate } from "../use-cases/update-after-transaction-update";
import { envelopeRepo } from "../repos/implementation";

// Subscriptions
new AfterUserCreated(CreateEnvelope);
new AfterIncomesCreated(UpdateEnvelope);
new AfterIncomesUpdated(UpdateEnvelope);
new AfterIncomesDeleted(UpdateEnvelope);
new AfterTransactionsUpdated(UpdateEnvelopeAfterTransactionUpdate);
new AfterDebtCreated(UpdateEnvelope, envelopeRepo);
new AfterDebtUpdated(UpdateEnvelope, envelopeRepo);
new AfterDebtDeleted(UpdateEnvelope, envelopeRepo);