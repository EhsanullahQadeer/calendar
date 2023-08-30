document.addEventListener("DOMContentLoaded", async function () {
  // get selected date from local storage
  let defMonth = window.localStorage.getItem("selectedMonth");
  let defYear = window.localStorage.getItem("selectedYear");
  let defaultDate;
  // to use this anywhere instead getting multiple time from local storage
  if (defMonth && defMonth) {
    window.defMonth = defMonth;
    window.defYear = defYear;
    defaultDate = `${defYear}-${defMonth}-01`;
  }
  var calendarEl = document.getElementById("iCalendar");
  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    headerToolbar: {
      right: "prev,next today dayGridMonth,dayGridWeek",
    },
    ...(defaultDate && { initialDate: defaultDate }),
    navLinks: true, // can click day/week names to navigate views
    selectable: true,
    selectMirror: true,
    showNonCurrentDates: true,
    longPressDelay: 1,
    dayMaxEvents: true, // allow "more" link when too many events,
    events:await fetchCalendarData(),
    eventClick: function (info) {
      handleEventPopup(info);
    },
    droppable: false,
    editable: true,
    locale: $("#iCalendar").attr("data-language"),
    selectAllow: function (info) {
      return info.start >= getDateWithoutTime(new Date());
    },
  });
  window.calendar = calendar;
  calendar.render();
  $(".fc-header-toolbar").children().eq(0).prepend(gotoDrop());
  $(".fc-header-toolbar").children().eq(1).html(addSerachByWeek());
  $(".fc-today-button").click(function () {
    let chDt = calendar.getDate();
    let y = chDt.getFullYear();
    let m = ("0" + (chDt.getMonth() + 1)).slice(-2);
    $("#month").val(m);
    $("#year").val(y);
  });
  //
  function changeValuesOfSelect() {
    // var date = calendar.getDate();
    // var year = date.getFullYear();
    // var month = ("0" + (date.getMonth() + 1)).slice(-2);
    // $(".select_month").val(month).trigger("change");
    // $(".select_year").val(year).trigger("change");
  }
  $(".fc-prev-button").on("click", function () {
    changeValuesOfSelect();
  });
  $(".fc-next-button").on("click", function () {
    changeValuesOfSelect();

    // var selectedYear = calendar.getDate().getFullYear();
    // var currentYear = new Date().getFullYear();
    // debugger;
    // // Disable next button if range reaches certain limit
    // if (selectedYear < currentYear + 9) {
    //   calendar.setButtonDisabled("customNextButton", true);
    // }
  });
//   this is beacuse above await takse some time so we hace to render this function after new fullcalendaer render
  await window.renerTopSearch()
});
//
function gotoDrop() {
  let sHtml = "";
  sHtml += '<div id="goto">';
  let d = new Date();
  let m;
  if (window?.defMonth) {
    m = parseInt(window?.defMonth) - 1;
  } else {
    m = d.getMonth();
  }
  let y = window?.defYear || d.getFullYear();
  var aMonth = JSON.parse($("#iCalendar").attr("data-months"));
  sHtml +=
    '<label class="mb-0"  for="styledSelect1"><select onchange="handleMonthChange(this)" class="select_month form-control text ui-widget-content ui-corner-all" name="month" id="month">';
  $.each(aMonth, function (k, v) {
    sHtml +=
      "<option " +
      (k == m ? "selected" : "") +
      ' value="' +
      ("0" + (k + 1)).slice(-2) +
      '">' +
      v +
      "</option>";
  });
  sHtml += "</select></label>";
  sHtml +=
    '<label class="mb-0"  for="styledSelect1" style="margin-left:10px;min-width:120px;"><select onChange="handleYearChange(this)" class="form-control select_year text ui-widget-content ui-corner-all" name="year" id="year">';
  $.each(yearRange(), function (k, v) {
    sHtml +=
      "<option " +
      (v.t == y ? "selected" : "") +
      ' value="' +
      v.v +
      '">' +
      v.t +
      "</option>";
  });
  sHtml += "</select></label>";

  sHtml += "</div>";
  return sHtml;
}

function addSerachByWeek() {
  return `<label for="from">From</label>
<input autocomplete="off" class='form-control searchInput' type="text" id="from" name="from" />
<label for="to">to</label>
<input autocomplete="off" class='form-control searchInput' type="text" id="to" name="to" />`;
}

function getDateWithoutTime(dt) {
  dt.setHours(0, 0, 0, 0);
  return dt;
}



