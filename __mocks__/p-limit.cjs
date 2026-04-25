// Manual CJS mock for p-limit (ESM-only v6) used in Jest tests
const pLimit = (_concurrency) => {
  return (fn) => fn();
};

module.exports = pLimit;
module.exports.default = pLimit;
