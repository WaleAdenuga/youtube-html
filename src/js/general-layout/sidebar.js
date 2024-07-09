import { returnSVGS } from "./imports.js";

export function renderSidebar() {
  const svgs = returnSVGS();
  
  let sidebarHTML = 
   `
    
    <div class="sidebar-link js-sidebar-home">
      <img src="${svgs['home.svg']}">
      <div>Home</div>
    </div>
    <div class="sidebar-link">
      <img src="${svgs['explore.svg']}">
      <div>Explore</div>
    </div>
    <div class="sidebar-link">
      <img src="${svgs['subscriptions.svg']}">
      <div>Subscriptions</div>
    </div>
    <div class="sidebar-link">
      <img src="${svgs['originals.svg']}">
      <div>Originals</div>
    </div>
    <div class="sidebar-link">
      <img src="${svgs['youtube-music.svg']}">
      <div>Youtube Music</div>
    </div>
    <div class="sidebar-link">
      <img src="${svgs['library.svg']}">
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