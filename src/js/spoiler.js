// spoiler
const spoilers = document.querySelectorAll('[data-spoilers]');

if (spoilers.length > 0) {
    const spoilersReg = Array.from(spoilers).filter(function (item) {
        return !item.dataset.spoilers.split(",")[0];
    });

    if (spoilersReg.length > 0) {
        initSpoilers(spoilersReg);
    }

    const spoilersMd = Array.from(spoilers).filter(function (item) {
        return item.dataset.spoilers.split(",")[0];
    });

    if (spoilersMd.length > 0) {
        const breakpoints = [];
        spoilersMd.forEach(item => {
            const paramsData = item.dataset.spoilers;
            const breakpoint = {};
            const params = paramsData.split(',');
            breakpoint.value = params[0];
            breakpoint.type = params[1] ? params[1].trim() : "max";
            breakpoint.item = item;
            breakpoints.push(breakpoint);
        });

        let mediaQueries = breakpoints.map(function (item) {
            return '(' + item.type + "-width: " + item.value + "px)," + item.value + ',' + item.type;
        });
        mediaQueries = mediaQueries.filter(function (item, index, self) {
            return self.indexOf(item) === index;
        });

        mediaQueries.forEach(bp => {
            const params = bp.split(',');
            const mdBp = params[1];
            const mdType = params[2];
            const matchMd = window.matchMedia(params[0]);

            const spoilersArr = breakpoints.filter(function (item) {
                if (item.value === mdBp && item.type === mdType) {
                    return true;
                }
            });

            matchMd.addEventListener('change', function () {
                initSpoilers(spoilersArr, matchMd);
            });
            initSpoilers(spoilersArr, matchMd);
        });
    }

    function initSpoilers(spoilersArr, matchMd = false) {
        spoilersArr.forEach(spoilersBlock => {
            spoilersBlock = matchMd ? spoilersBlock.item : spoilersBlock;
            if (matchMd.matches || !matchMd) {
                spoilersBlock.classList.add('_init');
                initSpoilerBody(spoilersBlock);
                spoilersBlock.addEventListener("click", setSpoilerAction);
            } else {
                spoilersBlock.classList.remove('_init');
                initSpoilerBody(spoilersBlock, false);
                spoilersBlock.removeEventListener("click", setSpoilerAction);
            }
        });
    }

    function initSpoilerBody(spoilersBlock, hideSpoilerBody = true) {
        const spoilerTitles = spoilersBlock.querySelectorAll('[data-spoiler]');
        if (spoilerTitles.length > 0) {
            spoilerTitles.forEach(spoilerTitle => {
                if (hideSpoilerBody) {
                    spoilerTitle.removeAttribute('tabindex');
                    if (!spoilerTitle.classList.contains('_active')) {
                        spoilerTitle.nextElementSibling.hidden = true;
                    }
                } else {
                    spoilerTitle.setAttribute('tabindex', '-1');
                    spoilerTitle.nextElementSibling.hidden = false;
                }
            });
        }
    }

    function setSpoilerAction(e) {
        const el = e.target;
        if (el.hasAttribute('data-spoiler') || el.closest('[data-spoiler]')) {
            const spoilerTitle = el.hasAttribute('data-spoiler') ? el : el.closest('[data-spoiler]');
            const spoilersBlock = spoilerTitle.closest('[data-spoilers]');
            const oneSpoiler = spoilersBlock.hasAttribute('data-one-spoiler') ? true : false;
            if (!spoilersBlock.querySelectorAll('._slide').length) {
                if (oneSpoiler && !spoilerTitle.classList.contains('_active')) {
                    hideSpoilerBody(spoilersBlock);
                }
                spoilerTitle.classList.toggle('_active');
                _slideToggle(spoilerTitle.nextElementSibling, 500);
            }
            e.preventDefault();
        }
    }

    function hideSpoilerBody(spoilersBlock) {
        const spoilerActiveTitle = spoilersBlock.querySelector('[data-spoiler]._active');
        if (spoilerActiveTitle) {
            spoilerActiveTitle.classList.remove('_active');
            _slideUp(spoilerActiveTitle.nextElementSibling, 500);
        }
    }
}

// slideToggle
let _slideUp = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = target.offsetHeight + 'px';
        target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        window.setTimeout(() => {
            target.hidden = true;
            target.style.removeProperty('height');
            target.style.removeProperty('padding-top');
            target.style.removeProperty('padding-bottom');
            target.style.removeProperty('margin-top');
            target.style.removeProperty('margin-bottom');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}
let _slideDown = (target, duration = 500) => {
    if (!target.classList.contains('_slide')) {
        target.classList.add('_slide');
        if (target.hidden) {
            target.hidden = false;
        }
        let height = target.offsetHeight;
        target.style.overflow = 'hidden';
        target.style.height = 0;
        target.style.paddingTop = 0;
        target.style.paddingBottom = 0;
        target.style.marginTop = 0;
        target.style.marginBottom = 0;
        target.offsetHeight;
        target.style.transitionProperty = 'height, margin, padding';
        target.style.transitionDuration = duration + 'ms';
        target.style.height = height + 'px';
        target.style.removeProperty('padding-top');
        target.style.removeProperty('padding-bottom');
        target.style.removeProperty('margin-top');
        target.style.removeProperty('margin-bottom');
        window.setTimeout(() => {
            target.style.removeProperty('height');
            target.style.removeProperty('overflow');
            target.style.removeProperty('transition-duration');
            target.style.removeProperty('transition-property');
            target.classList.remove('_slide');
        }, duration);
    }
}
let _slideToggle = (target, duration = 500) => {
    if (target.hidden) {
        return _slideDown(target, duration);
    } else {
        return _slideUp(target, duration);
    }
}