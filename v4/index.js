const getSetlist = async () => {
    let req = await fetch('setlist.xlsx');
    let ab = await req.arrayBuffer();
    let xl = XLSX.read(ab);
    console.log(xl);
    let sheet = xl.SheetNames[0];
    let data = {};
    data.local = sheet.split('-')[0].trim();
    data.date = sheet.split('-')[1].trim().replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3')
    let musics = XLSX.utils.sheet_to_json(xl.Sheets[sheet]);
    data.setlist = musics.reduce((setlist, music) => {
        if(music.extra) {
            if (!data.extra) {
                data.extra = [];
            }
            data.extra.push(music);
        } else {
            setlist.push(music);
        }
        return setlist;
    }, []);
    return data;
}

const logSetList = (setlist, extra) => {
    let musics = setlist.map((music, idx) => (idx+1) + '. ' + music.title.toUpperCase());
    if(extra) {
        musics.push('----- EXTRAS -----');
        musics.push(...extra.map((music, idx) => (idx+1) + '. ' + music.title.toUpperCase()));    
    }
    console.log(musics.join('\n'));
}

const setHeader = headerText => {
    document.querySelector('header').textContent = headerText;
    document.title = headerText
}

const main = async () => {
    let data = await getSetlist();
    console.log(data);

    logSetList(data.setlist, data.extra);

    setHeader(`${data.local} - ${data.date}`);

    let container = document.getElementById('container');

    let idx = 0;

    let musics = data.setlist.map(music => music.title ? `    
        <div ${music.color ? `style="border-color:${music.color};" ` : ''}class="row">
            <div class="no">${++idx}</div>
            <div class="artist">${music.artist ? music.artist: '<div style="height: 4em"></div>'}</div>
            <div class="title">${music.title}</div>
            <div ${music.color ? `style="color:${music.color};" ` : ''}class="obs">${music.obs || ''}</div>
        </div>
    ` : `<div class="separator">${music.artist}</div>`).join('');

    container.insertAdjacentHTML('beforeend', musics);

    if(data.extra) {
        container.insertAdjacentHTML('beforeend', '<div class="extra-separator">extras</div>');
        let extra = data.extra.map((music, idx) => `
        <div ${music.color ? `style="border-color:${music.color};" ` : ''}class="extra">
            <div class="no"></div>
            <div class="artist">${music.artist}</div>
            <div class="title">${music.title}</div>
            <div ${music.color ? `style="color:${music.color};" ` : ''}class="obs">${music.obs || ''}</div>
        </div>
        `).join('');
        container.insertAdjacentHTML('beforeend', extra);
    }
}