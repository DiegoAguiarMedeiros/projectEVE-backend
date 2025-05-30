
import { AfterUserCreated } from "./afterUserCreated";
import { create as CreateEnvelope } from "../use-cases/create-all-envelope"; // Adjust the path if necessary

// Subscriptions
new AfterUserCreated(CreateEnvelope);