import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function closeAuction(auction) {
    const param = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id: auction.id },
        UpdateExpression: 'set #status = :status',
        ExpressionAttributeValues: {
            ':status': 'CLOSED',
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    };
    const result = await dynamodb.update(param).promise();
    return result;
}
