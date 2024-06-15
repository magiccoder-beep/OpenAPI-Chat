    let ignoreWords = ['der', 'die', 'das', 'ist', 'und', 'es', 'ein', 'eine', 'als', 'bei', 'mit', 'von', 'aus', 'nach', 'zu', 'oder', 'vor', 'weil']
    
    let origin = ''
    let originArray = ['von', 'marker']
    for(let i=0; i<originArray.length; i++) {
        if(ignoreWords.includes(originArray[i])) {
            console.log('originArray[i]:'+originArray[i])
            originArray[i] = '';
        } 
        origin += originArray[i]
        
    }
    console.log(origin)