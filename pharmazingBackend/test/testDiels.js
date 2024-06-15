const levenshtein = require('fastest-levenshtein');
const Images = require('../db_manipulations/images');

const germanPlurals = ['en', 'em', 'er', 'es', 'n', 's', 'e']
const cloudfrontUrl = 'https://d1tkh0shzgk02t.cloudfront.net/'
const MARGIN_LEVENST = 0.101;
const MAX_DISTANCE = 3;


const calcDistance = (originArray, target) => {
    //use ; seperator to find synonyms
    const targetSplit = target.split(";")
    let smallestDistance = 99
    for(let i=0; i<targetSplit.length; i++) {
        let tempDistance = calcDistanceWorker(originArray, targetSplit[i]) 
        if(tempDistance<smallestDistance) {
            smallestDistance = tempDistance
        }
    }
    return smallestDistance
}

const calcDistanceWorker = (originArray, target) => {
    let origin = ''
    let ignoreWords = ['der', 'die', 'das', 'ist', 'und', 'es', 'ein', 'eine', 'als', 'bei', 'mit', 'von', 'aus', 'nach', 'zu', 'oder', 'vor', 'weil']
    
    for(let i=0; i<originArray.length; i++) {
        if(ignoreWords.includes(originArray[i])) {
            originArray[i] = '';
            return 99
        }
        origin += originArray[i]
    }
    
    //remove linebreak
    let cleanedOrigin = origin.replace(/\n\d+/g, '');
    cleanedOrigin = cleanedOrigin.replace(/[()\-.*,\s\n]/g, "");
    let cleanedTarget = target.replace(/[()\-.,\s]/g, "");
    let levenshteinDist = levenshtein.distance(cleanedOrigin, cleanedTarget);
    if(levenshteinDist>3) {
        return levenshteinDist
    } else {
        //add different endings to target to see if distance can be smaller
        let smallestDistance = 99
        for(let i=0; i<germanPlurals.length; i++) {
            let tempLevenstein = levenshtein.distance(cleanedOrigin, cleanedTarget+germanPlurals[i]);
            if(tempLevenstein<smallestDistance) {
                smallestDistance = tempLevenstein
            }
        }
        for(let i=0; i<germanPlurals.length; i++) {
            let tempLevenstein = levenshtein.distance(cleanedOrigin+germanPlurals[i], cleanedTarget);
            if(tempLevenstein<smallestDistance) {
                smallestDistance = tempLevenstein
            }
        }
        if(smallestDistance<levenshteinDist) {
            return smallestDistance
        } else {
            return levenshteinDist
        }
    }
}

const customParseURL = (url) => {
    url = url.normalize('NFD');
    url = encodeURI(url)
    return url.replace('#', "%23");
}

const expandSearchWords =(searchWords) => {
    const suffixes = germanPlurals;
    const newWords = [];

    searchWords.forEach(word => {
        suffixes.forEach(suffix => {
            if (word.endsWith(suffix)) {
                // Remove the suffix from the word
                const newWord = word.slice(0, -suffix.length);
                newWords.push(newWord);
            }
        });
    });

    // Combine the original and new words, removing duplicates
    const combinedWords = Array.from(new Set([...searchWords, ...newWords]));
    return combinedWords;
}

const getImages = (element) => {
    let images = []
    if(element.image1.length>0) {
        let caption = ''
        if(element.type === 'physio') {
            caption = element.caption1
        }
        images.push({src: customParseURL(cloudfrontUrl+element.image1), caption: caption})
    }
    if(element.image2.length>0) {
        //only 2 pictures for physio and plants, only caption2 for physio
        if(element.type === 'physio' || element.type === 'plants') {
            let caption = ''
            if(element.type === 'physio') {
                caption = element.caption2
            }
            images.push({src: customParseURL(cloudfrontUrl+element.image2), caption: caption})
        }
    }
    // if(element.image3.length>0) {
    //     let caption = ''
    //     if(element.type === 'physio') {
    //         caption = element.caption3
    //     }
    //     images.push({src: element.image3, caption: caption})
    // }
    return images
}

async function getPartsAndImages(text) {
    let containsLatex = false;
    try {
        containsLatex = text.includes("\\")
    } catch {
    }

    const delimiters = text.match(/[,.:\n*]/g); // Collect all delimiters
    const splitText = text.split(/[,.:\n*]/)//.filter(part => part.trim() !== ''); // Split text by delimiters

    let words = []
    let totalImages = []

    // let textNoPunct = text.replace(/\n\d+/g, '');
    let textNoPunct = text.replace(/[.,:*]/g, "");
    let searchWords = textNoPunct.split(/[\s\n]+/).filter(word => word.length > 3);
    // let searchWords = textNoPunct.split(" ").filter(word => word.length > 3);
    searchWords = expandSearchWords(searchWords)
    const [rows, fieldData] = await Images.getImages(searchWords)
    let rowsMatched = []

    // search if there are matches based on 1 word
    for(let i=0; i<splitText.length; i++) {
        let splitWords = splitText[i].split(" ");
        let tempArray = []
        for(let j=0; j<splitWords.length; j++) {
            let smallestDistance = 999;
            let smallestIdx = -1;
            let idxRows = -1;
            let tempIdx = -1
            for(let k=0; k<rows.length; k++) {
                let distance = calcDistance([splitWords[j].toLowerCase()], rows[k].german.toLowerCase());
                if(distance<smallestDistance) {
                    smallestDistance = distance
                    smallestIdx = k;
                }
            }
            let cid = -1;
            if(!rowsMatched.includes(smallestIdx) && smallestDistance/splitWords[j].length <MARGIN_LEVENST && smallestDistance<MAX_DISTANCE) {
                rowsMatched.push(smallestIdx)
                let tempImages = getImages(rows[smallestIdx])
                if(tempImages.length>0) {
                    tempIdx = totalImages.length;
                    totalImages.push(getImages(rows[smallestIdx]))
                }
                cid = rows[smallestIdx].cid;
                // Remove so only can appear once
                // rows.splice(smallestIdx, 1);
            }
            tempArray.push({word: splitWords[j], idx: tempIdx, cid: cid})
        }
        words.push(tempArray)
    }

    // search if there are matches based on 2 words
    let copyWords = []
    for(let i=0; i<words.length; i++) {
        let tempWords = []
        let addedLastElement = false;
        for(let j=0; j<words[i].length-1; j++) {
            if(words[i][j].idx == -1 && words[i][j+1].idx == -1) {
                let smallestDistance = 999;
                let smallestIdx = -1;
                for(let k=0; k<rows.length; k++) {
                    let distance = calcDistance([words[i][j].word.toLowerCase(),words[i][j+1].word.toLowerCase()], rows[k].german.toLowerCase());
                    if(distance<smallestDistance) {
                        smallestDistance = distance
                        smallestIdx = k;
                    }
                }
                let cid = -1;

                if(!rowsMatched.includes(smallestIdx) && smallestDistance/(words[i][j].word+words[i][j+1].word).toLowerCase().length <MARGIN_LEVENST && smallestDistance<MAX_DISTANCE) {
                    rowsMatched.push(smallestIdx)
                    let images = getImages(rows[smallestIdx]);
                    let tempIdx = -1;
                    cid = rows[smallestIdx].cid
                    if(images.length>0) {
                        tempIdx = totalImages.length;
                        totalImages.push(images)
                    }
                    tempWords.push({word: words[i][j].word+' '+words[i][j+1].word, idx: tempIdx, cid: cid})
                    // Remove so only can appear once
                    // rows.splice(smallestIdx, 1);
                    if(j == words[i].length-2) {
                        addedLastElement = true;
                    }
                    j = j+1;
                } else {
                    tempWords.push(words[i][j])
                }
            } else {
                tempWords.push(words[i][j])
            }
        }
        if(!addedLastElement) {
            tempWords.push(words[i][words[i].length-1])
        }
        copyWords.push(tempWords)
    }

    words=copyWords

    // search if there are matches based on 3 words
    let copy3Words = []
    for(let i=0; i<words.length; i++) {
        let tempWords = []
        let addedLastElement = false;
        for(let j=0; j<words[i].length-2; j++) {
            if(words[i][j].idx == -1 && words[i][j+1].idx == -1 && words[i][j+2].idx == -1) {
                let smallestDistance = 999;
                let smallestIdx = -1;
                for(let k=0; k<rows.length; k++) {
                    let distance = calcDistance([words[i][j].word.toLowerCase(),words[i][j+1].word.toLowerCase(),words[i][j+2].word.toLowerCase()], rows[k].german.toLowerCase());
                    
                    if(distance<smallestDistance) {
                        smallestDistance = distance
                        smallestIdx = k;
                    }
                }
                
                if(!rowsMatched.includes(smallestIdx) && smallestDistance/(words[i][j].word+words[i][j+1].word+words[i][j+2].word).toLowerCase().length <MARGIN_LEVENST && smallestDistance<MAX_DISTANCE) {
                    rowsMatched.push(smallestIdx)
                    let images = getImages(rows[smallestIdx]);
                    let tempIdx = -1;
                    if(images.length>0) {
                        tempIdx = totalImages.length
                        totalImages.push(images)
                    }
                    tempWords.push({word: words[i][j].word+' '+words[i][j+1].word+' '+words[i][j+2].word, idx: tempIdx, cid: rows[smallestIdx].cid})
                    // Remove so only can appear once
                    // rows.splice(smallestIdx, 1);
                    if(j == words[i].length-3) {
                        addedLastElement = true;
                    }
                    j = j+1;
                } else {
                    tempWords.push(words[i][j])
                }
            } else {
                tempWords.push(words[i][j])
            }
        }
        if(!addedLastElement) {
            if(words[i].length>1) {
                tempWords.push(words[i][words[i].length-2])
            }
            tempWords.push(words[i][words[i].length-1])
        }
        copy3Words.push(tempWords)
    }

    let combinedWords = [];
    let combinedWord = "";

    for(let i=0; i<copy3Words.length; i++) {
        for(let j=0; j<copy3Words[i].length; j++) {
            if(copy3Words[i][j].idx == -1) {
                combinedWord = combinedWord + (j>0 ? " " : "") + copy3Words[i][j].word
            } else {
                if(combinedWord.length>0) {
                    combinedWord = combinedWord + ' ';
                    combinedWords.push({word:combinedWord, idx: -1})
                }
                combinedWord = ""
                // put a space if 2 words in row are found
                if(combinedWords.length>0) {
                    if(combinedWords[combinedWords.length-1].idx>-1) {
                        combinedWords.push({word:' ', idx: -1})
                    }
                }
                combinedWords.push(copy3Words[i][j])
            }
        }
        if(delimiters !== null) {
            combinedWord = combinedWord + (delimiters[i] ? delimiters[i] : "")
        }
    }
    if(combinedWord.length>0) {
        combinedWords.push({word:combinedWord, idx: -1, cid: -1})
    }
    if(containsLatex) {
        let answer = "";
        for(var i=0; i<combinedWords.length; i++) {
            if(combinedWords[i].idx==-1) {
                answer = answer + combinedWords[i].word;
            } else {
                answer = answer + `<a onclick="window.ReactNativeWebView.postMessage(JSON.stringify({customAction: 'wordClicked', idx: `+combinedWords[i].idx+`, cid: `+combinedWords[i].cid+`}))">`+combinedWords[i].word+`</a>`
            }
        }
        return { answer: answer, images: totalImages, textParts: [] } 
    } else {
        return { answer: " ", images: totalImages, textParts: combinedWords }
    }
}

async function main() {
    try {
        let text = 'Eine Säure ist eine chemische Verbindung, die in wässriger Lösung dazu neigt, Protonen (H^+) abzugeben. Das ist eine Eigenschaft, die durch den pH-Wert gemessen wird, wobei Säuren einen pH-Wert unter 7 haben. Die allgemeine Formel für eine Säure lautet HA, wobei H das Wasserstoffion und A das Anion ist. Die Stärke einer Säure hängt davon ab, wie leicht sie ein Proton abgeben kann. Starke Säuren dissoziieren in Wasser vollständig, während schwache Säuren nur teilweise dissoziieren.'
        // let text = 'Das RAAS, kamille also das Renin-Angiotensin-Aldosteron-System, ist wichtig für die Regulierung deines Blutdrucks und deines Flüssigkeitshaushalts. Wenn dein Blutdruck sinkt, setzt die Niere Renin frei, das Angiotensinogen in Angiotensin I umwandelt. Angiotensin I wird dann zu Angiotensin II konvertiert, welches die Blutgefäße verengt und die Freisetzung von Aldosteron stimuliert. Aldosteron fördert die Rückresorption von Natrium und Wasser in den Nieren, was den Blutdruck erhöht.'
        // let text ='Describe me Ingweren was ist das'
// let text = 'Hier sind zehn Arzneistoffe:  1. Acetylsalicylsäure 2. Ibuprofen 3. Paracetamol 4. Metformin 5. Simvastatin 6. Ramipril 7. Amoxicillin 8. Cetirizin 9. Prednisolon 10. Omeprazol'
        // let text ='Deine Anfrage bezieht sich auf Arzneistoffe, die in der Medizin verwendet werden. Hier sind 15 Beispiele:  1. **Ibuprofen** - wirkt schmerzlindernd, entzündungshemmend und fiebersenkend. 2. **Paracetamol** - wird bei Schmerzen und Fieber eingesetzt. 3. **Amoxicillin** - ein Antibiotikum zur Behandlung bakterieller Infektionen. 4. **Metformin** - senkt den Blutzuckerspiegel bei Diabetes mellitus Typ 2. 5. **Simvastatin** - zur Senkung erhöhter Cholesterinwerte. 6. **Ramipril** - ein ACE-Hemmer, der bei Bluthochdruck und Herzinsuffizienz verwendet wird. 7. **Salbutamol** - ein Bronchodilatator zur Behandlung von Asthma. 8. **Omeprazol** - ein Protonenpumpenhemmer, der die Magensäureproduktion reduziert. 9. **Diclofenac** - ein nichtsteroidales Antirheumatikum (NSAR) zur Schmerzbehandlung. 10. **Prednisolon** - ein Kortikosteroid, das Entzündungen und Immunreaktionen unterdrückt. 11. **Sertralin** - ein Antidepressivum aus der Gruppe der selektiven Serotonin-Wiederaufnahmehemmer (SSRI). 12. **Lisinopril** - ein weiterer ACE-Hemmer für Bluthochdruck. 13. **Ciprofloxacin** - ein Antibiotikum zur Behandlung verschiedener bakterieller Infektionen. 14. **Aspirin (Acetylsalicylsäure)** - wirkt schmerzlindernd, entzündungshemmend und blutverdünnend. 15. **Loratadin** - ein Antihistaminikum zur Behandlung von Allergien.  Diese Arzneistoffe haben unterschiedliche Wirkmechanismen und werden je nach medizinischer Indikation eingesetzt.'
    // let text = 'Hier sind zehn Arzneistoffe:  1. Acetylsalicylsäure 2. Ibuprofen 3. Metformin 4. Paracetamol 5. Simvastatin 6. Lisinopril 7. Amlodipin 8. Atorvastatin 9. Metoprolol 10. Sertralin'
// let text = '1. Femur (Oberschenkelknochen) 2. Tibia (Schienbein) 3. Humerus (Oberarmknochen) 4. Radius (Speiche) 5. Ulna (Elle)'
        // let text = 'Ethanol, auch bekannt als Ethylalkohol, ist eine chemische Verbindung mit der Formel \(\text{C}_2\text{H}_5\text{OH}\). Es ist eine farblose, flüchtige und brennbare Flüssigkeit, die häufig als Lösungsmittel und in Getränken als Rauschmittel verwendet wird. Ethanol entsteht durch die Fermentation von Zucker durch Hefen oder durch die chemische Hydratisierung von Ethylen.'

// let text = 'Ethanol Hydratisierung methanol von Ethylen.'
// let text = 'Der menschliche Körper besteht aus verschiedenen Organen, die jeweils spezifische Funktionen erfüllen. Hier sind einige der Hauptorgane:  - **Herz**: Pumpt Blut durch den Körper und versorgt Gewebe mit Sauerstoff und Nährstoffen. - **Gehirn**: Steuerzentrale des Körpers, verantwortlich für Gedanken, Gefühle und Koordination der Bewegung. - **Lunge**: Ermöglichen den Gasaustausch, nehmen Sauerstoff auf und geben Kohlendioxid ab. - **Leber**: Verarbeitet Nährstoffe, entgiftet Substanzen und produziert wichtige Proteine. - **Nieren**: Filtern das Blut, entfernen Abfallprodukte und regulieren den Wasser- und Elektrolythaushalt. - **Magen**: Zerkleinert Nahrung und beginnt den Verdauungsprozess. - **Darm**: Absorption von Nährstoffen und Wasser, Ausscheidung von unverdaulichen Resten. - **Haut**: Größtes Organ, schützt vor Umwelteinflüssen, reguliert die Temperatur und ermöglicht das Gefühl von Berührung.  Jedes Organ ist Teil eines komplexen Systems, das zusammenarbeitet, um die Gesundheit und Funktion des Körpers zu erhalten.'
// let text = 'Drei weitere wichtige Namensreaktionen in der organischen Chemie sind:  1. Die Diels-Alder-Reaktion: Eine [4+2]-Cycloaddition zwischen einem konjugierten Dien und einem Alken (Dienophil), um ein Cyclohexen-Derivat zu bilden. 2. Die Friedel-Crafts-Alkylierung: Eine Reaktion, bei der ein Alkylhalogenid in Gegenwart eines Lewis-Säure-Katalysators wie Aluminiumchlorid (AlCl₃) an ein Aromat gebunden wird. 3. Die Aldol-Kondensation: Eine Reaktion zwischen zwei Aldehyden oder Ketonen, katalysiert durch eine Base oder Säure, um ein β-Hydroxyaldehyd oder -keton zu bilden, das weiter zu einem α,β-ungesättigten Aldehyd oder Keton dehydriert werden kann.'
let result = await getPartsAndImages(text);
console.log(result)
} catch (error) {
    console.error(error);
}
}

main();