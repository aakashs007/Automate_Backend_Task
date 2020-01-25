require('dotenv').config();

module.exports = {
  getEnvs: () => {
    return {
      api_key : process.env.api_key || "",
      port : process.env.port || 3000
    }
  }
}