var packageGenerator = require("./packageGenerator");

module.exports = function (plop) {
  plop.setGenerator("package", packageGenerator);
};
