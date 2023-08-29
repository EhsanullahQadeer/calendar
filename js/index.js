let jsonData = {
  events: [],
};

async function fetchCalendarData() {
  await fetch("./timcard.cfm")
    .then((response) => response.text())
    .then((text) => {
      // Extract JSON part from the response using string manipulation
      var startIndex = text.indexOf("[ {");
      var endIndex = text.lastIndexOf("} ]") + 3;
      var jsonPart = text.substring(startIndex, endIndex);
      // Parse the extracted JSON
      var newData = JSON.parse(jsonPart);
      let paresedData = newData.map((item) => {
        if (item.start && item.end) {
          item.start = formatDateToYYYYMMDD(item.end);
          item.end = formatDateToYYYYMMDD(item.end);
        }
        return item;
      });
      jsonData.events.push(...newData);
    })
    .catch((error) => {
      console.error("Error fetching JSON:", error);
    });
  return jsonData;
}

function formatDateToYYYYMMDD(dateString) {
  const parts = dateString.split("/");
  let date = dateString;
  if (parts.length === 3) {
    var day = parts[0];
    var month = parts[1];
    var year = parts[2];
    date = `${year}-${month}-${day}`;
  }
  return date;
}

//   ................................................................................
// Event popup
$(function () {
  $("#dialog").dialog({
    autoOpen: false,
  });
});

// year range
function yearRange() {
  var currentYear = new Date().getFullYear();
  var yearArray = [];
  for (var i = currentYear; i <= currentYear + 10; i++) {
    yearArray.push({ t: i, v: i });
  }
  return yearArray;
}
// handle month change
function handleMonthChange(select) {
  let selectedYear = parseInt($(".select_year").val());
  let selectedMonth = select.value;
  setDateToLocalStorage(selectedMonth, selectedYear);
  // Remove the valid range for the calendar
  window.calendar.setOption("validRange", null);
  window.calendar.changeView("dayGridMonth", selectedMonth);
  window.calendar.gotoDate(selectedYear + "-" + selectedMonth + "-01");
}
// handle year change
function handleYearChange(select) {
  let selectedYear = parseInt(select.value);
  let selectedMonth = $(".select_month").val();
  setDateToLocalStorage(selectedMonth, selectedYear);
  // Remove the valid range for the calendar
  window.calendar.setOption("validRange", null);
  window.calendar.changeView("dayGridMonth", selectedMonth);
  window.calendar.gotoDate(selectedYear + "-" + selectedMonth + "-01");
}
function setDateToLocalStorage(selectedMonth, selectedYear) {
  window.localStorage.setItem("selectedMonth", selectedMonth);
  window.localStorage.setItem("selectedYear", selectedYear);
}
// Event Popup
function handleEventPopup(info) {
  let id = info.event._def.publicId;
  var foundEvent = jsonData.events.find(function (event) {
    return event.id == id;
  });
  var $eventTable = $("<table>").attr("id", "eventTable");
  $("#dialog").dialog("option", "title", foundEvent?.title);
  $(".ui-widget-header").css("background-color", foundEvent?.color);
  for (var key in foundEvent) {
    //
    if (
      foundEvent.hasOwnProperty(key) &&
      key != "title" &&
      key != "color" &&
      key != "id"
    ) {
      if (key != "link") {
        let text = key;
        text = text.replace(/_/g, " ").replace(/\w\S*/g, function (txt) {
          return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
        var $dataRow = $("<tr>").attr("data-event-name", key);
        var $dataCell1 = $("<td>").addClass(key).text(text);
        var $dataCell2 = $("<td>").addClass(key).text(foundEvent[key]);
        $dataRow.append($dataCell1);
        $dataRow.append($dataCell2);
        $eventTable.append($dataRow);
      } else {
        // Adding a link button at the end
        var $linkRow = $("<tr>");
        var $linkCell = $("<td colspan='2'>");
        var $linkButton = $("<button>").text("Link").css({
          "background-color": foundEvent?.color,
          color: "white",
          border: foundEvent?.color,
        });
        var $linkAnchor = $("<a>")
          .attr("href", foundEvent.link) // Set the link URL
          .attr("target", "_blank") // Open link in new tab/window
          .append($linkButton);
        $linkCell.append($linkAnchor);
        $linkRow.append($linkCell);
      }
    }
  }
  if (foundEvent.hasOwnProperty("link")) {
    $eventTable.append($linkRow);
  }
  // alert(
  //   "Coordinates: " + info.jsEvent.pageX + "," + info.jsEvent.pageY
  // );
  // Append the table to the document
  $("#dialog").html($eventTable);
  $("#dialog").dialog("open");
}

//

$(function () {
 window.renerTopSearch= async function renerTopSearch(){
  var dateFormat = "mm/dd/yy",
    from = $("#from")
      .datepicker({
        showWeek: true,
        firstDay: 1,
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
      })
      .on("change", function () {
        to.datepicker("option", "minDate", getDate(this));
        applyDateFilter();
      }),
    to = $("#to")
      .datepicker({
        defaultDate: "+1w",
        showWeek: true,
        firstDay: 1,
        changeMonth: true,
        changeYear: true,
        numberOfMonths: 1,
      })
      .on("change", function () {
        from.datepicker("option", "maxDate", getDate(this));
        applyDateFilter();
      });

  function getDate(element) {
    var date;
    try {
      date = $.datepicker.parseDate(dateFormat, element.value);
    } catch (error) {
      date = null;
    }

    return date;
  }
  function convertToYYYYMMDD(dateString) {
    if (dateString) {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    } else {
      null;
    }
  }

  function applyDateFilter() {
    var fromDate = from.datepicker("getDate");
    var toDate = to.datepicker("getDate");
    // var fromDate = convertToYYYYMMDD(from.datepicker("getDate"));
    // var toDate = convertToYYYYMMDD(to.datepicker("getDate"));

    if (!fromDate || !toDate) {
      return; // Return if either fromDate or toDate is not selected
    }

    // Set the calendar's valid range based on the selected fromDate and toDate
    window.calendar.changeView("multiMonthYear");

    var multiMonthYearView = $(".fc-multiMonthYear-view");

    // Select child elements within the parent container
    var childElements = multiMonthYearView.children();
    childElements.each(function (index, element) {
      var dataDateValue = $(element).data("date");
      var dateInData = new Date(dataDateValue);

      // Compare with the date range
      if (dateInData < fromDate || dateInData > toDate) {
        $(element).css("display", "none");
      } else {
        $(element).css("display", ""); // Reset the display property

        debugger
      }


      // Now you can perform additional actions with the data-date value
      // For example, you can use it to make further API requests or UI updates
    });

    // Set the calendar's date to the fromDate
    // window.calendar.gotoDate(fromDate);
  }
}
});
