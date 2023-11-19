const main = document.querySelector('main');
const secs = main.querySelectorAll('section');
const btns = createBtns(secs.length);
const baseLine = -window.innerHeight / 2;
const speed = 500;
let preventEvent = false;
let isAutoScroll = true;
let eventBlocker = null;

//단기간에 많이 발생하는 이벤트 (resize, scroll) 1초에 60번 반복 (화면주사율)
//throttle : 이벤트 발생을 강제로 throttling해서 불필요한 반복되는 이벤트 핸들러 함수 호출을 방지
activation();

//스크롤 이벤트가 발생할 때마다 eventBlocker라는 전역변수에 setTimeout이 리턴하는 1씩 증가하는 값을 담음
window.addEventListener('scroll', () => {
	if (eventBlocker) return;
	//setTimeout이 실행될때마다 eventBlocker에는 true가 되므로(값이 담겨있다는 뜻)
	//setTimeout호출동안 0.2s 동안은 activation의 호출을 강제로 막아줌
	eventBlocker = setTimeout(() => {
		activation();
		//setTimeout이 종료되면 eventBlocker값이 null(false)가 되므로 다시 이벤트 호출이 가능해짐
		eventBlocker = null;
	}, 200);
});
window.addEventListener('resize', modifyPos);
isAutoScroll && window.addEventListener('mousewheel', autoScroll, { passive: false });

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
