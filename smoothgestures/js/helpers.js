if (!pluginnetwork) var pluginnetwork = {};
pluginnetwork.helpers = function () {
  return {
    getMonthFormatted: function (date) {
      var month = (date.getMonth() + 1);
      return month < 10 ? '0' + month : month; // ('' + month) for string result
    },
    getDayFormatted: function (date) {
      var month = date.getDate();
      return month < 10 ? '0' + month : month; // ('' + month) for string result
    },
    getDayDelta: function (incomingYear, incomingMonth, incomingDay) {
      var incomingDate = new Date(incomingYear, incomingMonth - 1, incomingDay),
        today = new Date(),
        delta;
      // EDIT: Set time portion of date to 0:00:00.000
      // to match time portion of 'incomingDate'
      today.setHours(0);
      today.setMinutes(0);
      today.setSeconds(0);
      today.setMilliseconds(0);
      // Remove the time offset of the current date
      today.setHours(0);
      today.setMinutes(0);
      delta = incomingDate - today;
      return Math.round(delta / 1000 / 60 / 60 / 24);
    },
    IsJsonString: function(str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }
  }
}();