const Booking = require('../models/Booking');
const { addHistory } = require('./bookingHistory');

/**
 * Expire any PAYMENT_PENDING bookings whose payment-hold window has elapsed.
 * Releases their dates back to Available. Called lazily before calendar reads
 * and the sales bookings list (no background timer — correctness must not
 * depend on one, especially on serverless).
 */
const expirePaymentHolds = async (now = new Date()) => {
  const expired = await Booking.find({
    bookingStatus: 'PAYMENT_PENDING',
    paymentHoldExpiresAt: { $lte: now },
  });
  for (const booking of expired) {
    booking.bookingStatus = 'EXPIRED';
    booking.paymentHoldExpiresAt = now;
    addHistory(booking, {
      actor: 'System',
      actorType: 'system',
      action: 'Payment hold expired',
      note: 'The payment window elapsed and the dates were released.',
      changes: { bookingStatus: 'EXPIRED' },
    });
    await booking.save();
  }
  return expired.length;
};

module.exports = { expirePaymentHolds };