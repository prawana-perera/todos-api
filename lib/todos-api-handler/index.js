// import createNote from './createNote';
// import deleteNote from './deleteNote';
// import getNoteById from './getNoteById';
// import listNotes from './listNotes';
// import updateNote from './updateNote';
// import Note from './Note';
const AWS = require('aws-sdk');

const { create } = require('./lib');
const { STATUS, PRIORITY } = require('./lib/enums');

exports.handler = async (event) => {
  console.log('>>>>>> event', event);

  switch (event.info.fieldName) {
    case 'create':
      return create(event.arguments.input);
    case 'getAll':
      return [
        {
          id: '123232323',
          title: 'Learn Java',
          priority: PRIORITY[2],
          description: 'Java Java Java',
          status: STATUS[1],
          createdAt: new Date().toISOString(),
          modifiedAt: null,
          owner: '1111',
        },
      ];
    default:
      throw new Error(
        `Unrecognized request, fieldName = ${event.info.fieldName}`
      );
  }
};
