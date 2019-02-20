exports.sendResponse = (res,msg,status,data) => {
    var response = {
        message: msg,
        status : status,
        data   : data || {}
      };
      res.status(status).send(JSON.stringify(response))
}
