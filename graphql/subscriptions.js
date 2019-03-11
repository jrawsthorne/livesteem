import gql from "graphql-tag";

// subscribe to messages created after some id
// Just the id is returned which can be used in a
// refetch of the messages query so no messages are
// missed due to websocket issues
// hardcoded post for now

export const LATEST_MESSAGES_SUB = gql`
  subscription messages($after: Int) {
    comments(
      order_by: { id: asc }
      where: {
        _and: [{ parent_id: { _eq: 69353917 } }, { id: { _gt: $after } }]
      }
    ) {
      id
    }
  }
`;
