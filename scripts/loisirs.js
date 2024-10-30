const scrollContainer = document.getElementById('scroll-container');
let currentSection = 0;

function scrollToSection(section) {
    scrollContainer.children[section].scrollIntoView({ behavior: 'smooth' });
}

let isScrolling = false;
let startY = 0;

window.addEventListener('wheel', (event) => {
    if (isScrolling) return;
    isScrolling = true;

    if (event.deltaY > 0) {
        currentSection = Math.min(currentSection + 1, scrollContainer.children.length - 1);
    } else {
        currentSection = Math.max(currentSection - 1, 0);
    }

    scrollToSection(currentSection);

    setTimeout(() => {
        isScrolling = false;
    }, 300);
});

window.addEventListener('touchstart', (event) => {
    startY = event.touches[0].clientY;
});

window.addEventListener('touchmove', (event) => {
    if (isScrolling) return;
    isScrolling = true;

    const currentY = event.touches[0].clientY;
    const deltaY = currentY - startY;

    if (deltaY > 0) {
        currentSection = Math.min(currentSection + 1, scrollContainer.children.length - 1);
    } else {
        currentSection = Math.max(currentSection - 1, 0);
    }

    scrollToSection(currentSection);

    setTimeout(() => {
        isScrolling = false;
    }, 300);

    startY = currentY;
});
