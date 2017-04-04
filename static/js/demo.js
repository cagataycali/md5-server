var socket = io.connect('https://md5.cagatay.me');
;(function(window) {

	'use strict';

	var mainContainer = document.querySelector('.main-wrap'),
		openCtrl = document.getElementById('btn-search'),
		closeCtrl = document.getElementById('btn-search-close'),
		searchContainer = document.querySelector('.search'),
		inputSearch = searchContainer.querySelector('.search__input'),
		terminal = document.getElementById('terminal');

	function init() {
		initEvents();
	}

	function initEvents() {
		openCtrl.addEventListener('click', openSearch);
		closeCtrl.addEventListener('click', closeSearch);
		document.addEventListener('keyup', function(ev) {
			var isEncrypt = inputSearch.value.match(/#/g) ? true : false;
			// var isDecrypt = inputSearch.value.match(/?/g) ? true : false;


		  socket.on('encrypted', function (data) {
		    console.log( "encrypted", data.response)
				document.getElementById('terminal').innerHTML = `#${data.response}`;
		  });
		  socket.on('decrypted', function (data) {
		    console.log( "decrypted", data.response)
				document.getElementById('terminal').innerHTML = `?${data.response}`;
		  });

			if (isEncrypt) {
				var searchParam = inputSearch.value.split('#').join('');
				if (searchParam.length > 1) {
					socket.emit('encrypt', searchParam);
				}
			} else  {
				var searchParam = inputSearch.value.split('?').join('');
				if (searchParam.length == 32) {
					socket.emit('decrypt', searchParam);
				}
			}
			// escape key.
			if( ev.keyCode == 27 ) {
				closeSearch();
			}
		});
	}

	function openSearch() {
		mainContainer.classList.add('main-wrap--hide');
		searchContainer.classList.add('search--open');
		inputSearch.focus();
	}

	function closeSearch() {
		mainContainer.classList.remove('main-wrap--hide');
		searchContainer.classList.remove('search--open');
		inputSearch.blur();
		inputSearch.value = '';
	}

	init();

})(window);
