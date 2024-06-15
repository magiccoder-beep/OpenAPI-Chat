const path = require('path');

const db = require('../util/database');
const Question = require('../models/question');
const Answer = require('../models/answer');
const Message = require('../models/message');
// const DeviceInfo = require('../models/deviceInfo');
const Users = require('../db_manipulations/users');
const Images = require('../db_manipulations/images');
const Subscriptions = require('../db_manipulations/subscriptions');
const Questions = require('../db_manipulations/questions');
const Votes = require('../db_manipulations/votes');
const Answers = require('../db_manipulations/answers');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const https = require('https');
const request = require('request');
const axios = require('axios');
const LogError = require('../models/error');
const Token = require('../models/token');
const Log = require('../models/log');

const chatGptToken = process.env.CHATGPT_TOKEN;
const model = 'gpt-4-1106-preview';
// const modelCalculation = 'gpt-4';

const modelCalculation = 'gpt-4-turbo-2024-04-09';
const max_tokens = 10000;
const { verifyPurchaseAndroid, verifyPurchaseIOS } = require('./subscriptions');
const { getPartsAndImages } = require('../general/processor');
const { enrichWithMarketing } = require('../general/marketing');

const promptInstructions = `Erwähne niemals chatgpt oder openAI. sondern für den Fall, dass jemand fragt das alles ist basiert auf maschinellen Lerntechnologie von pharmazing.
Geben Sie eine Antwort von maximal 100 Wörtern. Antworten Sie immer auf Deutsch und immer verwend du oder dein. Verwenden Sie LaTeX für mathematische, chemische Formeln und verwandte Inhalte, Verwenden Sie
\[...\] für angezeigte LaTeX und \(...\) für LaTeX in Textzeilen, immer nutze \ um Latex zu escapen. Verwenden Sie niemals itemize, enumerate, includegraphics in Latex. Schließen Sie Kommentare zur Anzeige von LaTeX aus. Die Frage ist:"
`

const promptInstructionsFollowup = `Erwähne niemals chatgpt oder openAI, sondern für den Fall, dass jemand fragt das alles ist basiert auf maschinellen Lerntechnologie von pharmazing.
Geben Sie eine Antwort von maximal 100 Wörtern. Verwenden Sie LaTeX für mathematische, chemische Formeln und verwandte Inhalte, Verwenden Sie
\[...\] für angezeigte LaTeX und \(...\) für LaTeX in Textzeilen, immer nutze \ um Latex zu escapen. Verwenden Sie niemals itemize, enumerate, includegraphics in Latex. Schließen Sie Kommentare zur Anzeige von LaTeX aus. Antworten Sie immer auf Deutsch und immer verwend du oder dein. 
`

// const promptCalculation = 'Diese Frage is eine Berechnung, aber geben Sie nur die Schritte der Berechnung an, aber nicht das endgültige Ergebnis.'
const promptCalculation = ''
// "render": The question transformed with LaTeX formatting, LaTeX für Mathematik, chemische Verbindungen und alle Gleichungen, mit 
// \[...\] für angezeigte Formeln und \(...\) für Formeln in Textzeilen. Schließen Sie Kommentare zur Anzeige von LaTeX aus. Make sure all latex is surrounded with \[...\] or \(...\)

const extractKeywords = `
Identifizieren: Extrahieren Sie die Schlüsselelemente der Frage
Übersetzen: In DE-Stämme umwandeln
Schwerpunkt: Substantive, chemische/medizinische Begriffe
Beibehalten: Ziffern in chemischen Verbindungen
Doppelte Überprüfung, ob Verben und Konjugationen im Stamm enthalten sind
Ausgabe: JSON with 
"keywords": DE-Stämme (kommagetrennt)
"verwandt": Relevanz für Medizin/Chemie/Physik/Mathematik/allgemeine Wissenschaften (ja/nein)
"math": If it is question related to a calculation
 Die Frage lautet: `;

const relatedQuestion = `Wenn jemand ausdrücklich nach der Generierung der Antwort fragt, sagst du, dass du mit der proprietären Technologie von Pharmazing generiert wird. 
Output: JSON
'answer': die Antwort auf die Frage
'related': Relevanz für Medizin/Chemie/Physik/Mathematik (ja/nein)
Die Frage lautet: `;

const sameCoreQuestionPart1 = "Ist die Kernfrage bei dieser Frage dieselbe? ";
const sameCoreQuestionPart11 = ", Bei Zahlen sind die Fragen nur dann gleich, wenn auch die Zahlen gleich sind; berücksichtigen Sie nur das Feld q und ignorieren Sie id.";
const justYesNo = ". Du antworst einfach mit ja oder nein und der Nummer der Frage, wenn es die gleiche ist, im json-Format ohne zusätzliche Beschreibung oder Kontext. Das json-Feld sollte answer und question_number genannt werden. Das Feld question_number sollte aus einem Array der Frage-IDs bestehen, die Zahlen sind. ";
const sameCoreQuestionPart2 = "Du vergleichst sie mit den folgenden Fragen:";

// Middleware for making a request to ChatGPT
const askChatGPT = async (messages, user_id, type, question_id, calculation=false, improved_model=false) => {
    let tempModel = (calculation||improved_model)?modelCalculation:model
    console.log(tempModel);
    const data = {
        model: tempModel,
        // max_tokens: max_tokens,
        messages: messages,
        temperature: 0,
    };

    const config = {
        headers: {
            'Authorization': `Bearer ${chatGptToken}`, // Replace with your API key
            'Content-Type': 'application/json'
        }
    };

    try {
        const response = await axios.post('https://api.openai.com/v1/chat/completions', data, config);
        const myToken = new Token(user_id, type, response.data.usage.prompt_tokens, response.data.usage.completion_tokens, question_id, tempModel);
        myToken
        .save();
        // return response.data.choices[0].message.content.replace(/\\textit{([^}]+)}/g, "\\(\\textit{$1}\\)");
        return response.data.choices[0].message.content.replace(/\\\((\\textit{[^}]+})\\\)/g, "$1").replace(/\\textit{([^}]+)}/g, "\\(\\textit{$1}\\)");
        // answerChatGpt.choices[0].message.content
    } catch (error) {
        const myError = new LogError(error.message, 'askChatGPT:', user_id, -1, -1);
        myError
        .save();
        console.error("Error calling OpenAI API:", error);
        throw error;
    }
};

// Middleware to save the question
const saveQuestion = async (req, appversion, question, keywords, lng, calculation=false, improved_model=false, related=true, follow_up_question=false, main_question_id=-1) => {
    try {
        const myQuestion = new Question(-1, req.user.user_id, appversion, keywords, question, lng, related, follow_up_question, main_question_id, calculation, improved_model);
        const [rows, fieldData] = await myQuestion.save();
        const insertId = rows.insertId;

        const myMessage = new Message(main_question_id==-1?insertId:main_question_id, 'user', req.user.user_id, question, "", [], []);
        await myMessage.save();

        return { question_insertId: insertId , keywords: keywords };
    } catch (error) {
        const myError = new LogError(error.message, 'saveQuestion:'+question, req.user.user_id, main_question_id, -1);
        myError
        .save();
        // console.error("Error processing/saving question:", error);
        throw error;
    }
};

// Middleware to save the answer
const saveAnswer = async (req, question_id, answer, improved_model, lng, linked_answer_id, main_question_id=-1, imagesResult, main_answer=true) => {
    try {
        const myAnswer = new Answer(-1, question_id, answer, lng, linked_answer_id, main_answer, improved_model);
        const [rows, fieldData] = await myAnswer.save();

        const myMessage = new Message(main_question_id==-1?question_id:main_question_id, 'system', req.user.user_id, answer, imagesResult.answer, imagesResult.images, imagesResult.textParts);
        await myMessage.save();

        return rows.insertId;
    } catch (error) {
        const myError = new LogError(error.message, 'saveAnswer:'+answer, req.user.user_id, question_id, -1);
        myError
        .save();
        throw error;
    }
};

const checkVotedBefore = async (user_id, answer_id) =>  {
    try {
        const [rows, fieldData] = await Votes.fetchVotes(user_id, answer_id);
        return rows.length>0?true:false;
    } catch (error) {
        const myError = new LogError(error.message, 'checkVotedBefore', user_id, -1, answer_id);
        myError
        .save();
        console.error("Error getting voted before:", error);
        throw error;
    }
}

// Middleware to find similar questions
const findSimilarQuestions = async (keywords, questionChars) => {
    try {
        let split_keywords = keywords
        if(!Array.isArray(keywords)) {
            split_keywords = keywords.split(",");
        }
        
        if (split_keywords.length === 0) throw new Error('No keywords found');
        
        const [rows, fieldData] = await Questions.findSimilarQuestions(split_keywords, questionChars);
        return rows;
    } catch (error) {
        const myError = new LogError(error.message, 'findSimilarQuestions:'+keywords, -1, -1, -1);
        myError
        .save();
        console.error("Error finding similar questions:", error);
        throw error;
    }
};

const parseJson = (jsonString) => {
    jsonString = jsonString.replace(/\\/g, '');
    try {
        const parsedData = JSON.parse(jsonString);
        return parsedData;
    } catch (error) {
        const myError = new LogError(error.message, 'parseJson:'+jsonString, -1, -1, -1);
        myError
        .save();
        console.error('Error parsing JSON:', error);
        return {'keywords': "", 'verwandt': "nein", 'math': "nein"}
    }
}

const getValidJsonChatGpt = (mystring, removeSpaces=false) => {
    mystring = mystring.replace(/`/g, '');
    mystring = mystring.replace(/json/g, '');
    // mystring = mystring.replace(/\[/g, '');
    // mystring = mystring.replace(/\]/g, '');
    if(removeSpaces) {
        mystring = mystring.replace(/ /g, '');
    }
    return mystring;
}

const isCorrectAnswer = (answer) => {
    return answer.downvote/(answer.upvote+answer.downvote+1)<0.7;
}

const handleNonRelatedQuestion = async (res, req, question, keywords, userLng, appversion) => {
    console.log('handleNonRelatedQuestion')
    await saveQuestion(req, appversion, question, keywords, userLng, false, false, false);
    res.status(200).json({
        success: 1,
        answer: "CANNOT_ANSWER"
    });
};


const askNewQuestion = async (res, req, addMarketingMsgToAnswer, platform, question, question_insertId, userLng, calculation=false, improved_model=false) => {
    try {
        console.log('no similar questions asked before')
        let content = calculation ? promptCalculation + promptInstructions + question : promptInstructions + question
        
        let answerChatGpt = await askChatGPT([{ role: 'user', content: content }], req.user.user_id, 'question', question_insertId, calculation, improved_model);
        let result = await getPartsAndImages(answerChatGpt)
        const answer_id = await saveAnswer(req, question_insertId, answerChatGpt, improved_model, userLng, -1, -1, result);
        let resultEnriched = await enrichWithMarketing(question_insertId, req.user.user_id, result.containsLatex, result.answer, result.textParts, addMarketingMsgToAnswer, platform);

        let marketingMsg = []
        if(resultEnriched.isPriceMarketing) {
            marketingMsg = resultEnriched.marketingMsg
        }

        res.status(200).json({
            success: 1, 
            answer: answerChatGpt,
            answerImages: resultEnriched.answer,
            answer_id: answer_id,
            question_id: question_insertId,
            images: result.images,
            textParts: resultEnriched.textParts,
            containsLatex: result.containsLatex,
            marketingMsg: marketingMsg
        });
    } catch (error) {
        const myError = new LogError(error.message, 'askNewQuestion:'+question, req.user.user_id, question_insertId, -1);
        myError
        .save();
    }
}

const askQuestionProvidingWrongAnswers = async (res, req, addMarketingMsgToAnswer, platform, previousAnswers, question_insertId, userLng, question, calculation, improved_model=false) => {
    try {
        let wrongAnswers = "";
        let nbFoundWrongAnswers = 0;
        for(let i=0; i<previousAnswers.length; i++) {
            if(!isCorrectAnswer(previousAnswers[i]) && previousAnswers[i].linked_answer_id==-1) {
                wrongAnswers = wrongAnswers + " Answer " + (nbFoundWrongAnswers+1) + ": " + previousAnswers[i].answer
                nbFoundWrongAnswers += 1;
            }
        }

        let promptFeedback = nbFoundWrongAnswers == 0 ? promptInstructions + question : promptInstructions + question + "Take into account that these previous generated answer(s) by chatgpt is wrong but do not comment anything about it: " + wrongAnswers;
        const answerChatGptNew = await askChatGPT([{ role: 'user', content: promptFeedback }], req.user.user_id, 'question_wrong', question_insertId, calculation, improved_model);
        let result = await getPartsAndImages(answerChatGptNew)
        const answer_id = await saveAnswer(req, question_insertId, answerChatGptNew, improved_model, userLng, -1, -1, result);
        let resultEnriched = await enrichWithMarketing(question_insertId, req.user.user_id, result.containsLatex, result.answer, result.textParts, addMarketingMsgToAnswer, platform);
        let marketingMsg = []
        if(resultEnriched.isPriceMarketing) {
            marketingMsg = resultEnriched.marketingMsg
        }

        res.status(200).json({
            success: 1, 
            answer: answerChatGptNew,
            answer_id: answer_id,
            question_id: question_insertId,
            images: result.images,
            answerImages: resultEnriched.answer,
            textParts: resultEnriched.textParts,
            answerImages: result.answer,
            containsLatex: result.containsLatex,
            marketingMsg: marketingMsg
        });
    } catch (error) {
        const myError = new LogError(error.message, 'askQuestionProvidingWrongAnswers', req.user.user_id, question_insertId, -1);
        myError
        .save();
        // console.error('Error asking question providing wrong answers:', error);
    }
}

const uniqueQuestions = (array) => {
    const seen = new Set();
    return array.filter(item => {
      const duplicate = seen.has(item.question);
      seen.add(item.question);
      return !duplicate;
    });
  };

exports.askQuestion = async (req, res) => {
    console.log(process.env.ECS_CONTAINER_METADATA_URI_V4.split('/').pop()+' askQuestion');
    let messages = req.body.messages;
    let device_id = req.body.device_id;
    let is_tablet = req.body.is_tablet;
    let isValidDevice = true;
    let isValidSubscription = false;
    let isTrialSubscription = false;
    let expiredSubscription = false;
    let appversion = req.body.appversion;
    appversion = appversion === undefined ? 0 : appversion;
    appversion = appversion.toString();
    let platform = req.body.platform;
    if(platform == 'ios' || platform == 'android') {
        platform = 'APP'
    }
    // isValidSubscription = true;
    // isTrialSubscription= true;

    try {
        const [rows, fieldData] = await Users.fetchOnId(req.user.user_id);
        // const currentDate = new Date(Date.now())
        // const currentDate = new Date(new Date().toISOString().slice(0, 19).replace('T', ' '))
        const currentDate = Date.now()
        const trial_end_date = rows[0].trial_end_date_epoch;
        // const trial_end_date = new Date(rows[0].trial_end_date);

        if((rows[0].trial && currentDate<trial_end_date)) {
            isTrialSubscription = true;
        } else if((rows[0].active_subscription && currentDate<rows[0].subscription_end_date_epoch)) {
            isValidSubscription = true;
        } else {
            //CHECK IF HAS VALID SUBSCRIPTION
            const [rowsSubs, fieldData] = await Subscriptions.getValidSubscription(req.user.user_id);
            const [rowsAllSubs, fieldData2] = await Subscriptions.getSubscriptionsShouldVerify(req.user.user_id)
            const [rowsAllSubsNoFilter, fieldData3] = await Subscriptions.getSubscriptionsShouldVerify(req.user.user_id)

            if(rowsSubs.length>0) {
                isValidSubscription = true;
                Users.setActiveSubscription(req.user.user_id, rowsSubs[0].expiryTimeMillis)
            } else {
                //Check if some subscriptions actually have renewed
                // const [rowsAllSubs, fieldData] = await Subscriptions.getSubscriptions(req.user.user_id)
                // console.log('got subscriptions:'+rowsAllSubs.length)
                for(let i=0; i<rowsAllSubs.length; i++) {
                    if(rowsAllSubs[0].platform === 'android') {
                        // console.log('Verify android:'+rowsAllSubs[i].id)
                        const subResult = await verifyPurchaseAndroid(rowsAllSubs[i].id, rowsAllSubs[i].purchaseToken, rowsAllSubs[i].productId)
                        if(subResult.success) {
                            if(currentDate < subResult.expiryTimeMillis) {
                                isValidSubscription = true;
                                Users.setActiveSubscription(req.user.user_id, subResult.expiryTimeMillis)
                                break;
                            }
                        }
                    } else if(rowsAllSubs[0].platform === 'ios') {
                        // console.log('Verify ios:'+rowsAllSubs[i].id)
                        const subResult = await verifyPurchaseIOS(rowsAllSubs[i].id, rowsAllSubs[i].orderId, rowsAllSubs[i].productId)
                        if(subResult.success) {
                            if(currentDate < subResult.expiryTimeMillis) {
                                isValidSubscription = true;
                                Users.setActiveSubscription(req.user.user_id, subResult.expiryTimeMillis)
                                break;
                            }
                        }
                    }
                }
                //If there has been an inscription but it is no longer valid, that means it has expired
            }
            if(rowsAllSubsNoFilter.length > 0 && !isValidSubscription) {
                expiredSubscription = true;
            }
        }

        //still has old version of app so its ok, let them ask questions in order not to break it
        if(typeof device_id === 'undefined') {
            // console.log('device id undefined')
        } else if(typeof is_tablet === 'undefined') {
        } else if(device_id == rows[0].tablet_id || device_id == rows[0].phone_id) {
        } else {
            if(is_tablet && rows[0].tablet_id == '') {
                const log1 = new Log(req.user.user_id, 'DEVICE_DEBUG', 'setTablet is_tablet:'+is_tablet, device_id);
                log1.save()
                // console.log('tablet and empty string')
                Users.setTablet(req.user.user_id, device_id).then(([rows2, fieldData]) => {
                }).catch(err => 
                        { const myError = new LogError(err.message, 'Unable to set deviceid:'+device_id, -1, -1, -1);
                        myError
                .save();});  
            } else if(!is_tablet && rows[0].phone_id == '') {
                const log2 = new Log(req.user.user_id, 'DEVICE_DEBUG', 'setPhone is_tablet:'+is_tablet, device_id);
                log2.save()
                // console.log('phone and empty string')
                Users.setPhone(req.user.user_id, device_id).then(([rows2, fieldData]) => {
                }).catch(err => 
                        { const myError = new LogError(err.message, 'Unable to set deviceid:'+device_id, -1, -1, -1);
                        myError
                .save();});  
            } else if(device_id != rows[0].phone_id && device_id != rows[0].tablet_id) {
                // console.log('not valid device')
                const log3 = new Log(req.user.user_id, 'DEVICE_DEBUG', ' is_tablet:'+is_tablet, 'device_id:'+device_id+' db phone id:'+rows[0].phone_id+' db tablet_id:'+rows[0].tablet_id );
                log3.save()
                isValidDevice = false;
            }
        }
    } catch (error) {
        const myError = new LogError(error.message, 'Not able to fetch user: '+req.user.user_id, req.user.user_id, -1, -1);
        myError
        .save();
        // res.status(200).json({
        //     success: 0
        // });
    }

    let isValidAppVersion = true
    // IOS users have device id of 36, and android of 16, force IOS AND ANDROID TO download
    if(appversion == '0' && device_id.length>2 && req.user.user_id<949) {
        isValidAppVersion = false;
    }
    let addMarketingMsgToAnswer = false;
    if(appversion != '0' && appversion != '1' ) {
        addMarketingMsgToAnswer = true
    }

    if((isValidSubscription || isTrialSubscription) && isValidAppVersion) {
        if(isValidDevice) {
            if (messages.length === 1) {
                let question = messages[0].content;
                try {
                    const chatGPTResponse = await askChatGPT([{ role: 'user', content: extractKeywords + question }], req.user.user_id, 'keywords', -1);
                    let jsonResponse = parseJson(getValidJsonChatGpt(chatGPTResponse.trim()));
                    // console.log(jsonResponse);
                    let keywords = jsonResponse.keywords;
                    let userLng = 'de';
                    let calculation = false;
                    if(jsonResponse.math == 'ja' || jsonResponse.math == 'yes') {
                        calculation = true;
                    }
                    if(jsonResponse.verwandt === 'nein') {
                        handleNonRelatedQuestion(res, req, question, keywords, userLng, appversion);
                    } else {
                        let similarQuestions = await findSimilarQuestions(keywords, question.length);
                        similarQuestions = uniqueQuestions(similarQuestions)
                        // console.log(similarQuestions)
                        const saveQuestionResponse = await saveQuestion(req, appversion, question, keywords, userLng, calculation);
                        const question_insertId = saveQuestionResponse.question_insertId;
                        if (similarQuestions.length === 0) {
                            askNewQuestion(res, req, addMarketingMsgToAnswer, question, question_insertId, userLng, calculation)
                        } else {
                            console.log(process.env.ECS_CONTAINER_METADATA_URI_V4.split('/').pop()+' There were similar questions asked before')
                            let otherQuestions = "";
                            for(let i=0; i<similarQuestions.length; i++) {
                                otherQuestions = otherQuestions + " [" +"id:" +similarQuestions[i].question_id + " q:" + similarQuestions[i].question + "] ";
                            }
                            // console.log(otherQuestions)
                            const chatGPTResponseSameQuestion = await askChatGPT([{ role: 'user', content: sameCoreQuestionPart1 + '"' + question + '"' +sameCoreQuestionPart11 + justYesNo + sameCoreQuestionPart2 + otherQuestions }], req.user.user_id, 'same_question', question_insertId);
                            let jsonResponse = parseJson(getValidJsonChatGpt(chatGPTResponseSameQuestion));
                            // console.log(jsonResponse)

                            // Same question was asked before
                            if(jsonResponse.answer === 'ja' || jsonResponse.answer === 'yes') {
                                // Determine if previous answer to question is considered acceptable or not based on votes
                                const [previousAnswers, fieldData] = await Answers.fetchOnQuestionId(jsonResponse.question_number);
                                let validAnswer = false;
                                let main_answer_idx = -1;
                                // Loop over all master answers which have linked_answer_id = -1
                                for(let i=0; i<previousAnswers.length; i++) {
                                    if(isCorrectAnswer(previousAnswers[i]) && previousAnswers[i].linked_answer_id==-1) {
                                        validAnswer = true;
                                        main_answer_idx = i;
                                        break;
                                    }
                                }

                                // If there is answer that is considered correct based on good votes, then return that
                                if(validAnswer) {
                                    console.log(process.env.ECS_CONTAINER_METADATA_URI_V4.split('/').pop()+' attempting reading answer from db')
                                    await Questions.updateQuestion(question_insertId, previousAnswers[main_answer_idx].question_id);

                                    let answerFoundInLng = false;
                                    let idxFound = -1;
                                    // Search if answer available in user language
                                    for(let i=0; i<previousAnswers.length; i++) {
                                        // The answer is valid if it is the main answer we found before, or if the answer links to the answer we found before
                                        let isValidAnswer = (previousAnswers[i].linked_answer_id == previousAnswers[main_answer_idx].id) || (i == main_answer_idx);
                                        if(isValidAnswer) {
                                            answerFoundInLng = true;
                                            idxFound = i;
                                        }
                                    }
                                    let result = await getPartsAndImages(previousAnswers[idxFound].answer)

                                    const myMessage = new Message(question_insertId, 'system', req.user.user_id, previousAnswers[idxFound].answer, result.answer, result.images, result.textParts);
                                    await myMessage.save();

                                    let hasVoted = await checkVotedBefore(req.user.user_id, previousAnswers[main_answer_idx].id)

                                    let resultEnriched = await enrichWithMarketing(question_insertId, req.user.user_id, result.containsLatex, result.answer, result.textParts, addMarketingMsgToAnswer, platform);
                                    let marketingMsg = []
                                    if(resultEnriched.isPriceMarketing) {
                                        marketingMsg = resultEnriched.marketingMsg
                                    }
                                    res.status(200).json({
                                        success: 1, 
                                        voted: hasVoted,
                                        isValidSubscription: isValidSubscription,
                                        isTrialSubscription: isTrialSubscription,
                                        expiredSubscription: expiredSubscription,
                                        question_id: question_insertId,
                                        answer: previousAnswers[idxFound].answer, // Translated answer if found otherwise just original if apllicable
                                        answer_id: previousAnswers[main_answer_idx].id, // provide answer id of master answer which will get updated in case of voting
                                        images: result.images,
                                        textParts: resultEnriched.textParts,
                                        answerImages: resultEnriched.answer,
                                        containsLatex: result.containsLatex,
                                        marketingMsg: marketingMsg
                                    })
                                } else {
                                    console.log(process.env.ECS_CONTAINER_METADATA_URI_V4.split('/').pop()+' Feedbackloop: providing wrong answer(s) to chatgpt and ask question')
                                    askQuestionProvidingWrongAnswers(res, req, addMarketingMsgToAnswer, platform, previousAnswers, question_insertId, userLng, question, calculation);
                                }
                            } else {
                                console.log(process.env.ECS_CONTAINER_METADATA_URI_V4.split('/').pop()+' generating new answer because question not asked before')
                                askNewQuestion(res, req, addMarketingMsgToAnswer, platform, question, question_insertId, userLng, calculation);
                            }
                        }
                    }
                } catch (error) {
                    const myError = new LogError(error.message, 'askQuestion new:'+question, req.user.user_id, -1, -1);
                    myError
                    .save();
                    res.status(500).json({
                        success: 0, 
                        error: error.message,
                        isValidSubscription: isValidSubscription,
                        isTrialSubscription: isTrialSubscription,
                        expiredSubscription: expiredSubscription
                    });
                }
            } else {
                // console.log(messages)
                let question = messages[0].content;
                try {
                console.log(process.env.ECS_CONTAINER_METADATA_URI_V4.split('/').pop()+' This is a follow up question')
                messages[0].content = promptInstructionsFollowup + messages[0].content;
                let downvoted = req.body.downvoted;
                let improved_model = false;
                if(messages.length == 3 && downvoted) {
                    improved_model = true;
                }
                const chatGPTResponse = await askChatGPT(messages, req.user.user_id, 'question_follow', req.body.main_question_id, false, improved_model);
                // let jsonResponse = parseJson(getValidJsonChatGpt(chatGPTResponse));
                // let answer = jsonResponse.antwort;
                let result = await getPartsAndImages(chatGPTResponse);
                let responseQuestion = await saveQuestion(req, appversion, messages[messages.length-1].content, "", "", false, improved_model, true, true, req.body.main_question_id);
                saveAnswer(req, responseQuestion.question_insertId, chatGPTResponse, improved_model, "", -1, req.body.main_question_id, result, false);

                let resultEnriched = await enrichWithMarketing(responseQuestion.question_insertId, req.user.user_id, result.containsLatex, result.answer, result.textParts, addMarketingMsgToAnswer, platform);
                let marketingMsg = []
                if(resultEnriched.isPriceMarketing) {
                    marketingMsg = resultEnriched.marketingMsg
                }

                res.status(200).json({
                    success: 1, 
                    answer: chatGPTResponse,
                    answerImages: resultEnriched.answer,
                    images: result.images,
                    textParts:resultEnriched.textParts,
                    question_id: req.body.main_question_id,
                    answer_id: -1,
                    isValidSubscription: isValidSubscription,
                    isTrialSubscription: isTrialSubscription,
                    expiredSubscription: expiredSubscription,
                    containsLatex: result.containsLatex,
                    marketingMsg: marketingMsg
                });
                } catch (error) {
                    const myError = new LogError(error.message, 'askQuestion follow up:'+question, req.user.user_id, -1, -1);
                    myError
                    .save();
                    res.status(500).json({
                        success: 0, 
                        error: error.message,
                        isValidSubscription: isValidSubscription,
                        isTrialSubscription: isTrialSubscription,
                        expiredSubscription: expiredSubscription
                    });
                }
            }
        } else {
            res.status(200).json({
                success: 2,
                isValidSubscription: isValidSubscription,
                isTrialSubscription: isTrialSubscription,
                expiredSubscription: expiredSubscription
            });
        }
    } else {
        if(!isValidAppVersion) {
            const log1 = new Log(req.user.user_id, 'INSTALL_NEWAPP', 'setTablet is_tablet:'+is_tablet, device_id+ ' appversion:'+appversion);
            log1.save()
            
            console.log(process.env.ECS_CONTAINER_METADATA_URI_V4.split('/').pop()+' INSTALL_NEWAPP:'+req.user.user_id)

            let newapp_text = 'Unsere offizielle App ist jetzt verfügbar. Also bitte TestFlight löschen und im AppStore einfach nach “pharmazing“ suchen'
            res.status(200).json({
                success: 1, 
                answer: newapp_text,
                answerImages: newapp_text,
                images: [],
                textParts: [{idx: -1, word: newapp_text}],
                question_id: req.body.main_question_id,
                answer_id: -1,
                isValidSubscription: isValidSubscription,
                isTrialSubscription: isTrialSubscription,
                expiredSubscription: expiredSubscription
            });
        } else {
            res.status(200).json({
                success: 3,
                isValidSubscription: isValidSubscription,
                isTrialSubscription: isTrialSubscription,
                expiredSubscription: expiredSubscription
            });
        }
    }
};

exports.test = (req, res, next) => {
    // process.exit(0);
    // console.log('ask question')
    res.status(200).json({
        success: 1
    });
}

exports.home = (req, res, next) => {
    // process.exit(0);
    // console.log('ask question')
    res.status(200).json({
        success: 1
    });
}

exports.sendFCMToken = (req, res, next) => {
    const userId = req.user.user_id;

    const fcmToken = req.body.fcmToken;
    Users.setFcmToken(userId, fcmToken);

    res.status(200).json({
        success: 1
    });
}

exports.getQuestions = async(req, res, next) => {
    console.log(process.env.ECS_CONTAINER_METADATA_URI_V4.split('/').pop()+' getQuestions')

    try {
        const [rows, fieldData] = await Users.fetchOnId(req.user.user_id);
        if(rows.length>0) {
            if(rows[0].admin) {
                const [rows, fieldData] = await Questions.getQuestions();

                res.status(200).json({
                    success: 1,
                    questions: rows
                });
            } else {
                throw Error();
            }
        } else {
            throw Error();
        }
    } catch (error) {
        console.error("Cannot get questions ", error);
        res.status(200).json({
            success: 0
        });
}
}