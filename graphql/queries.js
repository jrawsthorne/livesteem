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
      where: { parent_id: { _eq: 69353917 } }
    ) {
      ...MessageInfo
    }
  }
  ${MESSAGES_FRAGMENT}
`;
