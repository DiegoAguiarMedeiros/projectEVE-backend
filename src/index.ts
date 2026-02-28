
// Infra
import "./shared/infrastructure/http/app";
import "./shared/infrastructure/database/sequelize"

// Subscriptions
import "./modules/users/subscriptions";
import "./modules/envelopes/subscriptions";
// import "./modules/processed-incomes-goals/subscriptions";
// import "./modules/processed-incomes-debts/subscriptions";
// import "./modules/processed-incomes-envelopes/subscriptions";
import "./modules/transactions/subscriptions";
