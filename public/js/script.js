document.addEventListener('DOMContentLoaded', () => {
	(document.querySelectorAll('.notification') || []).forEach((notification) => {
		setTimeout(() => {
			notification.classList.add('fade-out');
			notification.addEventListener(
				'animationend',
				() => {
					notification.remove();
				},
				{ once: true },
			);
		}, 2000);
	});
	function openModal($el) {
		$el.classList.add('is-active');
	}

	function closeModal($el) {
		$el.classList.remove('is-active');
	}

	function closeAllModals() {
		(document.querySelectorAll('.modal') || []).forEach(($modal) => {
			closeModal($modal);
		});
	}

	// Add a click event on buttons to open a specific modal
	(document.querySelectorAll('.js-modal-trigger') || []).forEach(($trigger) => {
		const modal = $trigger.dataset.target;
		const $target = document.getElementById(modal);

		$trigger.addEventListener('click', () => {
			openModal($target);
		});
	});

	// Add a click event on various child elements to close the parent modal
	(
		document.querySelectorAll('.modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button') || []
	).forEach(($close) => {
		const $target = $close.closest('.modal');

		$close.addEventListener('click', () => {
			closeModal($target);
		});
	});

	// Add a keyboard event to close all modals
	document.addEventListener('keydown', (event) => {
		const e = event || window.event;

		if (e.keyCode === 27) {
			// Escape key
			closeAllModals();
		}
	});
	$(() => {
		$('#edit-preferences').click(function () {
			$('#edit-preferences-modal').addClass('is-active');
		});
		$('.modal-card-head button.delete, .modal-save, .modal-cancel').click(function () {
			$('#edit-preferences-modal').removeClass('is-active');
		});
	});
});



function openTab(evt, tabName) {
	var i, x, tablinks;
	x = document.getElementsByClassName("content-tab");
	for (i = 0; i < x.length; i++) {
		x[i].style.display = "none";
	}
	tablinks = document.getElementsByClassName("tab");
	for (i = 0; i < x.length; i++) {
		tablinks[i].className = tablinks[i].className.replace(" is-active", "");
	}
	document.getElementById(tabName).style.display = "block";
	evt.currentTarget.className += " is-active";
  }