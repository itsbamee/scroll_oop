const [main, ul] = document.body.children;
const secs = main.querySelectorAll('section');
const btns = ul.querySelectorAll('li');
const baseLine = -window.innerHeight / 2;
const speed = 500;
let preventEvent = false;

window.addEventListener('scroll', activation);

btns.forEach((btn, idx) => {
	btn.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('on') || preventEvent) return;
		preventEvent = true;
		moveScroll(idx, speed);
	});
});

function activation() {
	const scroll = window.scrollY;
	secs.forEach((_, idx) => {
		if (scroll >= secs[idx].offsetTop + baseLine) {
			btns.forEach((btn) => btn.classList.remove('on'));
			btns[idx].classList.add('on');
		}
	});
}

function moveScroll(idx, speed) {
	console.log('move');
	new Anime(
		window,
		{ scroll: secs[idx].offsetTop },
		{ duration: speed, callback: () => (preventEvent = false) }
	);
}
