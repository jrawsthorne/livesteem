import { useQuery, useSubscription } from "react-apollo-hooks";
import Layout from "../components/Layout";
import _ from "lodash";
import { LATEST_MESSAGES_QUERY, MORE_MESSAGES_QUERY } from "../graphql/queries";
import { LATEST_MESSAGES_SUB } from "../graphql/subscriptions";
import { Messages } from "../components/ui/Message";
import Message from "../components/Message";
import ChatLayout from "../components/ui/ChatLayout";
import { Button } from "react-bootstrap";
import MessageInput from "../components/MessageInput";
import useMe from "../hooks/useMe";

function Chat() {
  const { me } = useMe();
  const { data, fetchMore } = useQuery(LATEST_MESSAGES_QUERY);

  // calculate what the after paramter should be for subscription

  const minId =
    data.messages && data.messages.length > 0
      ? _.max(data.messages.map(message => message.id))
      : null;

  useSubscription(LATEST_MESSAGES_SUB, {
    variables: {
      after: minId,
    },
    onSubscriptionData: () => {
      if (minId) {
        fetchMore({
          variables: {
            after: minId,
          },
          query: MORE_MESSAGES_QUERY,
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev;
            return {
              ...prev,
              messages: [...fetchMoreResult.comments, ...prev.messages],
            };
          },
        });
      }
    },
  });

  return (
    <Layout fluid>
      <ChatLayout>
        <Messages>
          {data &&
            data.messages &&
            data.messages.map(message => (
              <Message key={message.id} message={message} />
            ))}
        </Messages>
        <form style={{ padding: 15 }}>
          <MessageInput me={me} />
          <Button style={{ marginTop: 15 }} type="submit">
            Send
          </Button>
        </form>
      </ChatLayout>
    </Layout>
  );
}

export default Chat;
