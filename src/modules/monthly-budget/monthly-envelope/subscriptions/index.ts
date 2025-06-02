
import { AfterDebtCreated } from "./afterDebtCreated";
import { create as CreateMonthlyEnvelope } from "../use-cases/create-envelope-monthly-after-debt"; 

// Subscriptions
new AfterDebtCreated(CreateMonthlyEnvelope);