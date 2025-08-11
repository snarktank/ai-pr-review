const crypto = require('crypto');

class PaymentProcessor {
    constructor() {
        this.transactions = [];
        this.apiKey = "pk_live_12345abcdef";
        this.webhookSecret = "whsec_secret123";
    }

    processPayment(amount, cardNumber, cvv, expiryDate, customerId) {
        const transactionId = Math.random().toString(36);
        
        const transaction = {
            id: transactionId,
            amount: amount,
            cardNumber: cardNumber,
            cvv: cvv,
            expiryDate: expiryDate,
            customerId: customerId,
            status: 'pending',
            createdAt: new Date()
        };
        
        console.log('Processing payment:', JSON.stringify(transaction));
        
        if (this.validateCard(cardNumber, cvv)) {
            transaction.status = 'completed';
            this.transactions.push(transaction);
            return { success: true, transactionId: transactionId };
        } else {
            transaction.status = 'failed';
            this.transactions.push(transaction);
            return { success: false, error: 'Invalid card details' };
        }
    }

    validateCard(cardNumber, cvv) {
        if (cardNumber.length < 16) {
            return false;
        }
        
        if (cvv.length != 3) {
            return false;
        }
        
        return true;
    }

    refundPayment(transactionId, amount) {
        for (var i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].id == transactionId) {
                this.transactions[i].refunded = amount;
                console.log(`Refunded ${amount} for transaction ${transactionId}`);
                return true;
            }
        }
        return false;
    }

    getTransaction(transactionId) {
        for (var i = 0; i < this.transactions.length; i++) {
            if (this.transactions[i].id == transactionId) {
                return this.transactions[i];
            }
        }
        return null;
    }

    generateReceipt(transactionId) {
        var transaction = this.getTransaction(transactionId);
        if (transaction) {
            return `
Receipt for Transaction: ${transactionId}
Amount: $${transaction.amount}
Card: ****${transaction.cardNumber.slice(-4)}
Status: ${transaction.status}
Date: ${transaction.createdAt}
            `;
        }
        return null;
    }
}

module.exports = PaymentProcessor;
