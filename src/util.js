export const dataIdFromObject = result =>
  result.__typename && result.id ?
    `${result.__typename}_${result.id}` : result.nodeId;
