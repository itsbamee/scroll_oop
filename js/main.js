const main = document.querySelector('main');
const secs = main.querySelectorAll('section');
const box = main.querySelector('.box');
//커스텀 섹션 관련 모션 변수
// const path = main.querySelector('.svgBox path');
// const path_len = 1506;
const btns = createBtns(secs.length);
const baseLine = -window.innerHeight / 2;
const speed = 500;
let preventEvent = false;
let isAutoScroll = false;
let eventBlocker = null;

//이벤트 총 5개
activation(); //버튼활성화
window.addEventListener('scroll', () => setThrottle(activation, eventBlocker));
//일정시간 인터벌을 줘서 핸들러함수(이벤트함수) 호출횟수를 강제로 줄임 (쓰로틀)
window.addEventListener('resize', () => setThrottle(modifyPos, eventBlocker));
isAutoScroll && window.addEventListener('mousewheel', autoScroll, { passive: false });
//버튼클릭 이벤트
btns.forEach((btn, idx) => {
	btn.addEventListener('click', (e) => {
		if (window.scrollY === secs[idx].offsetTop) {
			if (e.currentTarget.classList.contains('on') || preventEvent) return;
		}

		preventEvent = true;
		moveScroll(idx, speed);
	});
});
//복잡한 코드일수록 이벤트문 위주로 봐야함 (전반적인 기능파악..)
//함수도 처음 호출된 순서대로 보는게 중요...

/*
스크롤시 섹션 커스텀 모션 이벤트 연결
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
*/

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
