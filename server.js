const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 3000;

const indexPath = path.join(__dirname, 'index.html');
const filesPath = path.join(__dirname, 'files');

app.get('/', (req, res) => {
    res.sendFile(indexPath);
});


app.get('/api/md', (req, res) => {
    fs.readdir(filesPath, (err, files) => {
        if (err) {
            res.status(500).send({ error: 'Unable to read the directory.' });
        } else {
            const mdFiles = files.filter(filename => filename.endsWith('.md'));
            res.json({ files: mdFiles });
        }
    });
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
app.get('/kepek/:filename', (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(__dirname, 'Kepek', filename);

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).send({ error: 'A képfájl nem található.' });
        }
    });
});

app.get('/api/files/:category', (req, res) => {
    const category = req.params.category;
    const categoryPath = path.join(filesPath, category);

    fs.readdir(categoryPath, (err, files) => {
        if (err) {
            res.status(500).send({ error: `Unable to read the directory for ${category}.` });
        } else {
            const fileList = files.map(file => ({ name: file }));
            res.json({ files: fileList });
        }
    });
});


app.get('/api/files/:category/:filename', (req, res) => {
    const category = req.params.category;
    const filename = req.params.filename;
    const filePath = path.join(filesPath, category, filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            res.status(500).send({ error: 'Unable to read the file.' });
        } else {
            res.send(data);
        }
    });
});

app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen.`);
});
