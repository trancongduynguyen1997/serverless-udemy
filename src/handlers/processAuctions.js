import '../libs/getCloseAuctions';
import { getCloseAuctions } from '../libs/getCloseAuctions';
import { closeAuction } from '../libs/closeAuction';
import createError from 'http-errors';

async function processAuctions() {
    try {
        const closeAuctions = await getCloseAuctions();
        const closeAuctionPromises = closeAuctions.map((auction) => closeAuction(auction));
        await Promise.all(closeAuctionPromises);

        return { closed: closeAuctionPromises.length };
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
}

export const handler = processAuctions;
