const main = document.querySelector('main');
const secs = main.querySelectorAll('section');
const btns = createBtns(secs.length);
const baseLine = -window.innerHeight / 2;
const speed = 500;
let preventEvent = false;

activation();
window.addEventListener('scroll', activation);
window.addEventListener('resize', modifyPos);

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
			btns.forEach((btn) => btn.classList.remove('on'));
			btns[idx].classList.add('on');
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
