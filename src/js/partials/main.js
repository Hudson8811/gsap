window.onbeforeunload = function () {
    window.scrollTo(0, 0);
}

$(function() {
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
                end: "+=5000",
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



});

