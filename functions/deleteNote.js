import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import AWS from 'aws-sdk';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const deleteNoteHandler = async (event) => {
  const { id } = event.body;

  if (!id) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input' }),
    };
  }

  const username = event.user.username;

  const params = {
    TableName: process.env.NOTES_TABLE,
    Key: { id },
    ConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': username,
    },
  };

  try {
    await dynamoDb.delete(params).promise();
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Note deleted successfully' }),
    };
  } catch (error) {
    console.error('Error deleting note:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not delete note', details: error.message }),
    };
  }
};

export const deleteNote = middy(deleteNoteHandler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware());