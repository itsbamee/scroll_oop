const main = document.querySelector('main');
const secs = main.querySelectorAll('section');
const path = main.querySelector('.svgBox path');
const box = main.querySelector('.box');
const path_len = 1506;
const btns = createBtns(secs.length);
const baseLine = -window.innerHeight / 2;
const speed = 500;
let preventEvent = false;
let isAutoScroll = false;
let eventBlocker = null;

activation();

window.addEventListener('scroll', () => setThrottle(activation, eventBlocker));
window.addEventListener('resize', () => setThrottle(modifyPos, eventBlocker));
isAutoScroll && window.addEventListener('mousewheel', autoScroll, { passive: false });

window.addEventListener('scroll', () => {
	const scroll = window.scrollY;
	let modifiedScroll = (scroll - secs[2].offsetTop - baseLine) * 4;

	if (scroll >= secs[2].offsetTop + baseLine) {
		modifiedScroll >= path_len && (modifiedScroll = path_len);
		path.style.strokeDashoffset = path_len - modifiedScroll;
	} else {
		path.style.strokeDashoffset = path_len;
	}

	let modifiedScroll2 = (scroll - secs[3].offsetTop - baseLine) / 500;

	if (scroll >= secs[3].offsetTop + baseLine) {
		box.style.opacity = 0 + modifiedScroll2;
		box.style.transform = `scale(${3 - modifiedScroll2 * 2})`;
	} else {
	}
});

btns.forEach((btn, idx) => {
	btn.addEventListener('click', (e) => {
		//일단 현재 섹션 위치값이 스크롤 위치값과 매칭 되었을 떄에만 아래 조건식을 적용
		if (window.scrollY === secs[idx].offsetTop) {
			//버튼이 활성화되어 있거나 혹은 모션중이면 moveScroll 불러오지않고 리턴으로 강제종료
			if (e.currentTarget.classList.contains('on') || preventEvent) return;
		}

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
	const active = document.querySelector('li.on');
	const active_index = Array.from(btns).indexOf(active);
	window.scrollTo({ top: secs[active_index].offsetTop, behavior: 'smooth' });
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
