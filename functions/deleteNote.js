const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.deleteNote = async (event) => {
    const { id } = JSON.parse(event.body);

    if (!id) {
        return {
            statusCode: 400,
            body: JSON.stringify ({ error: 'Invalid input' }),
        };
    }

    const params = {
        TableName: process.env.NOTES_TABLE,
        Key: { id },
    };

    try {
        await dynamoDb.delete(params).promise();
        return {
            statusCode: 200,
            body: JSON.stringify ({ message: 'Note deleted succesfully' }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify ({ error: 'Could not delete note' }),
        };
    }
};