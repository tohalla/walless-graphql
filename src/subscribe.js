import gql from 'graphql-tag';
import {pascalize, camelizeKeys} from 'humps';

import {dataIdFromObject} from 'util';

export default async(
  {client, socket},
  callback
) => {
  socket.on('notification', notification => {
    const {record, table, operations} = notification;
    if (record, table, operations) {
      const target = pascalize(table);
      const object = {__typename: target, ...camelizeKeys(record)};
      const id = dataIdFromObject({__typename: target, ...record});
      const fragment = gql`
        fragment fragment on ${target} {
          ${Object.keys(object).reduce((prev, val) => prev + val + '\n', '')}
        }
      `;
      callback({
        notification,
        target,
        operations,
        newRecord: object,
        oldRecord: client.readFragment({
          id,
          fragment
        })
      });
      client.writeFragment({
        id,
        fragment,
        data: object
      });
    }
  });
};
