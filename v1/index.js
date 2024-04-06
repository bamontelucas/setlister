const setHeights = (docHeight) => {
    let rowCount = document.querySelectorAll('#setlist tbody tr').length;
    let cellHeight = (parseInt(docHeight) / rowCount).toFixed(3);
    let cellHeightUnit = docHeight.replace(/[ 0-9]/g, '');

    document.head.insertAdjacentHTML('beforeend', `<style type="text/css">
        #setlist tbody td {
            height: ${cellHeight}${cellHeightUnit} !important;
        }
    </style>`)
}

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
    let tbody = data.setlist.map((music, idx) => `
        <tr ${music.color ? `style="outline: 1px solid ${music.color};"` : ''}>
            <td class="no">${idx+1}</td>
            <td class="artist">${music.artist}</td>
            <td class="title">${music.title}</td>
            <td ${music.color ? `style="color:${music.color};"` : ''}class="obs">${music.obs || ''}</td>
        </tr>
    `).join('');

    let extra = data.extra ? '<tr><td colspan="4" style="text-align: center">extras</td></tr>' + data.extra.map((music, idx) => `
    <tr class="extra" ${music.color ? `style="outline: 1px solid ${music.color};"` : ''}>
        <td class="no">${idx+1}</td>
        <td class="artist">${music.artist}</td>
        <td class="title">${music.title}</td>
        <td ${music.color ? `style="color:${music.color};"` : ''}class="obs">${music.obs || ''}</td>
    </tr>
`).join('') : '';

    let table = `<table id="setlist">
        <thead>
            <tr>
                <th>#</th>
                <th>Artista</th>
                <th>Música</th>
                <th>OBS</th>
            </tr>
        </thead>
        <tbody>${tbody}${extra}</tbody>
    </table>
    `;

    let container = document.getElementById('container');
    container.innerHTML = '';
    container.insertAdjacentHTML('afterBegin', table);
    setHeights('565mm');
}