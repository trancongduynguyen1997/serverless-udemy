import AWS from 'aws-sdk';
import commonMiddleware from '../libs/commonMiddleware';
import { getAuctionById } from './getAuction';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    const { amount } = event.body;
    const { id } = event.pathParameters;
    const auction = await getAuctionById(id);

    if (auction.status !== 'OPEN') {
        throw new createError.Forbidden(`You can't place bid on closed auction`);
    }

    if (auction.highestBid.amount > amount) {
        throw new createError.Forbidden(`Input amount must be higher ${auction.highestBid.amount}`);
    }

    const param = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: 'set highestBid.amount = :amount',
        ExpressionAttributeValues: {
            ':amount': amount,
        },
        ReturnValues: 'ALL_NEW',
    };
    let updatedAuction;
    try {
        const result = await dynamodb.update(param).promise();
        updatedAuction = result.Attributes;
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = commonMiddleware(placeBid);
