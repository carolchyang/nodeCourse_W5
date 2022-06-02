const resSuccess = (res, data) => {
  res.send({
    status: "success",
    data,
  });
};

module.exports = resSuccess;
