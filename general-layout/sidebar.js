export function renderSidebar() {

  let sidebarHTML = 
   `
    
    <div class="sidebar-link js-sidebar-home">
      <img src="icons/home.svg">
      <div>Home</div>
    </div>
    <div class="sidebar-link">
      <img src="icons/explore.svg">
      <div>Explore</div>
    </div>
    <div class="sidebar-link">
      <img src="icons/subscriptions.svg">
      <div>Subscriptions</div>
    </div>
    <div class="sidebar-link">
      <img src="icons/originals.svg">
      <div>Originals</div>
    </div>
    <div class="sidebar-link">
      <img src="icons/youtube-music.svg">
      <div>Youtube Music</div>
    </div>
    <div class="sidebar-link">
      <img src="icons/library.svg">
      <div>Library</div>
    </div>
    
  `;

  const sidebarElement = document.querySelector('.js-sidebar');
  sidebarElement.innerHTML = sidebarHTML;

  const homeSidebar = document.querySelector('.js-sidebar-home');
  homeSidebar.addEventListener('click', () => {
    window.location.href = 'youtube.html';
  });
}