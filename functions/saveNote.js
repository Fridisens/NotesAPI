const AWS = require('aws-sdk');
const { v4: uuidv4 } = require('uuid');
const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.saveNote = async (event) => {
  const { title, text } = JSON.parse(event.body);

  if (!title || !text || title.length > 50 || text.length > 300) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input' }),
    };
  }

  const params = {
    TableName: process.env.NOTES_TABLE,
    Item: {
      id: uuidv4(),
      title,
      text,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
    },
  };

  try {
    await dynamoDb.put(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify(params.Item),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not save note' }),
    };
  }
};