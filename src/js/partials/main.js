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

            setup();
        })();
    };

    noise();

    let titles = gsap.utils.toArray(".page-title li");
    /*titles.forEach((title) => {
        gsap.set(title, {y: "-100%"});
    });*/


    let scrollDuration = 7000;

    gsap.registerPlugin(ScrollTrigger);

    let duration = 10,
        sections = gsap.utils.toArray(".scrollable"),
        sectionIncrement = duration / (sections.length - 1),
        tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".scroll",
                pin: true,
                scrub: 1,
                snap: 1 / (sections.length - 1),
                start: "top top",
                end: "+="+scrollDuration,
            }
        });

    tl.to(sections, {
        xPercent: -100 * (sections.length - 1),
        duration: duration,
        ease: "none"
    });



    //анимации на каждый слайд
    sections.forEach((section, index) => {
        let tween = gsap.timeline();

        tween.to(titles[index+1], {
            y: "0",
            duration: 0.2,
        });
        tween.to(titles[index], {
            y: "100%",
            duration: 0.2,
        },0);

        addSectionCallbacks(tl, {
            start: sectionIncrement * (index - 0.99),
            end: sectionIncrement * (index + 0.99),
            //onEnter: () => tween.play(),
            onLeave: () => tween.play(),
            onEnterBack: () => tween.reverse(),
            //onLeaveBack: () => tween.reverse()
        });
        tween.pause();
        tl.seek(0.2);
        //index || tween.progress(1);
    });



    function addSectionCallbacks(timeline, {start, end, param, onEnter, onLeave, onEnterBack, onLeaveBack}) {
        let trackDirection = animation => {
                let onUpdate = animation.eventCallback("onUpdate"),
                    prevTime = animation.time();
                animation.direction = animation.reversed() ? -1 : 1;
                animation.eventCallback("onUpdate", () => {
                    let time = animation.time();
                    if (prevTime !== time) {
                        animation.direction = time < prevTime ? -1 : 1;
                        prevTime = time;
                    }
                    onUpdate && onUpdate.call(animation);
                });
            },
            empty = v => v;
        timeline.direction || trackDirection(timeline);
        start >= 0 && timeline.add(() => ((timeline.direction < 0 ? onLeaveBack : onEnter) || empty)(param), start);
        end <= timeline.duration() && timeline.add(() => ((timeline.direction < 0 ? onEnterBack : onLeave) || empty)(param), end);
    }




    //home
    gsap.delayedCall(0.4, function (){
        let tl1 = new TimelineMax();
        let titles = gsap.utils.toArray(".home .content__title > *");
        titles.forEach((title, index) => {
            if (index % 2 === 0) {
                tl1.from(title, 1, {autoAlpha:0, left:-600, ease:Power1.easeOut}, 0.2*index);
            }  else {
                tl1.from(title, 1, {autoAlpha:0, right:-600, ease:Power1.easeOut}, 0.2*index);
            }
        });

        tl1.from(".home .content__description", 1, {autoAlpha:0, left:-600, ease:Power1.easeOut}, '-=0.5');
        tl1.from(".home .content__btn-block > *", 1, {scale:0, ease:Back.easeOut}, '-=0.5');
    });
    gsap.delayedCall(0.4, function (){
       let elements = $(".home__number");
       TweenMax.staggerFrom(elements, 1, {autoAlpha:0, bottom:-300, ease:Back.easeOut}, 0.3);
    });
    gsap.delayedCall(0.5, function (){
        let numbers = gsap.utils.toArray(".home__number-digital[data-number]");

        numbers.forEach((number, index) => {
            let Cont = {val:0},
                NewVal = $(number).data('number');

            TweenLite.to(Cont,2,{val:NewVal,roundProps:"val",onUpdate:function(){
                    number.innerHTML=Cont.val
                }});
        });
    });
    gsap.delayedCall(0.8, function (){
        gsap.to(".home__circles-lines div", {height: '100%',duration: 2,opacity:1});
    });
    gsap.delayedCall(1, function (){
        gsap.to(".home__circle--left", {left: '50%',duration: 2,opacity:1});
        gsap.to(".home__circle--right", {right: '50%',duration: 2,opacity:1});
    });
    tl.to(".home__circle--left", {
        scrollTrigger: {
            trigger: "body",
            start: () => "0 -" + ( (scrollDuration/sections.length)*0 ),
            end: () => "+=" + ( (scrollDuration/sections.length)*1 ),
            scrub: 1,
        },
        x: 0,
    });
    tl.to(".home__circle--right", {
        scrollTrigger: {
            trigger: "body",
            start: () => "0 -" + ( (scrollDuration/sections.length)*0 ),
            end: () => "+=" + ( (scrollDuration/sections.length)*1 ),
            scrub: 1,
        },
        x: 0,
        ease: "power1.inOut"
    });


    //projects
    let titles3 = gsap.utils.toArray(".projects .content__title > *"),
        tl3 = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: () => "0 -" + ( (scrollDuration/sections.length)*0 ),
                end: () => "+=" + ( (scrollDuration/sections.length)*1 ),
                scrub: 1,
            }
        });

    titles3.forEach((title, index) => {
        if (index % 2 === 0) {
            tl3.from(title, 1, {autoAlpha:0, right:-600, ease:Power1.easeOut}, 0.3*index);
        }  else {
            tl3.from(title, 1, {autoAlpha:0, left:-600, ease:Power1.easeOut}, 0.3*index);
        }
    });



    //awards
    let titles4 = gsap.utils.toArray(".awards .content__title > *"),
        tl4 = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: () => "0 -" + ( (scrollDuration/sections.length)*2 ),
                end: () => "+=" + ( (scrollDuration/sections.length)*1 ),
                scrub: 1,
                markers: true,
            }
        });

    titles4.forEach((title, index) => {
        if (index % 2 === 0) {
            tl4.from(title, 1, {autoAlpha:0, right:-600, ease:Power1.easeOut}, 0.3*index);
        }  else {
            tl4.from(title, 1, {autoAlpha:0, left:-600, ease:Power1.easeOut}, 0.3*index);
        }
    });



    //testimonials
    let titles5 = gsap.utils.toArray(".testimonials .content__title > *"),
        tl5 = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: () => "0 -" + ( (scrollDuration/sections.length)*3 ),
                end: () => "+=" + ( (scrollDuration/sections.length)*1 ),
                scrub: 1,
            }
        });

    titles5.forEach((title, index) => {
        if (index % 2 === 0) {
            tl5.from(title, 1, {autoAlpha:0, right:-600, ease:Power1.easeOut}, 0.3*index);
        }  else {
            tl5.from(title, 1, {autoAlpha:0, left:-600, ease:Power1.easeOut}, 0.3*index);
        }
    });



    //experience
    let titles6 = gsap.utils.toArray(".experience .content__title > *"),
        tl6 = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: () => "0 -" + ( (scrollDuration/sections.length)*4 ),
                end: () => "+=" + ( (scrollDuration/sections.length)*1 ),
                scrub: 1,
            }
        });

    titles6.forEach((title, index) => {
        if (index % 2 === 0) {
            tl6.from(title, 1, {autoAlpha:0, right:-600, ease:Power1.easeOut}, 0.3*index);
        }  else {
            tl6.from(title, 1, {autoAlpha:0, left:-600, ease:Power1.easeOut}, 0.3*index);
        }
    });



    //news
    let titles7 = gsap.utils.toArray(".news .content__title > *"),
        tl7 = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: () => "0 -" + ( (scrollDuration/sections.length)*5 ),
                end: () => "+=" + ( (scrollDuration/sections.length)*1 ),
                scrub: 1,
            }
        });

    titles7.forEach((title, index) => {
        if (index % 2 === 0) {
            tl7.from(title, 1, {autoAlpha:0, right:-600, ease:Power1.easeOut}, 0.3*index);
        }  else {
            tl7.from(title, 1, {autoAlpha:0, left:-600, ease:Power1.easeOut}, 0.3*index);
        }
    });



    //contacts
    let titles8 = gsap.utils.toArray(".contacts .content__title > *"),
        tl8 = gsap.timeline({
            scrollTrigger: {
                trigger: "body",
                start: () => "0 -" + ( (scrollDuration/sections.length)*6 ),
                end: () => "+=" + ( (scrollDuration/sections.length)*1 ),
                scrub: 1,
            }
        });

    titles8.forEach((title, index) => {
        if (index % 2 === 0) {
            tl8.from(title, 1, {autoAlpha:0, right:-600, ease:Power1.easeOut}, 0.3*index);
        }  else {
            tl8.from(title, 1, {autoAlpha:0, left:-600, ease:Power1.easeOut}, 0.3*index);
        }
    });

});

