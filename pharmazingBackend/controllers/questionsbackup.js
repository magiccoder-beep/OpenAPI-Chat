const path = require('path');

const db = require('../util/database');
const Question = require('../models/question');
// const DeviceInfo = require('../models/deviceInfo');
const Users = require('../db_manipulations/users');
const Questions = require('../db_manipulations/questions');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const https = require('https');
const request = require('request');
const axios = require('axios');

const chatGptToken = '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';
const model = 'gpt-4-1106-preview';
const max_tokens = 200;

const askChatGPT = (messages) => {
    const data = {
        model:model,
        max_tokens: max_tokens,
        messages: messages,
        temperature: 0,
    };

    const config = {
    headers: {
        'Authorization': `Bearer `+chatGptToken, // Replace with your API key
        'Content-Type': 'application/json'
    }
    };

    return axios.post('https://api.openai.com/v1/chat/completions', data, config)
}

// SELECT *
// FROM pharmazing.questions
// WHERE (
//     (keywords LIKE '%wasserfrei%') +
//     (keywords LIKE '%essig%') 
// ) >= 2;

exports.askQuestion = (req, res, next) => {
    console.log('askQuestion')  
    let messages = req.body.messages;
    const extractKeywords = `Which are the keywords of this question.  A keyword can only consist of 1 word and take the stem of the keyword. The keywords should be ordered by importance but nouns are
    always more important. Also words related to chemistry or medicin are more important than more general words. Make sure to double check before giving the answer that all keywords consist only of the stem of the word.
    The answer should just consist of the keywords.If no keywords can be found just return empty string.The question is: `
    // const extractKeywords = `Which are the keywords of this question.  A keyword can only consist of 1 word and take the stem of the keyword. The keywords should be ordered by importance but nouns are
    // always more important. Also words related to chemistry or medicin are more important than more general words. Make sure to double check before giving the answer that all keywords consist only of the stem of the word.
    // The answer should consist of 2 parts, the first part the keywords and the second part the answer to the question.The question is: `
    if(messages.length == 1) {
        let question = messages[0].content
        askChatGPT([{role:'user', content: extractKeywords + question}])
        .then(response => {
                let keywords = response.data.choices[0].message.content.replace(/^\s+|\s+$/gm,'');
                const myQuestion = new Question(-1, req.user.user_id, keywords, question);
                myQuestion
                .save()
                .then(([rowsInsert, fieldData]) => {
                    const split_keywords = keywords.split(",");
                    if(split_keywords.length==0) {
                        res.status(200).json({
                            success: 1, 
                            response: 'Unable to answer your question'
                        });
                    }
                    else {
                        console.log(split_keywords)
                        Questions
                        .findSimilarQuestions(split_keywords)
                        .then(([rows, fieldData]) => {
                            if((rows.length == 0) || (rows.length==1 && rowsInsert.insertId==rows[0].id)) {
                                // Then ask question directly to chatgpt
                                askChatGPT(messages)
                                .then(response => {
                                    let answerChatGpt = response.data.choices[0].message.content;
                                    res.status(200).json({
                                        success: 1, 
                                        answer: answerChatGpt
                                    });
                                })
                                .catch(function(error) {
                                    console.log(error)
                                    res.status(200).json({
                                        success: 0, 
                                        error: 5,
                                        errorMsg: 'An error occured while asking your new question!'
                                    });
                                });
                            } else {
                                //Ask ChatGPT if the question is the same as one of those questions
                                

                                res.status(200).json({
                                    success: 1, 
                                    questions: rows,
                                    response: 'Unable to answer your question'
                                });
                            }
                        })
                        .catch(function(error) {
                            console.log(error)
                            res.status(200).json({
                                success: 0, 
                                error: 4,
                                errorMsg: 'An error occured while searching similiar questions!'
                            });
                        });
                    }
                })
                .catch(function(error) {
                    console.log(error)
                    res.status(200).json({
                        success: 0, 
                        error: 3,
                        errorMsg: 'An error occured while executing your query'
                    });
                });
            })
            .catch(error => {
                console.error("Error calling OpenAI API:", error);
            });
    }
}

// exports.askQuestion = (req, res, next) => {
//     // process.exit(0);

//     const chatGptToken = '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';
//     const model = 'gpt-4-1106-preview';
//     const max_tokens = 200;


//     const data = {
//           model:model,
//           max_tokens: max_tokens,
//         //   messages: req.body.messages,
//           temperature: 0,
//           messages: [{role: 'user', content: 'why is the sun yellow'}]
//     };

//     const config = {
//         headers: {
//             'Authorization': `Bearer `+chatGptToken, // Replace with your API key
//             'Content-Type': 'application/json'
//         }
//     };

//     axios.post('https://api.openai.com/v1/chat/completions', data, config)
//         .then(response => {
//             let answer = response.data.choices[0].message.content;
//             console.log(answer)
//         })
//         .catch(error => {
//             console.error("Error calling OpenAI API:", error);
//         });
// }

exports.test = (req, res, next) => {
    // process.exit(0);
    console.log('ask question')
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