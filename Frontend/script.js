const jsonFile = "../Worker/books.json";

// Function used to check if a certain file exists
const doesFileExist = (urlToFile) => {
  var xhr = new XMLHttpRequest();
  xhr.open('HEAD', urlToFile, false);
  xhr.send();
   
  return xhr.status !== 404;
}

// Function used to read a file
const readFile = (file, callback) => {
  let rawFile = new XMLHttpRequest();
  rawFile.overrideMimeType("application/json");
  rawFile.open("GET", file, true);
  rawFile.onreadystatechange = function () {
    if (rawFile.readyState === 4 && rawFile.status == "200") {
      callback(rawFile.responseText);
    }
  };
  rawFile.send(null);
};

// Function to generate the table head
const generateTableHead = (table, data) => {
  let thead = table.createTHead();
  let row = thead.insertRow();
  for (let key of data) {
    let th = document.createElement("th");
    let text = document.createTextNode(key);
    th.appendChild(text);
    row.appendChild(th);
  }
};

// Function to generate the table body 
const generateTable = (table, data) => {
  for (let element of data) {
    let row = table.insertRow();
    for (key in element) {
      let cell = row.insertCell();
      let text;
      if (typeof(element[key]) === 'object') {
        text = document.createTextNode("Brak danych");
      } else {      
        text = document.createTextNode(element[key]);
      }
      cell.appendChild(text);
    }
  }
};

// Function used to filter data
const filteringData = () => {
  let value = document.querySelector("input[type='text']").value.toLowerCase()
  let rows = document.querySelector("tbody").querySelectorAll("tr");

  for (let i = 0; i < rows.length; i++) {
    let filtered = false;
    let cells = rows[i].querySelectorAll("td");
    for (let j = 0; j < cells.length; j++) {
      let cell = cells[j];
      if (cell) {
        if (cell.innerHTML.toLowerCase().indexOf(value) > -1) {
          filtered = true;
        }
      }
    }
    if (filtered) {
      rows[i].style.display = "";
    } else {
      rows[i].style.display = "none";
    }
  }
};

// Function used to sorting 
const sortTableByColumn = (table, column, asc = true) => {
  let dirModifier = asc ? 1 : -1;
  let tBody = document.querySelector("tbody");
  let rows = Array.from(tBody.querySelectorAll("tr"));
  
  const sortedRows = rows.sort((a, b) => {
      let aColText = a.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
      let bColText = b.querySelector(`td:nth-child(${ column + 1 })`).textContent.trim();
      
      if (column === 2) {
        aColText = parseFloat(aColText);
        bColText = parseFloat(bColText);
      }
  
      return aColText > bColText ? (1 * dirModifier) : (-1 * dirModifier);
  });

  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }

  tBody.append(...sortedRows);

  table.querySelectorAll("th").forEach(th => th.classList.remove("th-sort-asc", "th-sort-desc"));
  table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-asc", asc);
  table.querySelector(`th:nth-child(${ column + 1})`).classList.toggle("th-sort-desc", !asc);
}

// Function which in the case of an error during data download, displays the error and hides the input
const errorOccured = () => {
  document.querySelector(".error").style.display="inherit";
  document.querySelector("input[type='text']").style.display="none";
}

// Checking whether a file exists
// If not, an error message is displayed
// If yes, an input for filtering the data is displayed and a table is generated with the data extracted from the file
if (!doesFileExist(jsonFile)) {
  errorOccured();
}
else {
  readFile(jsonFile, function (text) {
    try {
      let books = JSON.parse(text);
      let table = document.querySelector("table");
      let columns = ['Ident', 'Tytuł', 'Liczba stron', 'Data wydania'];
      generateTable(table, books);
      generateTableHead(table, columns);

      document.querySelectorAll("th").forEach(headerCell => {
        headerCell.addEventListener("click", () => {
            sortTableByColumn(table, headerCell.cellIndex, !headerCell.classList.contains("th-sort-asc"));
        });
      });
  } catch (err) {
      errorOccured();
    }
  });
}
