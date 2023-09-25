import * as functions from "./modules/webp.js";
import { useDynamicAdapt } from "./modules/dynamicAdapt.js";

functions.isWebp();

useDynamicAdapt();

window.onload = function () {
    document.addEventListener('click', documentActions);

    // Actions
    function documentActions(e) {
        const targetElement = e.target;

        if (targetElement.classList.contains('estate-search__button')) {
            const btns = targetElement.parentNode.children;
            for (const b of btns) {
                b.classList.remove('estate-search__button_active');
            }
            targetElement.classList.add('estate-search__button_active');
        }
    }
}