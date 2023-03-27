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
});

$(() => {
	$('#edit-preferences').click(function () {
		$('#edit-preferences-modal').addClass('is-active');
	});
	$('.modal-card-head button.delete, .modal-save, .modal-cancel').click(function () {
		$('#edit-preferences-modal').removeClass('is-active');
	});
});
