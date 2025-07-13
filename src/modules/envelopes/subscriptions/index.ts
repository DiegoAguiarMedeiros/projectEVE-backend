
import { AfterUserCreated } from "./afterUserCreated";
import { create as CreateEnvelope } from "../use-cases/create-all-envelope"; 

// Subscriptions
new AfterUserCreated(CreateEnvelope);