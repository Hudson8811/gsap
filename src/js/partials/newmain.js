if($('.main').hasClass('blog_page')){
    var header = $('.header');
	var classes = 'active';
	var headerHeight = header.outerHeight();
	var scroll = $(window).scrollTop();
	var isScroll = false;

	$(window).on('scroll', function() {
		scroll = $(window).scrollTop();

		if (scroll >= headerHeight) {
			isScroll = true;
			headerHeight = isScroll ? header.outerHeight() : null;
			header.addClass(classes);

			if (!header.hasClass('is-fixed')) {
				header.css({'top': -headerHeight + 'px', 'transform': 'translateY(' + headerHeight + 'px)'}).addClass('is-fixed');

				
			}
		} else {
			isScroll = false;
			header.removeClass(classes + ' is-fixed').removeAttr('style');
			
		}
	});
    
}


window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

$(function() {
    var l = 82,
        fragment = document.createDocumentFragment(),
        div = document.createElement('div');

    while (l--) {
        fragment.appendChild(div.cloneNode(true));
    }

    $('.home__circles-lines').append(fragment);

    const noise = () => {
        let canvas, ctx;
        let canvas2, ctx2;
        let wWidth, wHeight;
        let noiseData = [];
        let frame = 0;
        let loopTimeout;

        // Create Noise
        const createNoise = () => {
            const idata = ctx.createImageData(wWidth, wHeight);
            const buffer32 = new Uint32Array(idata.data.buffer);
            const len = buffer32.length;
            for (let i = 0; i < len; i++) {
                if (Math.random() < 0.5) {
                    buffer32[i] = 0xff000000;
                }
            }
            noiseData.push(idata);
        };

        // Play Noise
        const paintNoise = () => {
            if (frame === 9) {
                frame = 0;
            } else {
                frame++;
            }
            ctx.putImageData(noiseData[frame], 0, 0);
            ctx2.putImageData(noiseData[frame], 0, 0);
        };

        // Loop
        const loop = () => {
            paintNoise(frame);

            loopTimeout = window.setTimeout(() => {
                window.requestAnimationFrame(loop);
            }, (1000 / 25));
        };

        // Setup
        const setup = () => {
            wWidth = window.innerWidth;
            wHeight = window.innerHeight;
            canvas.width = wWidth;
            canvas.height = wHeight;
            canvas2.width = wWidth;
            canvas2.height = wHeight;
            for (let i = 0; i < 10; i++) {
                createNoise();
            }
            loop();
        };

        // Reset
        let resizeThrottle;
        const reset = () => {
            window.addEventListener('resize', () => {
                window.clearTimeout(resizeThrottle);
                resizeThrottle = window.setTimeout(() => {
                    window.clearTimeout(loopTimeout);
                    setup();
                }, 200);
            }, false);
        };

        // Init
        const init = (() => {
            canvas = document.getElementById('noise');
            ctx = canvas.getContext('2d');
            canvas2 = document.getElementById('noise_menu');
            ctx2 = canvas2.getContext('2d');
            setup();
        })();
    };

    noise();
});


$(function (){
    $(window).on('load',function (){
        $('#preloader').fadeOut(2000);
        if ($('.home-page').length > 0) {
            if ($(window).width() > 768 && window.orientation !== 0) {
                gsap.registerPlugin(ScrollTrigger);
                gsap.registerPlugin(ScrollToPlugin);

                let currentSlide = 0;

                let titles = gsap.utils.toArray(".page-title li"),
                    sections = gsap.utils.toArray(".scrollable"),
                    projectBlocks = gsap.utils.toArray(".projects__blocks .projects__block"),
                    newsBlocks = gsap.utils.toArray(".news__blocks .news__block");
                let scrollDurationHome = 1000,
                    projectBlocksScroll = projectBlocks.length * 500,
                    newsBlocksScroll = newsBlocks.length * 500;

                let linkData = {
                    '0': 0,
                    '1': scrollDurationHome,
                    '2': scrollDurationHome * 2 + projectBlocksScroll,
                    '3': scrollDurationHome * 3 + projectBlocksScroll,
                    '4': scrollDurationHome * 4 + projectBlocksScroll,
                    '5': scrollDurationHome * 5 + projectBlocksScroll,
                    '6': scrollDurationHome * 6 + projectBlocksScroll + newsBlocksScroll,
                }

                let tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: ".scroll",
                        pin: true,
                        scrub: true,
                        start: "top top",
                        end: "+=" + (scrollDurationHome * (sections.length - 1) + projectBlocksScroll + newsBlocksScroll),
                        onUpdate: ({progress, direction, isActive}) => {
                            let currentScroll = $('html').scrollTop();
                            Object.keys(linkData).forEach(key => {
                                if (currentScroll >= linkData[key]) currentSlide = key;
                            });
                        },
                    }
                });


                let sectionNumber = 0;

                //home+projects start
                sectionNumber++;

                gsap.set('.home .sticky-title li', {'opacity': 0});

                let tlProjectBtn = new TimelineMax({paused: true});
                tlProjectBtn.from(".projects .content__btn-block > *", 0.3, {scale: 0, ease: Back.easeOut});

                let tlTitle2 = gsap.timeline({paused: true});
                tlTitle2.to(titles[sectionNumber], {y: "0", duration: 0.2,});
                tlTitle2.to(titles[sectionNumber - 1], {y: "-100%", duration: 0.2,}, 0);

                gsap.set(titles, {y: "100%"});

                gsap.delayedCall(0.2, function () {
                    gsap.to(titles[0], {y: "0", duration: 0.2});
                });

                let tl1 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + 0,
                        snap: {
                            snapTo: 1,
                            duration: {min: 0.2, max: 0.5},
                            delay: 0.2,
                            ease: 'none'
                        },
                        end: "+=" + scrollDurationHome,
                        onUpdate: ({progress, direction, isActive}) => {
                            if (progress >= 0.9) {
                                tlProjectBtn.play();
                            } else {
                                tlProjectBtn.reverse();
                            }
                        },
                        onToggle: ({progress, direction, isActive}) => {
                            if (!isActive && direction > 0) {
                                tlTitle2.play();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(1).addClass('active');
                            } else if (isActive && direction < 0) {
                                tlTitle2.reverse();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(0).addClass('active');
                            }
                        }
                    }
                });
                tl1.to(sections, {
                    xPercent: -100 * sectionNumber,
                    ease: "none"
                }, 0);

                gsap.delayedCall(0.4, function () {
                    let tl1 = new TimelineMax();
                    let titles = gsap.utils.toArray(".home .content__title > *");
                    titles.forEach((title, index) => {
                        if (index % 2 === 0) {
                            tl1.from(title, 1, {autoAlpha: 0, left: -600, ease: Power1.easeOut}, 0.2 * index);
                        } else {
                            tl1.from(title, 1, {autoAlpha: 0, right: -600, ease: Power1.easeOut}, 0.2 * index);
                        }
                    });
                    tl1.from(".home .content__description", 1, {
                        autoAlpha: 0,
                        left: -600,
                        ease: Power1.easeOut
                    }, '-=0.5');
                    tl1.from(".home .content__btn-block > *", 1, {scale: 0, ease: Back.easeOut}, '-=0.5');

                    let elements = $(".home__number");
                    TweenMax.staggerFrom(elements, 1, {autoAlpha: 0, bottom: -300, ease: Back.easeOut}, 0.3);
                });
                gsap.delayedCall(0.5, function () {
                    let numbers = gsap.utils.toArray(".home__number-digital[data-number]");

                    numbers.forEach((number, index) => {
                        let Cont = {val: 0},
                            NewVal = $(number).data('number');

                        gsap.to(Cont, 2, {
                            val: NewVal, roundProps: "val", onUpdate: function () {
                                number.innerHTML = Cont.val
                            }
                        });
                    });
                });
                gsap.delayedCall(0.8, function () {
                    gsap.to(".home__circles-lines div", {height: '100%', duration: 2, opacity: 1});
                });
                gsap.delayedCall(1, function () {
                    gsap.to(".home__circle--left", {left: '50%', duration: 2, opacity: 1});
                    gsap.to(".home__circle--right", {right: '50%', duration: 2, opacity: 1});
                });
                tl1.to(".home__circle--left, .home__circle--rigth", {
                    x: 0,
                    ease: "none"
                }, 0);


                //projects

                let titlesProjects = gsap.utils.toArray(".projects .content__title > *");
                titlesProjects.forEach((title, index) => {
                    if (index % 2 === 0) {
                        tl1.from(title, {autoAlpha: 0, right: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    } else {
                        tl1.from(title, {autoAlpha: 0, left: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    }
                });

                let menuProjects = gsap.utils.toArray(".projects .projects__menu > li > *");
                menuProjects.forEach((title, index) => {
                    tl1.from(title, {autoAlpha: 0, right: -700 - 150 * index, ease: Power1.easeOut}, 0);
                });
                let projectHeights = [];
                let tempHeight = 0;
                projectBlocks.forEach((block, index) => {
                    let height = $(block).outerHeight();
                    if (index > 0) {
                        projectHeights[index] = tempHeight - $('.projects__blocks').innerHeight() / 2;
                    } else {
                        projectHeights[index] = 0;
                    }
                    tempHeight += height;
                });

                let tl11 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + scrollDurationHome,
                        end: "+=" + projectBlocksScroll,
                    }
                });
                let projectsBlockHeight = 0;
                $('.projects__block').each(function () {
                    projectsBlockHeight += $(this).outerHeight();
                });
                projectsBlockHeight -= $('.projects__blocks').innerHeight();
                tl11.to(".projects__blocks", {
                    scrollTo: {y: projectsBlockHeight},
                    onUpdate: function () {
                        let scrolled = $('.projects__blocks').scrollTop();
                        let maxIndex = 0;
                        projectHeights.forEach(function (value, index) {
                            if (scrolled > value) maxIndex = index;
                        });
                        $('.projects__menu li').removeClass('active');
                        $('.projects__menu li').eq(maxIndex).addClass('active');

                    }
                }, 0);

                //home+projects end


                //awards start
                sectionNumber++;

                let tlAvardsBtn = new TimelineMax({paused: true});
                tlAvardsBtn.from(".awards .content__description", 0.3, {
                    autoAlpha: 0,
                    left: -600,
                    ease: Power1.easeOut
                });
                tlAvardsBtn.from(".awards .content__btn-block > *", 0.3, {scale: 0, ease: Back.easeOut});

                let tlTitle3 = gsap.timeline({paused: true});
                tlTitle3.to(titles[sectionNumber], {y: "0", duration: 0.2,});
                tlTitle3.to(titles[sectionNumber - 1], {y: "-100%", duration: 0.2,}, 0);


                let tl3 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome + projectBlocksScroll),
                        end: "+=" + (scrollDurationHome),
                        onUpdate: ({progress, direction, isActive}) => {
                            if (progress >= 0.9) {
                                tlAvardsBtn.play();
                            } else {
                                tlAvardsBtn.reverse();
                            }
                        },
                        onToggle: ({progress, direction, isActive}) => {
                            if (!isActive && direction > 0) {
                                tlTitle3.play();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(2).addClass('active');
                            } else if (isActive && direction < 0) {
                                tlTitle3.reverse();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(1).addClass('active');
                            }
                        }
                    }
                });


                let titlesAwards = gsap.utils.toArray(".awards .content__title > *");
                titlesAwards.forEach((title, index) => {
                    if (index % 2 === 0) {
                        tl3.from(title, {autoAlpha: 0, right: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    } else {
                        tl3.from(title, {autoAlpha: 0, left: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    }
                });

                let tl31 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome + projectBlocksScroll + scrollDurationHome / 2),
                        end: "+=" + (scrollDurationHome / 2),
                    }
                });
                tl31.from('.awards .content__subtitle', {autoAlpha: 0, top: -200, ease: Power1.easeOut}, 0);
                let awardsAwards = gsap.utils.toArray(".awards__list .content__award");
                awardsAwards.forEach((award, index) => {
                    tl31.from(award, {autoAlpha: 0, bottom: -800 - 300 * index, ease: Power1.easeOut}, 0);
                });

                //awards end

                //testimonials start
                sectionNumber++;
                let tlTitle4 = gsap.timeline({paused: true});
                tlTitle4.to(titles[sectionNumber], {y: "0", duration: 0.2,});
                tlTitle4.to(titles[sectionNumber - 1], {y: "-100%", duration: 0.2,}, 0);

                let tl4 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome * (sectionNumber - 1) + projectBlocksScroll),
                        end: "+=" + (scrollDurationHome),
                        onToggle: ({progress, direction, isActive}) => {
                            if (!isActive && direction > 0) {
                                tlTitle4.play();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(3).addClass('active');
                            } else if (isActive && direction < 0) {
                                tlTitle4.reverse();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(2).addClass('active');
                            }
                        }
                    }
                });

                let titlesTesti = gsap.utils.toArray(".testimonials .content__title > *");
                titlesTesti.forEach((title, index) => {
                    if (index % 2 === 0) {
                        tl4.from(title, {autoAlpha: 0, right: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    } else {
                        tl4.from(title, {autoAlpha: 0, left: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    }
                });
                let clientsTesti = gsap.utils.toArray(".testimonials__clients > .testimonials__client");
                clientsTesti.forEach((client, index) => {
                    tl4.from(client, {autoAlpha: 0, bottom: -600 - 200 * index, ease: Power1.easeOut}, 0);
                });


                let tl41 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome * (sectionNumber - 1) + projectBlocksScroll + scrollDurationHome / 2),
                        end: "+=" + (scrollDurationHome / 2),
                    }
                });
                tl41.from('.testimonials .content__subtitle', {autoAlpha: 0, top: -200, ease: Power1.easeOut}, 0);

                //testimonials end


                //experience start
                sectionNumber++;

                let tlExpBtn = new TimelineMax({paused: true});
                tlExpBtn.from(".experience .content__description", 0.3, {
                    autoAlpha: 0,
                    left: -600,
                    ease: Power1.easeOut
                });
                tlExpBtn.from(".experience .content__btn-block > *", 0.3, {scale: 0, ease: Back.easeOut});

                let tlTitle5 = gsap.timeline({paused: true});
                tlTitle5.to(titles[sectionNumber], {y: "0", duration: 0.2,});
                tlTitle5.to(titles[sectionNumber - 1], {y: "-100%", duration: 0.2,}, 0);


                let tl5 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome * (sectionNumber - 1) + projectBlocksScroll),
                        end: "+=" + (scrollDurationHome),
                        onUpdate: ({progress, direction, isActive}) => {
                            if (progress >= 0.9) {
                                tlExpBtn.play();
                            } else {
                                tlExpBtn.reverse();
                            }
                        },
                        onToggle: ({progress, direction, isActive}) => {
                            if (!isActive && direction > 0) {
                                tlTitle5.play();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(4).addClass('active');
                            } else if (isActive && direction < 0) {
                                tlTitle5.reverse();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(3).addClass('active');
                            }
                        }
                    }
                });


                let titlesExp = gsap.utils.toArray(".experience .content__title > *");
                titlesExp.forEach((title, index) => {
                    if (index % 2 === 0) {
                        tl5.from(title, {autoAlpha: 0, right: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    } else {
                        tl5.from(title, {autoAlpha: 0, left: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    }
                });


                let tl51 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome * (sectionNumber - 1) + projectBlocksScroll + scrollDurationHome / 2),
                        end: "+=" + (scrollDurationHome / 2),
                    }
                });
                let awardsExp = gsap.utils.toArray(".experience__list .content__award");
                awardsExp.forEach((award, index) => {
                    tl51.from(award, {autoAlpha: 0, bottom: -800 - 300 * index, ease: Power1.easeOut}, 0);
                });
                //experience end


                //news start
                sectionNumber++;

                let tlNewsBtn = new TimelineMax({paused: true});
                tlNewsBtn.from(".news .content__btn-block > *", 0.3, {scale: 0, ease: Back.easeOut});

                let tlTitle6 = gsap.timeline({paused: true});
                tlTitle6.to(titles[sectionNumber], {y: "0", duration: 0.2,});
                tlTitle6.to(titles[sectionNumber - 1], {y: "-100%", duration: 0.2,}, 0);


                let tl6 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome * (sectionNumber - 1) + projectBlocksScroll),
                        end: "+=" + (scrollDurationHome),
                        onUpdate: ({progress, direction, isActive}) => {
                            if (progress >= 0.9) {
                                tlNewsBtn.play();
                            } else {
                                tlNewsBtn.reverse();
                            }
                        },
                        onToggle: ({progress, direction, isActive}) => {
                            if (!isActive && direction > 0) {
                                tlTitle6.play();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(5).addClass('active');
                            } else if (isActive && direction < 0) {
                                tlTitle6.reverse();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(4).addClass('active');
                            }
                        }
                    }
                });


                let titlesNews = gsap.utils.toArray(".news .content__title > *");
                titlesNews.forEach((title, index) => {
                    if (index % 2 === 0) {
                        tl6.from(title, {autoAlpha: 0, right: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    } else {
                        tl6.from(title, {autoAlpha: 0, left: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    }
                });

                let menuNews = gsap.utils.toArray(".news .news__menu > li > *");
                menuNews.forEach((title, index) => {
                    tl6.from(title, {autoAlpha: 0, right: -700 - 150 * index, ease: Power1.easeOut}, 0);
                });

                let newsHeights = [];
                tempHeight = 0;
                newsBlocks.forEach((block, index) => {
                    let height = $(block).outerHeight();
                    if (index > 0) {
                        newsHeights[index] = tempHeight - $('.news__blocks').innerHeight() / 2;
                    } else {
                        newsHeights[index] = 0;
                    }
                    tempHeight += height;
                });
                let tl61 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome * sectionNumber + projectBlocksScroll),
                        end: "+=" + newsBlocksScroll,
                    }
                });
                let newsBlockHeight = 0;
                $('.news__block').each(function () {
                    newsBlockHeight += $(this).outerHeight();
                });
                newsBlockHeight -= $('.news__blocks').innerHeight();
                tl61.to(".news__blocks", {
                    scrollTo: {y: newsBlockHeight},
                    onUpdate: function () {
                        let scrolled = $('.news__blocks').scrollTop();
                        let maxIndex = 0;
                        newsHeights.forEach(function (value, index) {
                            if (scrolled > value) maxIndex = index;
                        });
                        $('.news__menu li').removeClass('active');
                        $('.news__menu li').eq(maxIndex).addClass('active');

                    }
                }, 0);

                //news end


                //contacts start
                sectionNumber++;

                let tlTitle7 = gsap.timeline({paused: true});
                tlTitle7.to(titles[sectionNumber], {y: "0", duration: 0.2,});
                tlTitle7.to(titles[sectionNumber - 1], {y: "-100%", duration: 0.2,}, 0);


                let tl7 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome * (sectionNumber - 1) + projectBlocksScroll + newsBlocksScroll),
                        end: "+=" + (scrollDurationHome),
                        onToggle: ({progress, direction, isActive}) => {
                            if (!isActive && direction > 0) {
                                tlTitle7.play();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(6).addClass('active');
                            } else if (isActive && direction < 0) {
                                tlTitle7.reverse();
                                $('.header__menu li').removeClass('active');
                                $('.header__menu li').eq(5).addClass('active');
                            }
                        }
                    }
                });


                let titlesContacts = gsap.utils.toArray(".contacts .content__title > *");
                titlesContacts.forEach((title, index) => {
                    if (index % 2 === 0) {
                        tl7.from(title, {autoAlpha: 0, right: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    } else {
                        tl7.from(title, {autoAlpha: 0, left: -600 - 100 * index, ease: Power1.easeOut}, 0);
                    }
                });
                tl7.from('.contacts .contacts__copyright', {autoAlpha: 0, bottom: -300, ease: Power1.easeOut}, 0);

                let menuContacts = gsap.utils.toArray(".contacts .contacts__menu > li > *");
                menuContacts.forEach((title, index) => {
                    tl7.from(title, {autoAlpha: 0, right: -700 - 150 * index, ease: Power1.easeOut}, 0);
                });

                let tl71 = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome * (sectionNumber - 1) + projectBlocksScroll + newsBlocksScroll + scrollDurationHome / 2),
                        end: "+=" + (scrollDurationHome / 2),
                    }
                });
                tl71.from('.contacts .content__subtitle', {autoAlpha: 0, top: -200, ease: Power1.easeOut}, 0);
                tl71.from('.contacts .content__brief', {autoAlpha: 0, left: -400, ease: Power1.easeOut}, 0);
                tl71.from('.contacts .content__form', {autoAlpha: 0, right: -400, ease: Power1.easeOut}, 0);
                //contacts end


                let tlScroll = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome + projectBlocksScroll),
                        end: "+=" + (scrollDurationHome * (sections.length - 3)),
                        snap: {
                            snapTo: 0.25,
                            duration: {min: 0.2, max: 0.5},
                            delay: 0.2,
                            ease: 'none'
                        },
                    }
                });
                tlScroll.to(sections, {
                    xPercent: -100 * (sections.length - 2),
                    ease: "none"
                }, 0);


                let tlScrollLast = gsap.timeline({
                    scrollTrigger: {
                        trigger: "body",
                        scrub: true,
                        start: "0 -" + (scrollDurationHome * (sections.length - 2) + projectBlocksScroll + newsBlocksScroll),
                        end: "+=" + (scrollDurationHome),
                        snap: {
                            snapTo: 1,
                            duration: {min: 0.2, max: 0.5},
                            delay: 0.2,
                            ease: 'none'
                        }
                    }
                });
                tlScrollLast.to(sections, {
                    xPercent: -100 * (sections.length - 1),
                    ease: "none"
                }, 0);


                $(document).on('click', '.js-scroll-link', function () {
                    event.preventDefault();
                    let link = $(this).data('link'),
                        currentScroll = $('html').scrollTop();

                    window.scrollTo(0, parseInt(linkData[link]));
                    switch (link) {
                        case 0:
                            tlScrollLast.progress(0);
                            tlScroll.progress(0);
                            tl1.progress(0);

                            tlTitle7.progress(0).pause();
                            tlTitle6.progress(0).pause();
                            tlTitle5.progress(0).pause();
                            tlTitle4.progress(0).pause();
                            tlTitle3.progress(0).pause();
                            tlTitle2.progress(0).pause();
                            break;
                        case 1:
                            tlScrollLast.progress(0);
                            tlScroll.progress(0);
                            tl1.progress(1);

                            tlTitle7.progress(0).pause();
                            tlTitle6.progress(0).pause();
                            tlTitle5.progress(0).pause();
                            tlTitle4.progress(0).pause();
                            tlTitle3.progress(0).pause();
                            tlTitle2.progress(1).pause();
                            break;
                        case 2:
                            tlScrollLast.progress(0);
                            tlScroll.progress(0.25);
                            tl1.progress(1);

                            tlTitle7.progress(0).pause();
                            tlTitle6.progress(0).pause();
                            tlTitle5.progress(0).pause();
                            tlTitle4.progress(0).pause();
                            tlTitle3.progress(1).pause();
                            tlTitle2.progress(1).pause();
                            break;
                        case 3:
                            tlScrollLast.progress(0);
                            tlScroll.progress(0.5);
                            tl1.progress(1);

                            tlTitle7.progress(0).pause();
                            tlTitle6.progress(0).pause();
                            tlTitle5.progress(0).pause();
                            tlTitle4.progress(1).pause();
                            tlTitle3.progress(1).pause();
                            tlTitle2.progress(1).pause();
                            break;
                        case 4:
                            tlScrollLast.progress(0);
                            tlScroll.progress(0.75);
                            tl1.progress(1);

                            tlTitle7.progress(0).pause();
                            tlTitle6.progress(0).pause();
                            tlTitle5.progress(1).pause();
                            tlTitle4.progress(1).pause();
                            tlTitle3.progress(1).pause();
                            tlTitle2.progress(1).pause();
                            break;
                        case 5:
                            tlScrollLast.progress(0);
                            tlScroll.progress(1);
                            tl1.progress(1);

                            tlTitle7.progress(0).pause();
                            tlTitle6.progress(1).pause();
                            tlTitle5.progress(1).pause();
                            tlTitle4.progress(1).pause();
                            tlTitle3.progress(1).pause();
                            tlTitle2.progress(1).pause();
                            break;
                        case 6:
                            tlScrollLast.progress(0.99);
                            tlScroll.progress(1);
                            tl1.progress(1);

                            tlTitle7.progress(1).pause();
                            tlTitle6.progress(1).pause();
                            tlTitle5.progress(1).pause();
                            tlTitle4.progress(1).pause();
                            tlTitle3.progress(1).pause();
                            tlTitle2.progress(1).pause();
                            break;
                        default:
                            break;
                    }
                    gsap.set(sections, {xPercent: -100 * parseInt(link), ease: "none"}, 0);

                    $('.header__menu li').removeClass('active');
                    $('.header__menu li').eq(parseInt(link)).addClass('active');
                    gsap.set(titles, {y: "-100%"});
                    gsap.set(titles[parseInt(link)], {y: "0"});
                    //$("html, body").animate({ scrollTop: parseInt(linkData[link]) }, (Math.abs(currentScroll-parseInt(linkData[link])))/2.5);
                });
            } else {
                //mobile
                $(document).on('click', '.js-scroll-link', function () {
                    event.preventDefault();
                    let href = $(this).attr('href'),
                        topPos = $(href).offset(),
                        header = $('.header').height();
                    $("html, body").animate({scrollTop: topPos.top - header}, 500);

                });
            }
        }

    });
});

$(function (){
    if ($('.home-page').length > 0){
        var slideDelay = 1.5;
        var slideDuration = 0.3;

        var slides = document.querySelectorAll(".slide");
        var prevButton = document.querySelector("#prevButton");
        var nextButton = document.querySelector("#nextButton");

        var numSlides = slides.length;

        for (var i = 0; i < numSlides; i++) {
            TweenLite.set(slides[i], {
                backgroundColor: Math.random() * 0xffffff,
                xPercent: i * 100
            });
        }

        var wrap = wrapPartial(-100, (numSlides - 1) * 100);
        //var timer = TweenLite.delayedCall(slideDelay, autoPlay);

        var animation = TweenMax.to(slides, 1, {
            xPercent: "-=" + (numSlides * 100),
            ease: Linear.easeNone,
            paused: true,
            repeat: -1,
            modifiers: {
                xPercent: wrap
            }
        });

        var proxy = document.createElement("div");
        TweenLite.set(proxy, { x: "+=0" });

        var slideAnimation = TweenLite.to({}, 0.1, {});
        var slideWidth = 0;
        var wrapWidth = 0;
        resize();


        window.addEventListener("resize", resize);

        prevButton.addEventListener("click", function() {
            animateSlides(-1);
        });

        nextButton.addEventListener("click", function() {
            animateSlides(1);
        });

        function updateDraggable() {
            //timer.restart(true);
            slideAnimation.kill();
            this.update();
        }

        function animateSlides(direction) {
            //timer.restart(true);
            slideAnimation.kill();
            var x = snapX(gsap.getProperty(proxy,'x') + direction * slideWidth);
            slideAnimation = gsap.to(proxy, {duration: slideDuration, x: x,onUpdate: updateProgress});
        }

        function autoPlay() {

        }

        function updateProgress() {
            animation.progress(gsap.getProperty(proxy,'x') / wrapWidth);
        }

        function snapX(x) {
            return Math.round(x / slideWidth) * slideWidth;
        }

        function resize() {

            var norm = (gsap.getProperty(proxy,'x') / wrapWidth) || 0;

            slideWidth = slides[0].offsetWidth;
            wrapWidth = slideWidth * numSlides;

            TweenLite.set(proxy, {
                x: norm * wrapWidth
            });

            animateSlides(0);
            slideAnimation.progress(1);
        }

        function wrapPartial(min, max) {
            var r = max - min;
            return function(value) {
                var v = value - min;
                return ((r + v % r) % r) + min;
            }
        }
    }

    $('.content__form-input input').on('change blur',function (){
        let value = $(this).val();
        if (value.length > 0){
            $(this).addClass('valid');
        } else {
            $(this).removeClass('valid');
        }
    });
});