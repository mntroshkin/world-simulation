function renderActiveTab() {
  const rightSection = document.getElementById("right-section");
  rightSection.innerHTML = activeTab.tab_content;
}


class Tab {
  constructor(tab_id, tab_name, tab_content, closable=true) {
    this.tab_id = tab_id;
    this.tab_name = tab_name;
    this.tab_content = tab_content;

    this.tabContainer = document.createElement("div");
    this.tabContainer.classList.add("tab");

    this.tabNameEntry = document.createElement("div");
    this.tabNameEntry.classList.add("tab-name");
    this.tabNameEntry.textContent = this.tab_name;
    this.tabContainer.insertBefore(this.tabNameEntry, null);

    this.tabNameEntry.addEventListener('click', () => {this.makeActive()});

    if (closable) {
      const closeButton = document.createElement("button");
      closeButton.classList.add("close-button");
      closeButton.textContent = "×";
      closeButton.addEventListener('click', () => {this.close()});
      this.tabContainer.insertBefore(closeButton, null);
    }

    openedTabs.push(this);
    this.makeActive();
    tabWrapper.insertBefore(this.tabContainer, null);

    updateScrollVisibility();
  }

  makeActive() {
    if (activeTab) { activeTab.tabContainer.classList.remove("active"); }
    this.tabContainer.classList.add("active");
    activeTab = this;
    renderActiveTab();
  }

  close() {
    this.tabContainer.classList.add("hidden");

    if (this == activeTab) {
      const newActiveTab = (index < openedTabs.length) ? openedTabs[index] : openedTabs[index - 1];
      newActiveTab.makeActive();
    }

    updateScrollVisibility();
  }
}

const tabWrapper = document.getElementById("tab-wrapper");
let openedTabs = [];
let activeTab = undefined;

const scrollAmount = 100;
let wrapperScroll = 0;
const scrollLeftButton = document.getElementById('scroll-left');
const scrollRightButton = document.getElementById('scroll-right');

const mainTab = new Tab("main-tab", "Main Tab", "Hello, this is the main tab!", closable=false);

let counter = 1;
const newTabLink = document.getElementById("new-tab-link");
newTabLink.addEventListener('click', () => {
  counter += 1;
  newTab = new Tab(`tab${counter}`, `Tab #${counter}`, `Hello, this is the tab #${counter}!`);
});

function updateScrollVisibility() {
  const maxScrollLeft = tabWrapper.scrollWidth - tabWrapper.clientWidth;
  scrollLeftButton.style.display = wrapperScroll > 0 ? 'flex' : 'none';
  scrollRightButton.style.display = wrapperScroll < maxScrollLeft ? 'flex' : 'none';
}

scrollLeftButton.addEventListener('click', () => {
    wrapperScroll -= scrollAmount;
    tabWrapper.scrollTo({
        left: wrapperScroll,
        behavior: 'smooth'
    });
    updateScrollVisibility();
});

scrollRightButton.addEventListener('click', () => {
    wrapperScroll += scrollAmount;
    tabWrapper.scrollTo({
        left: wrapperScroll,
        behavior: 'smooth'
      });
    updateScrollVisibility();
});

updateScrollVisibility();