/*!
 * Main script for hampusn-hexagon-lab.
 */
(function ($, window, document, undefined) {
	// Document ready
	$(function () {
		$('html').removeClass('no-js').addClass('js');

    var mediaUpdate = function () {
      var $jqXHR = $.getJSON('/media/update', function (data, textStatus, jqXHR) {
        console.log(data, textStatus);
      });

      $jqXHR.always(function(data, textStatus, jqXHR) {
        // Start new poll/timer.
        setTimeout(mediaUpdate, parseInt(window.HampusnHexagonLab.vars.updateInterval));
      });
    };

    // Init media update
    mediaUpdate();
	});

  window.HampusnHexagonLab = {
    "vars": {
      "updateInterval": 300 * 1000 // Milliseconds to seconds
    }
  };

})(jQuery, this, this.document);