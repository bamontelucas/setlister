const getSetlist = async () => {
    let req = await fetch('setlist.json');
    let json = await req.json();
    return json;
}

const logSetList = setlist => {
    console.log(setlist.map((music, idx) => (idx+1) + '. ' + music.title.toUpperCase()).join('\n'));
    
}

const setHeader = headerText => {
    document.querySelector('header').textContent = headerText;
    document.title = headerText
}

const main = async () => {
    let data = await getSetlist();

    logSetList(data.setlist);

    setHeader(`${data.local} - ${data.date}`);

    let container = document.getElementById('container');
    container.innerHTML = '';
    container.insertAdjacentHTML('beforeend', `
        <div class="header">#</div>
        <div class="header">Artista</div>
        <div class="header">Música</div>
        <div class="header">OBS</div>
    `);

    let musics = data.setlist.map((music, idx) => `
        <div ${music.color ? `style="border-color:${music.color};" ` : ''}class="no">${idx+1}</div>
        <div ${music.color ? `style="border-color:${music.color};" ` : ''}class="artist">${music.artist}</div>
        <div ${music.color ? `style="border-color:${music.color};" ` : ''}class="title">${music.title}</div>
        <div ${music.color ? `style="border-color:${music.color}; color:${music.color};" ` : ''}class="obs">${music.obs || ''}</div>
    `).join('');

    container.insertAdjacentHTML('beforeend', musics);

    if(data.extra) {
        container.insertAdjacentHTML('beforeend', '<div style="grid-column: 1 / span 4; text-align: center;">extras</div>');    
        let extra = data.extra.map((music, idx) => `
        <div ${music.color ? `style="border-color:${music.color};" ` : ''}class="no extra">${idx+1}</div>
        <div ${music.color ? `style="border-color:${music.color};" ` : ''}class="artist extra" >${music.artist}</div>
        <div ${music.color ? `style="border-color:${music.color};" ` : ''}class="title extra">${music.title}</div>
        <div ${music.color ? `style="border-color:${music.color}; color:${music.color};" ` : ''}class="obs extra">${music.obs || ''}</div>
`).join('');
        container.insertAdjacentHTML('beforeend', extra);
    }
}