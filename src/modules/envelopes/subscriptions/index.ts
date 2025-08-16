
import { AfterUserCreated } from "./afterUserCreated";
import { AfterIncomesCreated } from "./afterIncomeCreated";
import { AfterIncomesDeleted } from "./afterIncomesDeleted";
import { create as CreateEnvelope } from "../use-cases/create-all-envelope"; 
import { update as UpdateEnvelope } from "../use-cases/update-after-income"; 

// Subscriptions
new AfterUserCreated(CreateEnvelope);
new AfterIncomesCreated(UpdateEnvelope);
new AfterIncomesDeleted(UpdateEnvelope);