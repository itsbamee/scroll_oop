class MyScroll {
	constructor(selector, opt) {
		if (!selector) return console.error('선택자는 필수 입력사항입니다.');

		const defOpt = { baseLine: 0, speed: 500, isAutoScroll: false };
		const resultOpt = { ...defOpt, ...opt };

		this.selName = selector;
		this.secs = document.querySelectorAll(selector);
		this.btns = this.createBtns(this.secs.length);
		this.baseLine = resultOpt.baseLine;
		this.speed = resultOpt.speed;
		this.preventEvent = false;
		this.isAutoScroll = resultOpt.isAutoScroll;
		this.eventBlocker = null;

		this.bindingEvent();
	}

	bindingEvent() {
		this.activation();
		//내부적으로 this 인스턴스객체의 변형을 막아주려면 무조건 화살표함수로 wrapping처리
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

	setThrottle(func, varName = eventBlocker, delay = this.speed) {
		if (window[varName]) return;

		window[varName] = setTimeout(() => {
			func && func();
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
		const active = document.querySelector(`${this.selName}.on`); //.myScroll.on
		const active_index = Array.from(this.secs).indexOf(active);

		e.deltaY > 0
			? active_index !== this.secs.length - 1 && this.moveScroll(active_index + 1, this.speed / 2)
			: active_index !== 0 && this.moveScroll(active_index - 1, this.speed / 2);
	}
}
