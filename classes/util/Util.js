function choice(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function clean(str) {
    return str.replace(/[,."'`\-_]/g, "").trim().toLowerCase();
}

function formatDuration(time) {
    const d = time ? new Date(time) : new Date();
    const h = Math.max(d.getHours() - 1, 0);
    const m = d.getMinutes();
    const s = d.getSeconds();
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

function generate(percentage) {
    return Math.random() * 100 <= percentage;
}

function isSorted(array) {
    for (let i = 0; i < array.length; i ++) {
        if (i < array.length && array[i + 1] < array[i]) {
            return false;
        }
    }
    return true;
}

function possessive(text) {
    return 's' === text[text.length - 1] ? `${ text }'`: `${ text }'s`;
}

function randRange(array) {
    if (array[1] !== 0 && ! array[1]) {
        throw new Error("Invalid Array content");
    }
    return Math.floor(Math.random() * (array[1] - array[0]) + array[0]);
}

function randStat(array) {
    if (! Array.isArray(array)) {
        return array;
    }
    let rand = Math.random() * 100;
    for (let i = 0; i < array.length; i ++) {
        let chances = array[i].chance;

        for (let j = 0; j < i; j ++) {
            chances += array[j].chance;
        }
        if (rand < chances) {
            return array[i].val;
        }
    }
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i --) {

        const randId = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[randId];
        array[randId] = temp;
    }

    return array;
}

function sortArray(array) {
    return array.sort((a, b) => { return a - b });
}

function table(data) {
    if (! Array.isArray(data)) {
        throw new Error("Invalid type");
    }
    const dim = {
        x: Math.max(...data.map(row => row.length)),
        y: data.length,
    };
    const size = {
        w: Math.max(...data.map(row => Math.max(...row.map(cell => cell.length)))),
        h: 1,
    };

    for (let row = 0; row < data.length; row ++) {
        for (let col = 0; col < data[row].length; col ++) {
            data[row][col] = data[row][col].padEnd(size.w, ' ');
        }
    }

    const ledge = Array(size.w + 1).join('─');
    const ledges = [];
    for (let i = 0; i < dim.x; i ++) {
        ledges.push(ledge);
    }

    const fullTable = [];
    fullTable.push(`${'┌'}${ledges.join('┬')}${'┐'}`);
    fullTable.push(`${'│'}${data.shift().join('│')}${'│'}`);
    fullTable.push(`${'├'}${ledges.join('┼')}${'┤'}`);
    for (let i = 0; i < data.length; i ++) {
        fullTable.push(`${'│'}${data[i].join('│')}${'│'}`);
    }
    fullTable.push(`${'└'}${ledges.join('┴')}${'┘'}`);

    return `\`\`\`\n${fullTable.join('\n')}\n\`\`\``;
}

function title(string) {
    return string[0].toUpperCase() + string.slice(1);
}

global.UTIL = {
    choice,
    clean,
    formatDuration,
    generate,
    isSorted,
    possessive,
    randRange,
    randStat,
    shuffle,
    sortArray,
    table,
    title,
};
