const AWS = require('aws-sdk');
const KSUID = require('ksuid');

const { STATUS, PRIORITY } = require('./enums');

const docClient = new AWS.DynamoDB.DocumentClient();

const update = async (userId, { id, title, priority, description, status }) => {
  const params = {
    TableName: process.env.TODOS_TABLE,
    Key: {
      pk: `USER#${userId}`,
      sk: `TODO#${id}`,
    },
    // TODO: rename status to something else and update as well status = :status. Status is reserved keyword
    UpdateExpression:
      'SET title = :title, priority = :priority, description = :description, modifiedAt = :modifiedAt',
    ConditionExpression: 'attribute_exists(pk) and attribute_exists(sk)',
    ExpressionAttributeValues: {
      ':title': title,
      ':priority': PRIORITY[priority],
      ':description': description,
      //   ':status': status,
      ':modifiedAt': new Date().toISOString(),
    },
    ReturnValues: 'ALL_NEW',
  };
  try {
    const result = await docClient.update(params).promise();
    console.log('>>>> update', result);
    const updatedTodo = result.Attributes;

    return {
      id,
      title,
      description,
      priority: PRIORITY[updatedTodo.priority],
      status: STATUS[updatedTodo.status],
      owner: updatedTodo.owner,
      createdAt: updatedTodo.createdAt,
      modifiedAt: updatedTodo.modifiedAt,
    };
  } catch (err) {
    console.log('DynamoDB error: ', err);
    throw err;
  }
};

module.exports = update;
