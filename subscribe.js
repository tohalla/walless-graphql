// @flow
import io from 'socket.io-client';
import gql from 'graphql-tag';
import {pascalize, camelizeKeys} from 'humps';

export default async(
  {url, wsToken, client}: {
    url: string,
    client: {writeFragment: () => void},
    wsToken: string | () => Promise<any>
  },
  callback: () => void
) => {
  const token = typeof wsToken === 'string' ? wsToken
    : wsToken && typeof wsToken.then === 'function' ? await wsToken()
    : undefined;
  const socket = io(url, {
    transportOptions: {
      polling: {
        extraHeaders: {token}
      }
    }
  });
  socket.on('notification', notification => {
    const {record, table, operations} = notification;
    if (record, table, operations) {
      const target = pascalize(table);
      const object = {__typename: target, ...camelizeKeys(record)};
      client.writeFragment({
        id: `${target}_${record.id}`,
        fragment: gql`
          fragment fragment on ${target} {
            ${Object.keys(object).reduce((prev, val) => prev + val + '\n', '')}
          }
        `,
        data: object
      });
    }
  });
};
