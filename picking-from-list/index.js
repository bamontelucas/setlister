var workbook;
var jstable_musics;
var jstable_setlist;
var saved_setlist;

const headings = [
    'Artista',
    'Música',
    'Tempo',
    'Afinação'
];

const format_time = time_value => {
    let seconds = parseInt(parseFloat(time_value) * 86400);
    let minutes = Math.floor(seconds / 60);
    seconds = seconds % (minutes * 60);            
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

const build_js_table = rebuild => {
    if (rebuild) {
        let musics_html = document.getElementById('musics').outerHTML;
        let setlist_html = document.getElementById('setlist').outerHTML;
        let container = document.getElementById('container');
        container.innerHTML = '';
        container.insertAdjacentHTML('afterbegin', musics_html);
        container.insertAdjacentHTML('beforeend', setlist_html);
    }

    jstable_musics = new JSTable("#musics", {
        perPage: 9999,
        perPageSelect: false
    });
    jstable_setlist = new JSTable("#setlist", {
        perPage: 9999,
        perPageSelect: false
    });

    new RowSorter('#setlist');

    jstable_musics.table.body.addEventListener('dblclick', add_music);
    jstable_setlist.table.body.addEventListener('dblclick', remove_music);
}

const add_music = e => {
    let msg = jstable_setlist.table.element.querySelector('tbody .dt-message');
    if(msg) {
        msg = msg.parentNode;
        msg.parentNode.removeChild(msg);
    } 

    let el = e.target;
    while(el.nodeName !== 'TR') {
        el = el.parentElement;
    }

    jstable_setlist.table.element.querySelector('tbody').insertAdjacentElement('beforeend', el);
    build_js_table(true);
}

const remove_music = e => {
    let el = e.target;
    while(el.nodeName !== 'TR') {
        el = el.parentElement;
    }

    jstable_musics.table.element.querySelector('tbody').insertAdjacentElement('beforeend', el);
    build_js_table(true);
}

const render_cell = (music, prop) => `<td>${music[prop] ? (prop.toUpperCase() === 'TEMPO' ? format_time(music[prop]) : music[prop]) : ''}</td>`;

const render_row = music => `<tr>${headings.map(prop => render_cell(music, prop)).join('')}</tr>`;

const render_sheet = () => {
    const sheet = workbook.Sheets[workbook.Props.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet).filter(music => music['Tirei']);
    
    const thead = `<tr>${headings.map(th => `<th>${th}</th>`).join('')}</tr>`;
    const tbody = data.map(render_row).join('');

    document.querySelector('#container').insertAdjacentHTML('afterbegin', `
    <table id="musics">
        <thead>${thead}</thead>
        <tbody>${tbody}</tbody>
    </table>
    <table id="setlist">
        <thead>${thead}</thead>
        <tbody></tbody>
    </table>
    `);
    build_js_table(false);
}

const load_sheet = async e => {
    const file = e.target.files[0];
    const data = await file.arrayBuffer();
    workbook = XLSX.read(data);
    render_sheet();
}

const submit = () => {
    let setlist = [...jstable_setlist.table.body.querySelectorAll('tr')].map(tr => {
        let cells = [...tr.querySelectorAll('td')];
        let obj = {};
        
        obj.artist = cells[0].textContent;
        obj.title = cells[1].textContent;
        switch(cells[3].textContent) {
            case "DROP D":
                obj.obs = "DROP D";
                break;
            case "Standard Eb":
                obj.obs = "Meio tom";
                break;
            default:
        }
        return obj;
    });
    let data = {
        "date": "16/07/2022",
        "local": "Divina Cecília",
        "setlist": setlist
    }
    localStorage.setItem(']', JSON.stringify(data));
    window.location.href = "setlist.html";
}

document.getElementById('setlist-file').addEventListener('change', load_sheet);
document.getElementById('submit').addEventListener('click', submit);

saved_setlist = localStorage.getItem('setlist');
if(saved_setlist) {
    saved_setlist = JSON.parse(saved_setlist);
    document.querySelector('#show-date').value = saved_setlist.date;
    document.querySelector('#show-local').value = saved_setlist.local;
}

