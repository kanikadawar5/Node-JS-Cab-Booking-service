exports.sendResponse = (res,msg,status,data) => {
      res.status(status).json({
        message: msg,
        status : status,
        data   : data || {}
      })
}

exports.sendErrorResponse = (res,msg,status,data) => {
  res.status(status).json({
    message: msg,
    status : status,
    data   : data || {}
  })
}