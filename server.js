const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const indexPath = path.join(__dirname, 'index.html');
const filesPath = path.join(__dirname, 'files');

// Kinyeri az összes mappát a 'files' könyvtárból
const getDirectories = (dirPath) => {
    return fs.readdirSync(dirPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory() && ['Tortenelem', 'Irodalom', 'Nyelvtan'].includes(dirent.name))
        .map(dirent => dirent.name);
}
app.get('/', (req, res) => {
    res.sendFile(indexPath);
});



app.get('/api/md/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(filesPath, filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: 'Unable to read the file.' });
        } else {
            const lines = data.split('\n');
            if (lines.length > 0 && lines[0].trim() !== '') {
                lines[0] = `<h1>${lines[0]}</h1>`;
            }
            const formattedLines = lines.map(line => line.trim() !== '' ? `<p>${line}</p>` : '').join('');
            res.send(formattedLines);
        }
    });
});
app.use('/files', express.static(filesPath));
app.get('/kepek/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'Kepek', filename);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).send({ error: 'A képfájl nem található.' });
        }
    });
});
app.get('/api/files/:folder', (req, res) => {
    const folder = req.params.folder;
    const folderPath = path.join(filesPath, folder);

    fs.readdir(folderPath, (err, files) => {
        if (err) {
            res.status(500).send({ error: 'Unable to read the directory.' });
        } else {
            const fullFilesPath = files.map(file => path.join(folder, file));
            res.json({ files: fullFilesPath });
        }
    });
});

app.get('/api/files', (_req, res) => {
    // Használjuk a korábban definiált getDirectories függvényt
    const directories = getDirectories(filesPath);
    res.json({ directories });
});

app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen.`);
});
