const url = 'https://www.pharmazingapp.de'
// const url = 'http://localhost:3000'
// const tokenLocal = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoxLCJyZWZyZXNoIjowLCJpYXQiOjE3MTA3NDM4NTYsImV4cCI6MTcxMDc0NDc1Nn0.ZdZ4w_a4NMeD8IzeBiPNSoWpkywq2ZzvBdJqhZR94YM'
// const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJyZWZyZXNoIjowLCJpYXQiOjE3MTA3NDQ2NjgsImV4cCI6MTcxMDc0NTU2OH0.AZEdz4Gx6t6lt5vS4zBL9SDibe8XHWi04O0DXN5hzLM"
const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjo1LCJyZWZyZXNoIjowLCJpYXQiOjE3MTQ5MjQ3MTAsImV4cCI6MTcxNDkyNTYxMH0.u8_YaiiQ0b_Mh4e6nRpsZzqovjI90EdEk12nVf8rEaE"
// const fetch = require('node-fetch');
const axios = require('axios');

const questions = ["What is the atomic number of carbon?",
"Define the term 'mole' in chemistry.",
"What is Avogadro's number?",
"Describe the structure of an atom.",
"What is the difference between an ionic and a covalent bond?",
"How do you calculate molar mass?",
"What are isotopes?",
"Explain the significance of the periodic table.",
"What is a catalyst?",
"Define pH and its importance.",
"What is the principle behind chromatography?",
"How does a buffer solution work?",
"What are the states of matter?",
"Describe the process of titration.",
"What is the law of conservation of mass?",
"Explain the concept of valence electrons.",
"What is electronegativity?",
"How are chemical equations balanced?",
"What is the role of enzymes in biochemistry?",
"Define oxidation and reduction.",
"What are hydrocarbons?",
"Describe the gas laws.",
"What is a polymer?",
"Explain the significance of the pH scale.",
"How do you determine the empirical formula of a compound?",
"What is a solution, solvent, and solute?",
"Describe the process of distillation.",
"What are acids, bases, and salts?",
"How does temperature affect reaction rates?",
"What is the role of the electron in chemical bonding?",
"Define and give examples of a heterogeneous mixture.",
"What is stoichiometry?",
"How do you determine the limiting reactant in a chemical reaction?",
"What is a chemical equilibrium?",
"Explain Le Chatelier's principle.",
"What are allotropes? Give an example.",
"Describe the structure and function of a chemical compound.",
"What is the difference between endothermic and exothermic reactions?",
"How do nuclear reactions differ from chemical reactions?",
"What is photochemistry?"]

const fs = require('fs');
const csv = require('csv-parser');



// const loadQuestions = async (i) => { 
//     const myQuestions = [];
//     await fs.createReadStream('/Users/jente/Projects/pharmazing/backendPharm/performance/questions.csv')
//     .pipe(csv())
//     .on('data', (data) => myQuestions.push(data))
//     .on('end', () => {
//     });
//     return myQuestions;
// }

const loadQuestions = () => {
    return new Promise((resolve, reject) => {
        const myQuestions = [];
        fs.createReadStream('/Users/jente/Projects/pharmazing/backendPharm/performance/questions.csv')
            .pipe(csv())
            .on('data', (data) => myQuestions.push(data))
            .on('end', () => {
                resolve(myQuestions);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
};

const postQuestion = async (i, question) => {
    try {



        const response = await axios.post(url + '/questions/askQuestion', {
            "messages": [{"role": "user", "content": question}, {"role": "system", "content": 'unable to answer'}, {"role": "user", "content": question}],
            "main_question_id": -1,
            "device_id": "8d8468d01f352d4a",
            "is_tablet": 0,
            "downvoted": 0
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if(response.data.success != 1) {
            console.log("FAILURE:i="+i+' quest='+question)
        } else {
            console.log("SUCCESS")
        }
       
    } catch (error) {
        console.error('Error posting question:', error);
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

// Don't forget to call the function

async function perfTest() {
    const myResult = await loadQuestions();
    for(i=0; i<100; i++) {
        console.log(i)
        postQuestion(i, myResult[i].Question);
        await sleep(2500);
    } 
}


perfTest()