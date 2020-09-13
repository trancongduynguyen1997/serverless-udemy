import { v4 as uuid } from 'uuid';
import AWS from 'aws-sdk';
import commonMiddleware from '../libs/commonMiddleware';
import createError from 'http-errors';

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
    const { title } = event.body;
    const startDate = new Date();
    const endDate = new Date();
    endDate.setHours(startDate.getHours() + 1);

    const auction = {
        id: uuid(),
        title,
        status: 'OPEN',
        highestBid: {
            amount: 0,
        },
        createdAt: startDate.toISOString(),
        endAt: endDate.toISOString(),
    };

    try {
        await dynamodb
            .put({
                TableName: process.env.AUCTIONS_TABLE_NAME,
                Item: auction,
            })
            .promise(); // * make this becomes valid promise syntax
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201, // * item created status
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(createAuction);
