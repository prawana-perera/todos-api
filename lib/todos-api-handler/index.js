const { create, getAll } = require('./lib');

// https://dynobase.dev/dynamodb-nodejs/
const userId = '00000001';

exports.handler = async (event) => {
  console.log('>>>>>> event', event);

  switch (event.info.fieldName) {
    case 'create':
      return create(userId, event.arguments.input);
    case 'getAll':
      return getAll(userId, event.arguments);
    default:
      throw new Error(
        `Unrecognized request, fieldName = ${event.info.fieldName}`
      );
  }
};
