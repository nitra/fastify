export default request => {
  // add the log to the context
  return {
    log: request.log
  }
}
