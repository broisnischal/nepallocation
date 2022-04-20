document.addEventListener('DOMContentLoaded', function () {
	const url = new URL(window.location.href);
	const pathname = url.pathname;
	const id = pathname.split('/')[1];
	const navbtns = document.querySelectorAll('.nav-btns');

	navbtns.forEach((btn) => {
		if (id === btn.id) {
			btn.classList.add('active');
		}
	});
});
