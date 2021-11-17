const AWS = require('aws-sdk');

const { STATUS, PRIORITY } = require('./enums');

const docClient = new AWS.DynamoDB.DocumentClient();

const deleteById = async (userId, id) => {
  const params = {
    TableName: process.env.TODOS_TABLE,
    Key: {
      pk: `USER#${userId}`,
      sk: `TODO#${id}`,
    },
    ConditionExpression: 'attribute_exists(pk) and attribute_exists(sk)',
    ReturnValues: 'ALL_OLD',
  };

  try {
    const result = await docClient.delete(params).promise();
    console.log('>>>> deleteById', result);
    const deletedTodo = result.Attributes;

    return {
      ...deletedTodo,
      priority: PRIORITY[deletedTodo.priority],
      status: STATUS[deletedTodo.status],
    };
  } catch (err) {
    console.log('DynamoDB error: ', err);
    throw err;
  }
};

module.exports = deleteById;
