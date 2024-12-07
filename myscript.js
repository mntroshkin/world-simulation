class Subpage {
  constructor(id, name, content, parent=null) {
    this.id = id;
    this.name = name;
    this.contentWindow = document.createElement("div");
    this.contentWindow.innerHTML = content;
    this.parent = parent;

    this.path = parent ? parent.path + this.id + "/" : this.id + "/";
  }
}

class Tab {
  constructor(subpage, tabManager) {
    this.tabManager = tabManager;

    this.subpage = subpage;
    this.tabContainer = document.createElement("div");
    this.tabContainer.classList.add("tab");

    this.tabNameEntry = document.createElement("div");
    this.tabNameEntry.classList.add("tab-name");
    this.tabContainer.insertBefore(this.tabNameEntry, null);

    this.closeButton = document.createElement("button");
    this.closeButton.classList.add("close-button");
    this.closeButton.textContent = "×";
    this.tabContainer.insertBefore(this.closeButton, null);

    this.tabNameEntry.addEventListener('click', () => {this.tabManager.switchTo(this)});
    this.closeButton.addEventListener('click', () => {this.tabManager.closeTab(this)});

    this.updateTab();
  }

  updateTab() {
    this.tabNameEntry.textContent = this.subpage.name;
  }
}

class TabManager {
  constructor(tabWrapper) {
    this.tabWrapper = tabWrapper;
    this.openedTabs = [];
    this.activeTab = null;
  }

  renderActiveTab() {
    const goUpLink = document.getElementById("go-up-link");
    const rightSection = document.getElementById("right-section");
    const statusBar = document.getElementById("status-bar");

    if (this.activeTab.subpage.parent) {
      goUpLink.classList.remove("hidden");
    }
    else {
      goUpLink.classList.add("hidden");
    }

    const currentTabContent = rightSection.firstChild;
    if (currentTabContent) {rightSection.removeChild(currentTabContent);}
    rightSection.insertBefore(this.activeTab.subpage.contentWindow, null);
    statusBar.textContent = this.activeTab.subpage.path;
  }

  openInActiveTab(subpage) {
    if (!this.activeTab) {this.openInNewTab(subpage);}
    else {
      this.activeTab.subpage = subpage;
      this.activeTab.updateTab();
      this.renderActiveTab()
      updateScrollVisibility();
    }
  }

  openInNewTab(subpage) {
    const newTab = new Tab(subpage, this);
    this.openedTabs.push(newTab);
    this.tabWrapper.insertBefore(newTab.tabContainer, null);
    this.switchTo(newTab);
    updateScrollVisibility();
  }

  closeTab(tab) {
    this.tabWrapper.removeChild(tab.tabContainer);

    const index = this.openedTabs.indexOf(tab);
    this.openedTabs = this.openedTabs.slice(0, index).concat(this.openedTabs.slice(index + 1));

    if (tab == this.activeTab) {
      const newActiveTab = (index < this.openedTabs.length) ? this.openedTabs[index] : this.openedTabs[index - 1];
      this.switchTo(newActiveTab);
    }
    updateScrollVisibility();
  }

  switchTo(tab) {
    if (this.activeTab) {this.activeTab.tabContainer.classList.remove("active");}
    this.activeTab = tab;
    tab.tabContainer.classList.add("active");
    this.renderActiveTab();
  }

  goUp() {
    if (this.activeTab.subpage.parent) {
      this.openInActiveTab(this.activeTab.subpage.parent);
    }
  }
}

function openChild(tabManager, subpage, index) {
  const childPage = new Subpage(`${subpage.id}.${index}`, `${subpage.name}.${index}`, `Hello, this is ${subpage.name}.${index}`, subpage);
  generateChildLinks(tabManager, childPage);
  tabManager.openInActiveTab(childPage);
}

function generateChildLinks(tabManager, subpage) {
  for (let i = 1; i <= 3; i++) {
    childLink = document.createElement("div");
    childLink.classList.add("link");
    childLink.textContent = `Open child #${i}`;
    childLink.addEventListener('click', () => {
      openChild(tabManager, subpage, i);
    })
    subpage.contentWindow.insertBefore(childLink, null);
  }
}

function updateScrollVisibility() {
  const maxScrollLeft = tabWrapper.scrollWidth - tabWrapper.clientWidth;
  scrollLeftButton.style.display = wrapperScroll > 0 ? 'flex' : 'none';
  scrollRightButton.style.display = wrapperScroll < maxScrollLeft ? 'flex' : 'none';
}

const tabWrapper = document.getElementById("tab-wrapper");
const tabManager = new TabManager(tabWrapper);

const scrollAmount = 100;
let wrapperScroll = 0;
const scrollLeftButton = document.getElementById('scroll-left');
const scrollRightButton = document.getElementById('scroll-right');

const goUpLink = document.getElementById("go-up-link");
goUpLink.addEventListener('click', () => {tabManager.goUp()});


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


mainPage = new Subpage("main", "Main Tab", "Hello, this is the main tab");
generateChildLinks(tabManager, mainPage);
tabManager.openInNewTab(mainPage);

let counter = 1;
const newTabLink = document.getElementById("new-tab-link");
newTabLink.addEventListener('click', () => {
  counter += 1;
  let newPage = new Subpage(`tab${counter}`, `Tab #${counter}`, `Hello, this is Tab #${counter}\n`);
  generateChildLinks(tabManager, newPage);
  tabManager.openInNewTab(newPage);
});