import { renderHeader } from "./general-layout/header.js";
import { renderSidebar } from "./general-layout/sidebar.js";

const headerElement = document.querySelector('.js-header');

headerElement.innerHTML = renderHeader();

document.querySelector('.js-sidebar').innerHTML = renderSidebar();