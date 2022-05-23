// SERVICES VARS
const services = [
  {
    name: "Seafile",
    url: "https://seafile.sbond.co"
  },
  {
    name: "Jellyfin",
    url: "https://jelly.sbond.co",
    icon: "jellyfin"
  },
  {
    name: "Mcfin",
    url: "https://jelly.sbond.co"
  },
  {
    name: "Donkyfin",
    url: "https://jelly.sbond.co"
  }
];

function searchBarInit() {
  const sBar = document.getElementById("search");

  sBar.addEventListener("keyup", (ev) => {
    const serviceSearch = sBar.value.startsWith("/");

    if (ev.key === "Enter" && !serviceSearch) {
      console.log("enter", ev);
      window.open("hello");
    }

    if (serviceSearch) {
      searchServices(sBar.value);
    }
  });
}

// Set welcome msg (hello)
function setWelcomeMsg() {
  const el = document.getElementById("welcomeMsg");
  const hour = new Date().getHours();
  let msg = "What time is it?";

  if (hour >= 0 && hour <= 5) msg = "You're up late!";
  else if (hour >= 5 && hour <= 12) msg = "Good Morning!";
  else if (hour >= 12 && hour <= 17) msg = "Good Afternoon!";
  else if (hour >= 17 && hour <= 21) msg = "Good Evening!";
  else if (hour >= 21 && hour <= 24) msg = "Another great day!";

  el.innerHTML = msg;
}

// Add services
function addServices() {
  const cSrvs = document.getElementsByClassName("services")[0];

  services.forEach((s) => {
    cSrvs.insertAdjacentHTML(
      "beforeend",
      `
        <a href="${s.url}" class="upOnHover">
          <i class="si si-${s.icon}"></i>
          <p>${s.name}</p>
        </a>
      `
    );
  });
}

searchBarInit();
setWelcomeMsg();
addServices();
