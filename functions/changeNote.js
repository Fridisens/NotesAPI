const AWS = require('aws-sdk');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.changeNote = async (event) => {
  const { id, title, text } = JSON.parse(event.body);

  if (!id || !title || !text || title.length > 50 || text.length > 300) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input' }),
    };
  }

  const params = {
    TableName: process.env.NOTES_TABLE,
    Key: { id },
    UpdateExpression: "set title = :title, #txt = :text, modifiedAt = :modifiedAt",
    ExpressionAttributeNames: {
      "#txt": "text", 
    },
    ExpressionAttributeValues: {
      ":title": title,
      ":text": text,
      ":modifiedAt": new Date().toISOString(),
    },
    ReturnValues: "ALL_NEW",
  };

  try {
    const result = await dynamoDb.update(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(result.Attributes),
    };
  } catch (error) {
    console.error('Error updating note:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not update note', details: error.message }),
    };
  }
};