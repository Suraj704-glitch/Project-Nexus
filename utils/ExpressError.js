class ExpressError extends Error {
  constructor(statusCode, message) {
    super(message);  // ✅ yahan message pass karna zaroori hai
    this.statusCode = statusCode;
  }
}
module.exports=ExpressError;