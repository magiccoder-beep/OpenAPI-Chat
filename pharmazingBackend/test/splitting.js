const levenshtein = require('fastest-levenshtein');

// let text = '9-Tricosan ist eine chemische Verbindung mit der Summenformel \(\text{C}_{23}\text{H}_{48}\). Es handelt sich um ein Alkan, also eine gesättigte Kohlenwasserstoffkette mit 23 Kohlenstoffatomen.';
let text = 'Methanol, auch bekannt als Methylalkohol, ist eine chemische Verbindung mit der Formel \(\text{CH}_3\text{OH}\). Es ist die einfachste Form von Alkohol und wird als Lösungsmittel, Kraftstoff oder als Ausgangsstoff für die Synthese anderer Chemikalien verwendet. Methanol ist giftig und kann bei Einnahme zu schweren gesundheitlichen Problemen führen.'
const delimiters = text.match(/[,.]/g); // Collect all delimiters
const splitText = text.split(/[,.]/).filter(part => part.trim() !== ''); // Split text by delimiters

let words = []
let totalImages = []

let rows = [{german: "(Z)-9-Tricosan", image1: "image1", caption1:"caption1", image2: "image2", caption2:"caption2", image3:"image3", caption3:"caption3"}, {german: "um einAlkani", image1: "image1", caption1:"caption1", image2: "image2", caption2:"caption2", image3:"", caption3:""}, {german: "mit der", image1: "image1", caption1:"caption1", image2: "", caption2:"", image3:"", caption3:""}]

const calcDistance = (origin, target) => {
    let cleanedOrigin = origin.replace(/[()\-.,\s]/g, "");
    let cleanedTarget = target.replace(/[()\-.,\s]/g, "");
    return levenshtein.distance(cleanedOrigin, cleanedTarget);
}

const getImages = (element) => {
    let images = []
    if(element.image1.length>0) {
        images.push({src: element.image1, caption: element.caption1})
    }
    if(element.image2.length>0) {
        images.push({src: element.image2, caption: element.caption2})
    }
    if(element.image3.length>0) {
        images.push({src: element.image3, caption: element.caption3})
    }
    return images
}

// search if there are matches based on 1 word
for(let i=0; i<splitText.length; i++) {
    let splitWords = splitText[i].split(" ");
    let tempArray = []
    for(let j=0; j<splitWords.length; j++) {
        let smallestDistance = 999;
        let smallestIdx = -1;
        let tempIdx = -1
        for(let k=0; k<rows.length; k++) {
            let distance = calcDistance(splitWords[j].toLowerCase(), rows[k].german.toLowerCase());
            if(distance<smallestDistance) {
                smallestDistance = distance
                smallestIdx = k;
            }
        }
        if(smallestDistance/splitWords[j].length <0.2 && smallestDistance<3) {
            tempIdx = totalImages.length;
            totalImages.push(getImages(rows[smallestIdx]))
        }
        tempArray.push({word: splitWords[j], idx: tempIdx})
    }
    words.push(tempArray)
}

console.log('MY RODS')
console.log(words)

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
                let distance = calcDistance(words[i][j].word.toLowerCase()+words[i][j+1].word.toLowerCase(), rows[k].german.toLowerCase());
                if(distance<smallestDistance) {
                    smallestDistance = distance
                    smallestIdx = k;
                }
            }
            if(smallestDistance/(words[i][j].word+words[i][j+1].word).toLowerCase().length <0.2 && smallestDistance<3) {
                tempWords.push({word: words[i][j].word+' '+words[i][j+1].word, idx: totalImages.length})
                totalImages.push(getImages(rows[smallestIdx]))
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
console.log('MY copyWords')
console.log(copyWords)

// search if there are matches based on 3 words
let copy3Words = []
for(let i=0; i<words.length; i++) {
    let tempWords = []
    let addedLastElement = false;
    console.log('i='+i)
    for(let j=0; j<words[i].length-2; j++) {
        console.log('j='+j)
        console.log(words[i][j].word)
        if(words[i][j].idx == -1 && words[i][j+1].idx == -1 && words[i][j+2].idx == -1) {
            let smallestDistance = 999;
            let smallestIdx = -1;
            for(let k=0; k<rows.length; k++) {
                let distance = calcDistance(words[i][j].word.toLowerCase()+words[i][j+1].word.toLowerCase()+words[i][j+2].word.toLowerCase(), rows[k].german.toLowerCase());
                
                if(distance<smallestDistance) {
                    smallestDistance = distance
                    smallestIdx = k;
                }
            }
            console.log('smallestDistance:'+smallestDistance)
            if(smallestDistance/(words[i][j].word+words[i][j+1].word+words[i][j+2].word).toLowerCase().length <0.2 && smallestDistance<3) {
                console.log('here:'+smallestDistance/(words[i][j].word+words[i][j+1].word+words[i][j+2].word).toLowerCase().length)
                tempWords.push({word: words[i][j].word+' '+words[i][j+1].word+' '+words[i][j+2].word, idx: totalImages.length})
                totalImages.push(getImages(rows[smallestIdx]))
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
console.log(copy3Words)
for(let i=0; i<copy3Words.length; i++) {
    for(let j=0; j<copy3Words[i].length; j++) {
        if(copy3Words[i][j].idx == -1) {
            combinedWord = combinedWord + (j>0 ? " " : "") + copy3Words[i][j].word
        } else {
            if(combinedWord.length>0) {
                combinedWords.push({word:combinedWord, idx: -1})
            }
            combinedWord = ""
            combinedWords.push(copy3Words[i][j])
        }
    }
    combinedWord = combinedWord + delimiters[i]
}
if(combinedWord.length>0) {
    combinedWords.push({word:combinedWord, idx: -1})
}

console.log(combinedWords)
