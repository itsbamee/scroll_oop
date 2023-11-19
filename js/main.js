const main = document.querySelector('main');
const secs = main.querySelectorAll('section');
const btns = createBtns(secs.length);
const baseLine = -window.innerHeight / 2;
const speed = 500;
let preventEvent = false;
let isAutoScroll = true;
let eventBlocker = null;

activation();

//단지 setTimeout만 적용해서는 이벤트 호출시마다 계속 setTimeout이 초기화되므로 이벤트 방지 불가능
//setTimeout이 호출되자마자 즉시 만들어지는 return값으로 이벤트를 바로 막아주고
//setTimeout에 적용된 지연시간 뒤에 다시 return값을 null로 변경함으로써 이벤트 풀어줘야 함
window.addEventListener('scroll', () => setThrottle(activation), 200);
window.addEventListener('resize', () => setThrottle(modifyPos));
isAutoScroll && window.addEventListener('mousewheel', autoScroll, { passive: false });

btns.forEach((btn, idx) => {
	btn.addEventListener('click', (e) => {
		if (e.currentTarget.classList.contains('on') || preventEvent) return;
		preventEvent = true;
		moveScroll(idx, speed);
	});
});

function setThrottle(func, delay = 200) {
	if (eventBlocker) return;

	eventBlocker = setTimeout(() => {
		func();
		eventBlocker = null;
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
