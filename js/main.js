const main = document.querySelector('main');
const secs = main.querySelectorAll('section');
const path = main.querySelector('.svgBox path');
const path_len = 1506;
const btns = createBtns(secs.length);
const baseLine = -window.innerHeight / 2;
const speed = 500;
let preventEvent = false;
let isAutoScroll = true;
let eventBlocker = null;

activation();

window.addEventListener('scroll', () => setThrottle(activation, eventBlocker));
window.addEventListener('resize', () => setThrottle(modifyPos, eventBlocker));
isAutoScroll && window.addEventListener('mousewheel', autoScroll, { passive: false });

//커스텀 스크롤 모션
window.addEventListener('scroll', () => {
	const scroll = window.scrollY;
	//currentPos => 세번째 섹션이 활성화되는 세로 위치지점
	const currentPos = secs[2].offsetTop - window.innerHeight / 2;
	//스크롤이 세번째 섹션의 활성화 영역에 도달할 때부터 path의 스타일값 연동 시작
	if (scroll >= currentPos) {
		path.style.strokeDashoffset = path_len - (scroll - currentPos);
	}
});

btns.forEach((btn, idx) => {
	btn.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('on') || preventEvent) return;
		preventEvent = true;
		moveScroll(idx, speed);
	});
});

function setThrottle(func, varName = eventBlocker, delay = 500) {
	if (window[varName]) return;

	window[varName] = setTimeout(() => {
		func();
		window[varName] = null;
	}, delay);
}

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
	console.log('modifyPos');
	const active = document.querySelector('li.on');
	const active_index = Array.from(btns).indexOf(active);
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
