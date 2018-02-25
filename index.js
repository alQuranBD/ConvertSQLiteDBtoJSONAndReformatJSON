const sqliteJSON = require('sqlite-json');
const fs = require('fs');
const exporter = sqliteJSON('quran.ar_naskh.db');

exporter.json("SELECT * FROM arabic_text", function (error, json) {
    var json = JSON.parse(json);

    fs.readFile("ayats_ar.json", "utf8", (error, data) => {
        var ayats_ar_without_indopak = JSON.parse(data);

        for (let i = 0; i < ayats_ar_without_indopak.length; i++) {
            if (json[i].sura == ayats_ar_without_indopak[i].sura && json[i].ayah == ayats_ar_without_indopak[i].VerseIDAr) {
                // Rename VerseIDAr to aya
                ayats_ar_without_indopak[i].aya = ayats_ar_without_indopak[i].VerseIDAr;
                delete ayats_ar_without_indopak[i].VerseIDAr;

                // Rename ayat to text
                ayats_ar_without_indopak[i].text = ayats_ar_without_indopak[i].ayat;
                delete ayats_ar_without_indopak[i].ayat;

                // Add indo-pak text
                ayats_ar_without_indopak[i].text_indopak = json[i].text;
            } else {
                console.warn("Warning: Skipping ayat! to avoid this please use Sqlite query to perform best!");
            }

        }

        writeStream = fs.createWriteStream("./output/ayats_ar_with_indopak.json");
        writeStream.write(JSON.stringify(ayats_ar_without_indopak));
        writeStream.end();
    });
});
