/*!
 * Main script for hampusn-hexagon-lab.
 */
(function ($, window, document, undefined) {
	// Document ready
	$(function () {
		$('html').removeClass('no-js').addClass('js');

    var $latest = HampusnHexagonLab.currentLatest();
    HampusnHexagonLab.vars.currentLatestTime = new Date($latest.data('createdTime'));

    // Fetch the latest media items currently in the database.
    var fetchLatest = function () {
      var $jqXHR = $.getJSON('/media/latest', function (data, textStatus, jqXHR) {
        if (data.status === 'success' && data.items.length) {
          // The pool we will use to determine which items should be replaced with.
          var $pool = $('.hexagon');
          // Will determine if we should try to update the currentLatestTime variable.
          var addedNew = false;

          // TODO: Optimize or rethink this later. Right now, I just want something to happen :)
          for (var i = data.items.length - 1; i >= 0; i--) {
            var ct = new Date(data.items[i].created_time);
            
            // Skip item if it's probably already been added by comparing the dates.
            if (ct <= HampusnHexagonLab.vars.currentLatestTime) {
              continue;
            }

            // Get random item from all current pool (all items on screen).
            var $randomHexagon = $pool.eq(Math.floor($pool.length * Math.random()));
            // Remove the random item from the pool so we don't replace the same item twice.
            $pool = $pool.not($randomHexagon);

            // Markup for new item.
            var s = '<a class="hexagon__link" href="' + data.items[i].url + '" title="View image on instagram">
                      <img src="' + data.items[i].thumbnail_url + '">
                    </a>';

            // Replace the html of the randomly selected item with the new item's markup. Also update the data attribute.
            $randomHexagon.html(s).data('createdTime', data.items[i].created_time);

            // Remember that we have added a new item.
            addedNew = true;
          };

          // Update current latest if new items have been added.
          if (addedNew) {
            var $latest = HampusnHexagonLab.currentLatest();
            var ct = new Date($latest.data('createdTime'));

            if (ct > HampusnHexagonLab.vars.currentLatestTime) {
              HampusnHexagonLab.vars.currentLatestTime = ct;
            }
          }
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