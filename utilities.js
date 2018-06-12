const shid = require("shortid")

function generate_id(){
  return shid.generate();
}

function datify(date_str){
  let parts = date_str.split("-");
  let date_date = new Date(parts[2], parts[1] - 1, parts[0]);
  console.log(date_date);
  return date_date;
}

module.exports = {
  generate_id : generate_id,
  datify: datify
}