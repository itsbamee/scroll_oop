class MyScroll {
	//생성자 만들기
	constructor() {
		//모든 전역변수 및 이벤트 넣고 this. 붙이기
		this.main = document.querySelector('main');
		this.secs = this.main.querySelectorAll('section');
		this.btns = this.createBtns(this.secs.length);
		this.baseLine = -window.innerHeight / 2;
		this.speed = 500;
		this.preventEvent = false;
		this.isAutoScroll = true;
		this.eventBlocker = null;

		this.bindingEvent();
		//바인딩이벤트 호출
	}

	//bindingEvent만들기 (거의공식)
	//this붙이는 것 : 생성자 안쪽에 this활용되는 것에만 this붙이면됨
	bindingEvent() {
		this.activation();
		//화살표함수로 감싸줘야 함
		//내부적으로 this 인스턴스객체의 변경을 막아주려면 무조건 화살표함수로 warpping처리
		window.addEventListener('scroll', () =>
			this.setThrottle(() => this.activation(), this.eventBlocker)
		);
		window.addEventListener('resize', () =>
			this.setThrottle(() => this.modifyPos(), this.eventBlocker)
		);
		this.isAutoScroll &&
			window.addEventListener('mousewheel', (e) => this.autoScroll(e), { passive: false });

		this.btns.forEach((btn, idx) => {
			btn.addEventListener('click', (e) => {
				if (window.scrollY === this.secs[idx].offsetTop) {
					if (e.currentTarget.classList.contains('on') || this.preventEvent) return;
				}

				this.preventEvent = true;
				this.moveScroll(idx, this.speed);
			});
		});
	}

	setThrottle(func, varName = eventBlocker, delay = 500) {
		if (window[varName]) return;

		window[varName] = setTimeout(() => {
			func && func(); //func값이 있을때만 func실행
			window[varName] = null;
		}, delay);
	}

	createBtns(num) {
		const ul = document.createElement('ul');
		Array(num)
			.fill()
			.forEach(() => ul.append(document.createElement('li')));
		document.body.append(ul);
		return document.querySelectorAll('ul li');
	}

	activation() {
		console.log(this.secs);
		const scroll = window.scrollY;
		this.secs.forEach((_, idx) => {
			if (scroll >= this.secs[idx].offsetTop + this.baseLine) {
				this.btns.forEach((el) => el.classList.remove('on'));
				this.btns[idx].classList.add('on');

				this.secs.forEach((el) => el.classList.remove('on'));
				this.secs[idx].classList.add('on');
			}
		});
	}

	modifyPos() {
		const active = document.querySelector('li.on');
		const active_index = Array.from(this.btns).indexOf(active);
		window.scrollTo({ top: this.secs[active_index].offsetTop, behavior: 'smooth' });
	}

	moveScroll(idx, speed) {
		new Anime(
			window,
			{ scroll: this.secs[idx].offsetTop },
			{ duration: this.speed, callback: () => (this.preventEvent = false) }
		);
	}

	autoScroll(e) {
		e.preventDefault();
		const active = this.main.querySelector('section.on');
		const active_index = Array.from(this.secs).indexOf(active);

		e.deltaY > 0
			? active_index !== this.secs.length - 1 && this.moveScroll(active_index + 1, this.speed / 2)
			: active_index !== 0 && this.moveScroll(active_index - 1, this.speed / 2);
	}
}
