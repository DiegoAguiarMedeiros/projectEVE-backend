
// Suppress DEP0169 from swagger-jsdoc → @apidevtools/json-schema-ref-parser (uses legacy url.resolve)
process.removeAllListeners('warning');
process.on('warning', (w: NodeJS.ErrnoException) => { if (w.code !== 'DEP0169') process.stderr.write((w.stack ?? String(w)) + '\n'); });

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
