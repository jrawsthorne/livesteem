import gql from "graphql-tag";
import { MESSAGES_FRAGMENT } from "./fragments";

export const ME_QUERY = gql`
  query me {
    me {
      name
      profile_image
    }
  }
`;

// hard coded post for now, in the future will
// have channels stemming from multiple posts

export const LATEST_MESSAGES_QUERY = gql`
  query messages {
    messages: comments(
      order_by: { id: desc }
      where: {
        parent: {
          author_name: { _eq: "jrawsthorne-dev" }
          permlink: { _eq: "first-live-chat-thread" }
        }
      }
    ) {
      ...MessageInfo
    }
  }
  ${MESSAGES_FRAGMENT}
`;

// Query to load messages created after a given ID.
// Will be triggered on subscription update

export const MORE_MESSAGES_QUERY = gql`
  query moreMessages($after: Int!) {
    comments(
      order_by: { id: asc }
      where: {
        parent: {
          author_name: { _eq: "jrawsthorne-dev" }
          permlink: { _eq: "first-live-chat-thread" }
        }
        id: { _gt: $after }
      }
    ) {
      ...MessageInfo
    }
  }
  ${MESSAGES_FRAGMENT}
`;
