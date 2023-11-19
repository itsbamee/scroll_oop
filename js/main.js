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
	//modifiedScroll = 스크롤되는 현재 baseLine이 적용된 세번째 섹션 위치값을 빼서
	//해당 영역에서부터 0으로 바뀌는 보정값
	//현재 동적으로 바뀌고있는 modifiedScroll값은 기존 섹션위치에서 baseLine을 빼준 것 만큼 더해줘야함
	let modifiedScroll = (scroll - secs[2].offsetTop - baseLine) * 4;

	//세번째 섹션이 활성화되는 스크롤 지점을 기존 baseLine(-임)값 만큼 위로 빼서 끌어올린 것
	if (scroll >= secs[2].offsetTop + baseLine) {
		//박스 활성호되는 영역 도달시 path에 modifiedScroll값 연동 시작됨
		//modifiedPos값이 음수로 빠지게 되면 무조건 값을 0으로 고정
		modifiedScroll >= path_len && (modifiedScroll = path_len);
		path.style.strokeDashoffset = path_len - modifiedScroll;
	} else {
		//세번째 섹션영역에 도달하기 전에는 전체 path길이만큼 strokeDashoffset값을 적용해서 선이 안보이는 상태로 유지
		//0을 주게되면 선이 전체가 보이는 상태이기 때문에 안됨
		path.style.strokeDashoffset = path_len;
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
