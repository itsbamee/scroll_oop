const main = document.querySelector('main');
const secs = main.querySelectorAll('section');
const btns = createBtns(secs.length);
const baseLine = -window.innerHeight / 2;
const speed = 500;
let preventEvent = false;

activation();
window.addEventListener('scroll', activation);
window.addEventListener('resize', modifyPos);
window.addEventListener('mousewheel', autoScroll, { passive: false });

btns.forEach((btn, idx) => {
	btn.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('on') || preventEvent) return;
		preventEvent = true;
		moveScroll(idx, speed);
	});
});

function createBtns(num) {
	const ul = document.createElement('ul');
	Array(num)
		.fill()
		.forEach(() => ul.append(document.createElement('li')));

	document.body.append(ul);
	return document.querySelectorAll('ul li');
}

function activation() {
	const scroll = window.scrollY;
	secs.forEach((_, idx) => {
		if (scroll >= secs[idx].offsetTop + baseLine) {
			btns.forEach((el) => el.classList.remove('on'));
			btns[idx].classList.add('on');

			secs.forEach((el) => el.classList.remove('on'));
			secs[idx].classList.add('on');
		}
	});
}

function modifyPos() {
	const active = ul.querySelector('li.on');
	const active_index = Array.from(btns).indexOf(active);
	console.log(active_index);
	window.scrollTo({ top: secs[active_index].offsetTop });
}

function moveScroll(idx, speed) {
	console.log('move');
	new Anime(
		window,
		{ scroll: secs[idx].offsetTop },
		{ duration: speed, callback: () => (preventEvent = false) }
	);
}

function autoScroll(e) {
	e.preventDefault();
	const active = main.querySelector('section.on');
	const active_index = Array.from(secs).indexOf(active);

	e.deltaY > 0
		? active_index !== secs.length - 1 && moveScroll(active_index + 1, speed / 2)
		: active_index !== 0 && moveScroll(active_index - 1, speed / 2);
}
