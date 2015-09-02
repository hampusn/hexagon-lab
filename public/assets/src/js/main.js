/*!
 * Main script for hampusn-hexagon-lab.
 */
(function ($, window, document, undefined) {
	// Document ready
	$(function () {
		$('html').removeClass('no-js').addClass('js');

    var latest = HampusnHexagonLab.currentLatest();
    HampusnHexagonLab.vars.currentLatestTime = latest.data('createdTime');

    // Fetch the latest media items currently in the database.
    var fetchLatest = function () {
      var $jqXHR = $.getJSON('/media/latest', function (data, textStatus, jqXHR) {
        if (data.status === 'success' && data.items.length) {
          var $pool = $('.hexagon');

          // TODO: Optimize this later.
          for (var i = data.items.length - 1; i >= 0; i--) {
            var $randomHexagon = $pool.eq(Math.floor($pool.length * Math.random()));
            $pool = $pool.not($randomHexagon);

            var s = '<a class="hexagon__link" href="' + data.items[i].url + '" title="View image on instagram">
                      <img src="' + data.items[i].thumbnail_url + '">
                    </a>';

            $randomHexagon.html(s).data('createdTime', data.items[i].created_time);
          };
        }
      });

      $jqXHR.always(function (data, textStatus, jqXHR) {
        setTimeout(fetchLatest, parseInt(window.HampusnHexagonLab.vars.fetchInterval));
      });
    };

    // Trigger a media update which calls the Instagram API and stores new media to the database.
    var mediaUpdate = function () {
      var $jqXHR = $.getJSON('/media/update', function (data, textStatus, jqXHR) {
        // We don't get anything back right now.
      });

      $jqXHR.always(function (data, textStatus, jqXHR) {
        // Start new poll/timer.
        setTimeout(mediaUpdate, parseInt(window.HampusnHexagonLab.vars.updateInterval));
      });
    };

    // Fetch the latest media items from the database.
    fetchLatest();
    // Init media update
    mediaUpdate();
	});

  window.HampusnHexagonLab = {
    "vars": {
      "fetchInterval": 10 * 1000, // Milliseconds to seconds
      "updateInterval": 300 * 1000 // Milliseconds to seconds
    },
    currentLatest: function () {
      var $hexagons = $('.hexagon');
      var $sorted = $hexagons.sort(HampusnHexagonLab._sortByDate);
      return $sorted.first();
    },
    _sortByDate: function (a, b) {
      a = new Date($(a).data('createdTime'));
      b = new Date($(b).data('createdTime'));
      return a>b ? -1 : a<b ? 1 : 0;
    }
  };

})(jQuery, this, this.document);