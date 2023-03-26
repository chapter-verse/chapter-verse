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
