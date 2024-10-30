const scrollContainer = document.getElementById('scroll-container');
let currentSection = 0;

function scrollToSection(section) {
    scrollContainer.children[section].scrollIntoView({ behavior: 'smooth' });
}
let isScrolling = false;

window.addEventListener('wheel', (event) => {
    if (isScrolling) return;
    isScrolling = true;

    console.log(isScrolling)

    if (event.deltaY > 0) {
        currentSection = Math.min(currentSection + 1, scrollContainer.children.length - 1);
    } else {
        currentSection = Math.max(currentSection - 1, 0);
    }

    console.log(currentSection)
    scrollToSection(currentSection);

    setTimeout(() => {
        isScrolling = false;
    }, 300);
});
