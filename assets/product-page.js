function initProductPage() {
    const container = document.querySelector('.product-page-container');
    if (!container) {
        return;
    }

    const swiperWrapper = document.querySelector('.product-gallery-swiper .swiper-wrapper');
    const allSlides = Array.from(swiperWrapper.querySelectorAll('.swiper-slide'));

    const swiperConfig = {
        loop: true,
        slidesPerView: parseInt(container.dataset.slidesPerViewMobile, 10),
        spaceBetween: parseInt(container.dataset.spaceBetweenMobile, 10),
        breakpoints: {
            768: {
                slidesPerView: parseInt(container.dataset.slidesPerViewTablet, 10),
                spaceBetween: parseInt(container.dataset.spaceBetweenTablet, 10)
            },
            1024: {
                slidesPerView: parseInt(container.dataset.slidesPerViewDesktop, 10),
                spaceBetween: parseInt(container.dataset.spaceBetweenDesktop, 10)
            }
        }
    };

    if (container.dataset.showPagination === 'true') {
        swiperConfig.pagination = {
            el: '.swiper-pagination',
            clickable: true,
        };
    }

    if (container.dataset.showNavigation === 'true') {
        swiperConfig.navigation = {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        };
    }

    const swiper = new Swiper('.product-gallery-swiper', swiperConfig);
    if (!swiper) return;

    const colorOptionContainer = document.querySelector('.product-option-values[data-option-name="Color"]');

    const filterSlidesByColor = (selectedColor) => {
        const filteredSlides = allSlides.filter(slide => {
            const slideColor = slide.dataset.color;
            return !slideColor || slideColor === '' || slideColor === selectedColor;
        });

        if (swiper.loop) {
            swiper.loopDestroy();
        }
        swiper.removeAllSlides();
        swiper.appendSlide(filteredSlides.map(slide => slide.cloneNode(true)));
        swiper.update();

        if (swiperConfig.loop) {
            swiper.loopCreate();
            swiper.update();
            swiper.slideToLoop(0, 0);
        } else {
            swiper.slideTo(0, 0);
        }
    };

    if (colorOptionContainer) {
        colorOptionContainer.addEventListener('click', function (event) {
            const swatch = event.target.closest('.color-swatch');
            if (!swatch) return;

            const selectedValue = swatch.dataset.value;
            const selectedColor = selectedValue.toLowerCase();

            colorOptionContainer.querySelectorAll('.color-swatch').forEach(s => s.classList.remove('selected'));
            swatch.classList.add('selected');

            const optionGroup = swatch.closest('.product-option-group');
            if (optionGroup) {
                const valueDisplay = optionGroup.querySelector('.selected-option-value');
                if (valueDisplay) {
                    valueDisplay.textContent = selectedValue;
                }
            }

            filterSlidesByColor(selectedColor);
        });

        const initialSelectedSwatch = colorOptionContainer.querySelector('.color-swatch.selected');
        if (initialSelectedSwatch) {
            const initialSelectedColor = initialSelectedSwatch.dataset.value.toLowerCase();
            filterSlidesByColor(initialSelectedColor);
        }
    }
}


class ProductAccordion extends HTMLElement {
    constructor() {
        super();
        this.allowMultiple = this.dataset.allowMultiple === 'true';
        this.buttons = this.querySelectorAll('.accordion-title');
        this.contents = this.querySelectorAll('.accordion-content');
    }

    connectedCallback() {
        this.buttons.forEach((button, index) => {
            button.addEventListener('click', () => this.toggle(index));
        });
    }

    toggle(selectedIndex) {
        const isExpanded = this.buttons[selectedIndex].getAttribute('aria-expanded') === 'true';

        if (!this.allowMultiple) {
            this.buttons.forEach((button, index) => {
                if (index !== selectedIndex) {
                    button.setAttribute('aria-expanded', 'false');
                    this.contents[index].hidden = true;
                }
            });
        }

        this.buttons[selectedIndex].setAttribute('aria-expanded', !isExpanded);
        this.contents[selectedIndex].hidden = isExpanded;
    }
}

if (!customElements.get('product-accordion')) {
    customElements.define('product-accordion', ProductAccordion);
}
initProductPage();
