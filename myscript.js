const tabs = document.querySelectorAll('.tab');
const tabContent = document.querySelectorAll('.tab-panel');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const targetTab = document.getElementById(tab.dataset.tab);

    tabs.forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Hide all tab panels
    tabContent.forEach(panel => {
      panel.classList.remove('active');
    });

    tab.classList.add('active')

    // Show the clicked tab panel
    targetTab.classList.add('active');
  });
});