const AWS = require('aws-sdk');

const { STATUS, PRIORITY } = require('./enums');

const docClient = new AWS.DynamoDB.DocumentClient();

const getById = async (userId, id) => {
  const params = {
    TableName: process.env.TODOS_TABLE,
    Key: {
      pk: `USER#${userId}`,
      sk: `TODO#${id}`,
    },
  };

  try {
    const results = await docClient.get(params).promise();
    console.log('>>>> getById', results);

    if (!results.Item) {
      throw 'NotFound';
    }

    return {
      ...results.Item,
      priority: PRIORITY[results.Item.priority],
      status: STATUS[results.Item.status],
    };
  } catch (err) {
    console.log('DynamoDB error: ', err);
    throw err;
  }
};

module.exports = getById;
