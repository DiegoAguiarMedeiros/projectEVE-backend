
import { AfterUserCreated } from "./afterUserCreated";
import { AfterIncomesCreated } from "./afterIncomeCreated";
import { AfterIncomesDeleted } from "./afterIncomesDeleted";
import { AfterTransactionsUpdated } from "./afterTransactionUpdated";
import { create as CreateEnvelope } from "../use-cases/create-all-envelope"; 
import { update as UpdateEnvelope } from "../use-cases/update-after-income"; 
import { update as UpdateEnvelopeAfterTransactionUpdate } from "../use-cases/update-after-transaction-update"; 

// Subscriptions
new AfterUserCreated(CreateEnvelope);
new AfterIncomesCreated(UpdateEnvelope);
new AfterIncomesDeleted(UpdateEnvelope);
new AfterTransactionsUpdated(UpdateEnvelopeAfterTransactionUpdate);