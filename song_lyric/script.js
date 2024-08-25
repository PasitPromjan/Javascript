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

function showData(songs){
    result.innerHTML=`
        <ul class = "songs">
            ${songs.data.map(song=>
                `<li>
                    <span>
                        <strong>${song.artist.name}</strong> - ${song.title}
                    </span>
                    <button class="btn" 
                    data-artist="${song.artist.name}"
                    data-song = "${song.title}"
                    >เนื้อเพลง</button>
                </li>`
            ).join("")}
        </ul>
    `;
    if(songs.next || songs.prev){
        more.innerHTML=`
        ${songs.prev? `<button class="btn" onclick="getmore('${songs.prev}')">ก่อนหน้า</button>` : '' } 
        ${songs.next? `<button class="btn" onclick="getmore('${songs.next}')">ถัดไป</button>` : '' }    
        `
    }
    else{
        more.innerHTML="";
    }
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

async function getLyrics(artist,songName){
    const res = await fetch(`${apiURL}/v1/${artist}/${songName}`);
    const data = await res.json();
    const lyrics = data.lyrics.replace(/(\r\n|\r|\n)/g,"<br>");
    if(lyrics){
        result.innerHTML = `<h2><span>
                                <strong>${artist}</strong> - ${songName}
                            </span></h2>
                            <span>${lyrics}</span>`;
    }
    else{
        result.innerHTML = `<h2><span>
        <strong>${artist}</strong> - ${songName}
        </span></h2>
        <span>ไม่มีข้อมูลเนื้อเพลง</span>`;
    }
    more.innerHTML="";
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
