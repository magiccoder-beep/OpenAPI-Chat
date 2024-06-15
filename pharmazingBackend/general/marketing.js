const urlPattern = /(https?:\/\/[^\s]+)/;

const MarketingMessages = require('../db_manipulations/marketingMessages');

function isURL(str) {
    return urlPattern.test(str);
}

const getNextMarketingMessage = async(user_id, question_id, platform) => {
    const [messages, fieldData] = await MarketingMessages.fetchNextMarketingMessage(user_id, ['INLINE', 'QUESTION_PRICE'], platform);
    if(messages.length>0) {
        let selectedMessage = messages[0]
        let messageParts = []
        let isPriceMarketing = false;
        MarketingMessages.deliveredMarketingMessage(user_id, messages[0].id, question_id)
        if(selectedMessage.type == 'INLINE') {
            let myMessageSplit = selectedMessage.message.split(urlPattern);
            for(let i=0;i<myMessageSplit.length;i++) {
                let temp = isURL(myMessageSplit[i])
                messageParts.push({word: myMessageSplit[i], idx: -1, isUrl: temp, marketingId: temp ? selectedMessage.id : -1})
            }
        // QUESTION_PRICE
        } else {
            isPriceMarketing = true;
            messageParts.push({word: selectedMessage.message, idx: -1, isUrl: false, marketingId: selectedMessage.id})
        }
        return {messageParts: messageParts, isPriceMarketing: isPriceMarketing}
    } else {
        return {messageParts: [], isPriceMarketing: false}
    }
}

const enrichWithMarketing = async(question_id, user_id, containsLatex, answer, textParts, addMarketingMsgToAnswer, platform) => {
    if(!addMarketingMsgToAnswer) {
        return {textParts: textParts, answer: answer}
    }
    const { messageParts: marketingMsg, isPriceMarketing } = await getNextMarketingMessage(user_id, question_id, platform);
    if(isPriceMarketing) {
        return {textParts: textParts, answer: answer, isPriceMarketing: true, marketingMsg: marketingMsg}
    }

    if(containsLatex) {
        answer += ' ';
        for(let i=0; i<marketingMsg.length; i++) {
            if(marketingMsg[i].isUrl) {
                answer += `<a class="link" onclick="window.ReactNativeWebView.postMessage(JSON.stringify({linkClicked: 'linkClicked', marketingId:`+marketingMsg[i].marketingId+`, link: '`+marketingMsg[i].word+`'}))">`+marketingMsg[i].word+`</a>`
            } else {
                answer += marketingMsg[i].word
            }
        }
    } else {
        if(marketingMsg.length>0) {
            textParts.push({idx: -1, word: '\n\n'})
        }
        
        for(let i=0; i<marketingMsg.length; i++) {
            textParts.push(marketingMsg[i])
        }
    }
    return {textParts: textParts, answer: answer, isPriceMarketing: false}
}

module.exports.enrichWithMarketing = enrichWithMarketing;
