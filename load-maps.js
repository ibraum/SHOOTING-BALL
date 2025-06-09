const maps = document.getElementById('maps');
const body = document.querySelector('body');

body.style.backgroundImage = localStorage.getItem('map') ? `url("./assets/levels/${localStorage.getItem('map')}")` : `url("./assets/levels/l9.jpg")`;

for (i = 1; i < 13; i ++)
{
    maps.innerHTML += ` <button class="map-button" onclick="changemap('l${i}.jpg')">
                            <div class="map">
                                <img src="assets/levels/l${i}.jpg" alt="">
                            </div>
                        </button>`;
}

function changemap(mapName) {
    localStorage.setItem('map', mapName);
    body.style.backgroundAttachment = "fixed";
    body.style.backgroundPosition = "center";
    body.style.backgroundSize = "cover";
    body.style.backgroundImage = localStorage.getItem('map') ? `url("./assets/levels/${localStorage.getItem('map')}")` : `url("./assets/levels/${mapName}")`;
}