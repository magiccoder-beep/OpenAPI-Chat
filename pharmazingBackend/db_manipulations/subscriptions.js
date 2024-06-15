const db = require('../util/database');

exports.updateShouldNotVerify = (subscription_id) => {
    try {
        return db.execute(
            'UPDATE pharmazing.subscriptions set should_verify=0, updated_at=? where id=?',
            [new Date().toISOString().slice(0, 19).replace('T', ' '), subscription_id]
        );
    } catch (error) {
        console.error("Error updating updateShouldNotVerify:"+subscription_id, error);
        throw error;
    }
}

exports.updateSubscriptionAndroid = (subscription_id, startTimeMillis, expiryTimeMillis, userCancellationTimeMillis, autoRenewing, priceCurrencyCode, priceAmountMicros, countryCode, paymentState, purchaseType, acknowledgementState, cancelReason) => {
    console.log('models/answers/updateSubscription');
    try {
        return db.execute(
            'UPDATE pharmazing.subscriptions set startTimeMillis=?, expiryTimeMillis=?, userCancellationTimeMillis=?, autoRenewing=?, priceCurrencyCode=?,priceAmountMicros=?,countryCode=?,paymentState=?,purchaseType=?,acknowledgementState=?, updated_at=?, cancelReason=? where id=?',
            [startTimeMillis, expiryTimeMillis, userCancellationTimeMillis, autoRenewing, priceCurrencyCode, priceAmountMicros, countryCode, paymentState, purchaseType, acknowledgementState, new Date().toISOString().slice(0, 19).replace('T', ' '), cancelReason, subscription_id]
        );
    } catch (error) {
        console.error("Error updating subscription:"+subscription_id, error);
        throw error;
    }
}

exports.updateSubscriptionIOS = (subscription_id, startTimeMillis, originalPurchaseTimeMillis, expiryTimeMillis, userCancellationTimeMillis, autoRenewing, acknowledgementState, priceAmountMicros, priceCurrencyCode, countryCode, signedDateTimeMillis, status) => {
    console.log('models/answers/updateSubscriptionIOS');
    
    console.log(subscription_id)
    console.log(startTimeMillis)
    try {
        return db.execute(
            'UPDATE pharmazing.subscriptions set startTimeMillis=?, originalPurchaseTimeMillis=?, expiryTimeMillis=?, userCancellationTimeMillis=?, autoRenewing=?, acknowledgementState=?, priceAmountMicros=?, priceCurrencyCode=?, countryCode=?, signedDateTimeMillis=?, statusIOS=?, updated_at=? where id=?',
            [startTimeMillis, originalPurchaseTimeMillis, expiryTimeMillis, userCancellationTimeMillis, autoRenewing, acknowledgementState, priceAmountMicros, priceCurrencyCode, countryCode, signedDateTimeMillis, status, new Date().toISOString().slice(0, 19).replace('T', ' '), subscription_id]
        );
    } catch (error) {
        console.error("Error updating subscription:"+subscription_id, error);
        throw error;
    }
}

exports.getSubscriptionsShouldVerify = (user_id) => {
    console.log('getSubscriptions');
    return db.execute(
        'SELECT * from subscriptions where user_id=? AND should_verify=1',
        [user_id]
    );
}

exports.getSubscriptions = (user_id) => {
    console.log('getSubscriptions');
    return db.execute(
        'SELECT * from subscriptions where user_id=?',
        [user_id]
    );
}

exports.getValidSubscription = (user_id) => {
    const currentTime = Date.now();
    return db.execute(
        'SELECT * from subscriptions where user_id=? AND ?<expiryTimeMillis order by expiryTimeMillis DESC',
        [user_id, currentTime]
    );
}

exports.fetchOnId = (id) => {
    console.log('subscription fetchOnId');
    return db.execute(
        'SELECT * from subscriptions where id=?',
        [id]
    );
}

exports.createSubscriptionAndroid = (user_id, platform, productId,purchaseToken,orderId, startTimeMillis, expiryTimeMillis, userCancellationTimeMillis, autoRenewing, priceCurrencyCode, priceAmountMicros, countryCode, paymentState, purchaseType, acknowledgementState, cancelReason) => {
    return db.execute(
    'INSERT INTO pharmazing.subscriptions (user_id, platform, productId,purchaseToken,orderId, startTimeMillis, expiryTimeMillis, userCancellationTimeMillis, autoRenewing, priceCurrencyCode, priceAmountMicros, countryCode, paymentState, purchaseType, acknowledgementState, cancelReason, created_at, updated_at) VALUES (?, ?, ?, ?, ?,  ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?,  ?,?,?)',
    [user_id, platform, productId, purchaseToken, orderId, startTimeMillis, expiryTimeMillis, userCancellationTimeMillis, autoRenewing, priceCurrencyCode, priceAmountMicros, countryCode, paymentState, purchaseType, acknowledgementState, cancelReason, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
}

exports.createSubscriptionIOS = (user_id, platform, productId,orderId, startTimeMillis,originalPurchaseTimeMillis, expiryTimeMillis, autoRenewing, priceCurrencyCode, priceAmountMicros, countryCode, signedDateTimeMillis, statusIOS) => {
    return db.execute(
    'INSERT INTO pharmazing.subscriptions (user_id, platform, productId,orderId, startTimeMillis,originalPurchaseTimeMillis, expiryTimeMillis, autoRenewing, priceCurrencyCode, priceAmountMicros, countryCode, signedDateTimeMillis, statusIOS, created_at, updated_at) VALUES (?, ?, ?, ?, ?,  ?, ?, ?, ?, ?,  ?, ?, ?, ?, ?)',
    [user_id, platform, productId,orderId, startTimeMillis,originalPurchaseTimeMillis, expiryTimeMillis, autoRenewing, priceCurrencyCode, priceAmountMicros, countryCode, signedDateTimeMillis, statusIOS, new Date().toISOString().slice(0, 19).replace('T', ' '), new Date().toISOString().slice(0, 19).replace('T', ' ')]
    );
}
