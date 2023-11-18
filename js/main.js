/*
  window.scrollY : 브라우저의 현재 스크롤 거리 값 (동적=계속바뀌는 값)
  DOM.offsetTop : 문서 상단 끝에서부터 현재 DOM 요소까지의 세로 위치값 (정적)
  window.scrollTo({top: 이동할 세로 위치값})
*/

const [main, ul] = document.body.children;
const secs = main.querySelectorAll('section');
const btns = ul.querySelectorAll('li');
const baseLine = -window.innerHeight / 2;
const speed = 500;

window.addEventListener('scroll', activation);

btns.forEach((btn, idx) => {
	btn.addEventListener('click', () => moveScroll(idx, speed));
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
	new Anime(window, { scroll: secs[idx].offsetTop }, { duration: speed, easeType: 'ease1' });
}
