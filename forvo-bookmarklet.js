(function(){
  var key = '{{API_KEY}}';
  var baseURL = 'http://apifree.forvo.com/key/' + key + '/format/json/action/word-pronunciations/word/';

  getWord();

  function getWord() {
    var selection = window.getSelection().toString().replace(/^\s+|\s+$/g, '');
    var message = (''
      + "What word do you need pronounced?\n\n"
      + "(tip: narrow search to a specific language by adding a slash "
      + "and the 2-letter language code after your word, e.g. "
      + "'skal/no' or 'que/es')"
    );
    var input = window.prompt(message, selection).split(/\s*\/\s*/);
    var word = input[0];
    var lang = input[1];

    fetchPronunciations(word, lang);
  }

  function fetchPronunciations(word, lang) {
    var url = baseURL + encodeURIComponent(word);
    if (lang) url = url + '/language/' + encodeURIComponent(lang);

    var cbk = 'forvo_' + new Date().getTime();
    url = url + '/callback/' + cbk;

    window[cbk] = function(data) {
      delete window[cbk];

      var items = data.items;

      if (!items || !items.length) {
        return alert("No results found.");
      }

      showResults(items);
    };

    var s = document.createElement('script');
    s.src = url;
    document.body.appendChild(s);
  }

  function showResults(results) {
    var old = document.getElementById('forvo-results');
    if (old) old.parentNode.removeChild(old);

    var resultsHtml = '<ol style="padding-left: 10px;">';

    for (var n = 0; n < results.length; n++) {
      var result = results[n];
      resultsHtml += (''
        + '<li style="padding-top: 5px;' + (n < (results.length - 1) ? 'padding-bottom:5px; border-bottom:1px #555 solid;' : '') + '">'
          + '<strong>' + result.word + '</strong> '
          + '<span style="color: #999; font-size: 11px;">(' + result.code + ')</span> '
          + '<span style="cursor:pointer;" class="play">&#9654;</span> '
          + '<audio src="' + result.pathmp3 + '"' + (n === 0 ? ' autoplay' : '') + '></audio>'
          + '<a style="color:#aaa; font-weight:normal; font-size: 11px;" href="' + result.pathmp3 + '" download="' + result.word + '_' + result.code + '.mp3">download</a>'
        + '</li>'
      );
    }

    resultsHtml += '</ol>';

    var con = document.createElement('div');
    con.style.position = 'absolute';
    con.style.left = '50%';
    con.style.top = '50%';
    con.style.minWidth = '120px';
    con.style.background = '#252525';
    con.style.color = '#eee';
    con.style.padding = '30px';
    con.style.font = 'normal normal normal 16px/26px Helvetica, sans-serif !important';
    con.style.textAlign = 'left';
    con.style.WebkitTransform = 'translateX(-50%) translateY(-50%)';
    con.style.transform = 'translateX(-50%) translateY(-50%)';

    con.innerHTML = resultsHtml;

    var bg = document.createElement('div');
    bg.style.position = 'fixed';
    bg.style.left = '0';
    bg.style.top = '0';
    bg.style.width = '100%';
    bg.style.height = '100%';
    bg.style.zIndex = '9999999999';
    bg.style.background = 'rgba(227, 223, 229, 0.95)';

    bg.id = 'forvo-results';

    bg.appendChild(con);
    document.body.appendChild(bg);

    con.addEventListener('click', function(e) {
      e.stopPropagation();

      if (e.target.className === 'play') {
        var audio = e.target.parentNode.querySelector('audio');
        audio.load();
        audio.play();
      }
    });

    bg.addEventListener('click', function() {
      bg.parentNode.removeChild(bg);
    });
  }
})();
