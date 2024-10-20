const form = document.getElementById('form');
const search = document.getElementById('search');
const result = document.getElementById('result');
const more = document.getElementById('more');

const apiURL = "https://api.lyrics.ovh";

form.addEventListener('submit', e=>{
    e.preventDefault();
    const songtxt=search.value.trim();
    console.log(songtxt);
    if(!songtxt){
        alert("ป้อนข้อมูลไม่ถูกต้อง");
    }
    else{
        searchLyric(songtxt);
    }
});

async function searchLyric(song){
    const res = await fetch(`${apiURL}/suggest/${song}`);
    const allsong = await res.json();
    showData(allsong);
}       
async function getmore(songsURL){
    const res = await fetch(`https://cors-anywhere.herokuapp.com/${songsURL}`);
    const allsong = await res.json();
    showData(allsong);
}

result.addEventListener('click',e=>{
    const clickEL= e.target;
    if(clickEL.tagName == "BUTTON"){
        const artist = clickEL.getAttribute('data-artist')
        const songName = clickEL.getAttribute('data-song')
        getLyrics(artist,songName);
    }
});

function showData(songs) {
    result.innerHTML = `
        <ul class="songs divide-y divide-gray-300">
            ${songs.data.map(song => `
                <li class=" py-4 flex justify-between items-center transition-transform duration-300 hover:bg-gray-100 hover:scale-105 hover:text-indigo-600">
                    <span class="text-lg font-bold text-inherit">
                        ${song.artist.name} - ${song.title}
                    </span>
                    <button class="bg-indigo-500 hover:bg-indigo-600 focus:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-lg btn transition duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                        data-artist="${song.artist.name}"
                        data-song="${song.title}">
                        เนื้อเพลง
                    </button>
                </li>
            `).join('')}
        </ul>
    `;

    if (songs.next || songs.prev) {
        more.innerHTML = `
            <div class="flex justify-between mt-4">
                ${songs.prev ? `<button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105" onclick="getmore('${songs.prev}')">ก่อนหน้า</button>` : ''}
                ${songs.next ? `<button class="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg transition-transform duration-300 transform hover:scale-105" onclick="getmore('${songs.next}')">ถัดไป</button>` : ''}
            </div>
        `;
    } else {
        more.innerHTML = '';
    }
}


async function getLyrics(artist, songName) {
    const res = await fetch(`${apiURL}/v1/${artist}/${songName}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g, "<br>");
    
    if (lyrics) {
        result.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">
                <strong>${artist}</strong> - ${songName}
            </h2>
            <div class="text-lg text-inherit">
                ${lyrics}
            </div>
        `;
    } else {
        result.innerHTML = `
            <h2 class="text-2xl font-bold mb-4">
                <strong>${artist}</strong> - ${songName}
            </h2>
            <div class="text-lg text-inherit">ไม่มีข้อมูลเนื้อเพลง</div>
        `;
    }
    more.innerHTML = '';
}

function showSpinner() {
    document.getElementById('loading-spinner').style.display = 'flex';
}

function hideSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

document.querySelectorAll('button').forEach(function(button) {
    button.addEventListener('click', function() {
        showSpinner();

        setTimeout(function() {
            hideSpinner();
        }, 2000);
    });
});
