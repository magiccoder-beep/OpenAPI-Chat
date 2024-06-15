const MarketingMessages = require('../db_manipulations/marketingMessages');
const Users = require('../db_manipulations/users');
const LogError = require('../models/error');
const urlPattern = /(https?:\/\/[^\s]+)/;

function isURL(str) {
    return urlPattern.test(str);
}

exports.getNextMarketingMessage = async (req, res, next) => {
    console.log('getNextMarketingMessage')
    try {
        let platform = req.body.platform;
        if(platform == 'ios' || platform == 'android') {
            platform = 'APP'
        }
        const [messages, fieldData] = await MarketingMessages.fetchNextMarketingMessage(req.user.user_id, ['POPUP', 'POPUP_PRICE'], platform);
        if(messages.length>0) {
            let selectedMessage = messages[0]
            let messageParts = []
            let isPriceMarketing = false
            if(selectedMessage.type == 'POPUP') {
                let myMessageSplit = selectedMessage.message.split(urlPattern);
                
                for(let i=0;i<myMessageSplit.length;i++) {
                    let temp = isURL(myMessageSplit[i])
                    messageParts.push({word: myMessageSplit[i], idx: -1, isUrl: temp, marketingId: temp ? selectedMessage.id : -1})
                }
            // POPUP_PRICE
            } else {
                isPriceMarketing = true;
                messageParts.push({word: selectedMessage.message, idx: -1, isUrl: false, marketingId: selectedMessage.id })
            }

            //Send message and indicate it as delivered
            res.status(200).json({
                success: 1, 
                hasMessage: 1,
                id: selectedMessage.id,
                message: selectedMessage.message,
                messageParts: messageParts,
                isPriceMarketing: isPriceMarketing
            });
        } else {
            res.status(200).json({
                success: 1, 
                hasMessage: 0 
            });
        }
    } catch(error) {
        const myError = new LogError(error.message, 'Error fetching marketingMessages:'+req.user.user_id, -1, -1, -1);
        myError
        .save() 
        res.status(200).json({
            success: 0, 
            error: 2,
            error_code: 'ERROR_OCCURED',
            errorMsg: 'An error occured'
        });
    }
}

exports.markAsDelivered = async (req, res, next) => {
    MarketingMessages.deliveredMarketingMessage(req.user.user_id, req.body.id, -1);

    res.status(200).json({
        success: 1, 
        hasMessage: 0 
    });
}

exports.sendPriceProposal = async (req, res, next) => {
    let hardAccept = req.body.hardAccept;
    let state = 'SLIDED'
    if(hardAccept) {
        state = 'ACCEPTED'
    }
    MarketingMessages.setPrice(req.user.user_id, req.body.id, req.body.price, state);

    res.status(200).json({
        success: 1, 
        hasMessage: 0 
    });
}
exports.sendNoInterest = async (req, res, next) => {
    MarketingMessages.refusePriceProposal(req.user.user_id, req.body.id);
    Users.setRefusePriceMarketing(req.user.user_id);

    res.status(200).json({
        success: 1, 
        hasMessage: 0 
    });
}


exports.markAsClicked = async (req, res, next) => {
    MarketingMessages.clickedMarketingMessage(req.user.user_id, req.body.id);

    res.status(200).json({
        success: 1, 
        hasMessage: 0 
    });
}

exports.test = async (req, res, next) => {
    console.log('test')
    res.status(200).json({
        success: 1, 
        hasMessage: 0 
    });
}
