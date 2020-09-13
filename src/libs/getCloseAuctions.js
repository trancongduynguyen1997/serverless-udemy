import AWS from 'aws-sdk';

const dynamodb = new AWS.DynamoDB.DocumentClient();

export async function getCloseAuctions() {
    const now = new Date();
    const param = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: 'statusAndEndDate',
        KeyConditionExpression: '#status = :status AND endAt <= :now',
        ExpressionAttributeValues: {
            ':status': 'OPEN',
            ':now': now.toISOString(),
        },
        ExpressionAttributeNames: {
            '#status': 'status',
        },
    };
    const result = await dynamodb.query(param).promise();

    return result.Items;
}
