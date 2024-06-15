const path = require('path');

const db = require('../util/database');
const Users = require('../db_manipulations/users');
const Vote = require('../models/vote');
const Answers = require('../db_manipulations/answers');
const https = require('https');
const request = require('request');
const LogError = require('../models/error');

exports.vote = async (req, res, next) => {
    await Answers.updateVotes(req.body.answer_id, req.body.upvote, req.body.downvote);

    // process.exit(0);
    const myVote = new Vote(-1, req.user.user_id, req.body.answer_id, req.body.upvote, req.body.downvote);
    myVote
    .save()
    .then(([rows, fieldData]) => {
        res.status(200).json({
            success: 1
        });
    })
    .catch(function(error) {
        const myError = new LogError(error.message, 'vote:', req.user.user_id, -1, req.body.answer_id);
        myError
        .save();
        res.status(200).json({
            success: 0, 
            error: 3,
            errorMsg: 'An error occured while voting'
        });
    });
}

// Give Mathematics or chemical formulas in LaTeX format using math delimiters that surround the mathematics. There are two types of equations: ones that occur within a paragraph (in-line mathematics), and larger equations that appear separated from the rest of the text on lines by themselves.
// The default math delimiters are $$...$$, $...$ and \[...\] for displayed mathematics, and \(...\) for in-line mathematics. Do not comment anything about displaying Latex in your answer.
// Welcher pH-Wert stellt sich bei einer NaHCO3-Lösung ein, deren Konzentration c(NaHCO3) = 0,08 mol/L ist? I have asked this question before the ChatGPT and this answer is wrong 1.Der pH-Wert einer Natriumhydrogencarbonat-Lösung (NaHCO3) mit einer Konzentration von 0,08 mol/L stellt sich auf etwa 4,37 ein.

// Give Mathematics or chemical formulas in LaTeX format using math delimiters that surround the mathematics. There are two types of equations: ones that occur within a paragraph (in-line), and larger equations that appear separated from the rest of the text on lines by themselves.
// The formula delimiters are $$...$$ and \[...\] for displayed formulas, and \(...\) for in-line formulas. Do not comment anything about displaying Latex in your answer.
// Welcher pH-Wert stellt sich bei einer NaHCO3-Lösung ein, deren Konzentration c(NaHCO3) = 0,08 mol/L ist? I have asked this question before the ChatGPT and this answer is wrong 1.Der pH-Wert einer Natriumhydrogencarbonat-Lösung (NaHCO3) mit einer Konzentration von 0,08 mol/L stellt sich auf etwa 4,37 ein.

