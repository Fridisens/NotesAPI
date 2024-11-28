import middy from '@middy/core';
import httpErrorHandler from '@middy/http-error-handler';
import httpJsonBodyParser from '@middy/http-json-body-parser';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import AWS from 'aws-sdk';
import { nanoid } from 'nanoid';

const dynamoDb = new AWS.DynamoDB.DocumentClient();

const saveNoteHandler = async (event) => {
  const { title, text } = event.body;
  const username = event.user.username;

  
  if (!title || !text || title.length > 50 || text.length > 300) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid input' }),
    };
  }

  const newNote = {
    id: nanoid(),
    username,
    title,
    text,
    createdAt: new Date().toISOString(),
    modifiedAt: new Date().toISOString(),
  };

  const params = {
    TableName: process.env.NOTES_TABLE,
    Item: newNote,
  };

  try {
    console.log('Saving new note:', newNote);
    await dynamoDb.put(params).promise();

    return {
      statusCode: 201,
      body: JSON.stringify(newNote),
    };
  } catch (error) {
    console.error('Error saving note:', error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Could not save note', details: error.message }),
    };
  }
};

export const saveNote = middy(saveNoteHandler)
  .use(httpJsonBodyParser())
  .use(httpErrorHandler())
  .use(authMiddleware());