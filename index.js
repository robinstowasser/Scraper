const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Excel = require('exceljs');
const reader = require('xlsx');

const app = express();

var corsOptions = {
  origin: "http://localhost:8080"
};

app.use(cors());

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Portal application." });
});

app.get("/pick", (req, res) => {
  var workbook = new Excel.Workbook();
  const file = reader.readFile("./test1.xlsx");
  const temp = reader.utils.sheet_to_json(file.Sheets[file.SheetNames[0]]);
  let data = []
  temp.forEach((res) => {
    data.push({
      pick3: res['pick3'],
      pick4: res['pick4']
    });
  })
  console.log(data);
  res.json(data)
})
// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
