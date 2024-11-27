import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const changeNoteHandler = async (event) => {
  const { id, title, text } = event.body; // `httpJsonBodyParser` tolkar JSON-objekt
  const username = event.user.username; // Hämtas från token

  if (!id || !title || !text || title.length > 50 || text.length > 300) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input' }),
    };
  }

  const params = {
    TableName: process.env.NOTES_TABLE,
    Key: { id },
    UpdateExpression:
      'set title = :title, #txt = :text, modifiedAt = :modifiedAt',
    ConditionExpression: 'username = :username',
    ExpressionAttributeNames: {
      '#txt': 'text',
    },
    ExpressionAttributeValues: {
      ':title': title,
      ':text': text,
      ':modifiedAt': new Date().toISOString(),
      ':username': username,
    },
    ReturnValues: 'ALL_NEW',
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

export const changeNote = middy(changeNoteHandler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware());