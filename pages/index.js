import { useQuery } from "react-apollo-hooks";
import Layout from "../components/Layout";

import { LATEST_MESSAGES_QUERY } from "../graphql/queries";
import { Messages } from "../components/ui/Message";
import Message from "../components/Message";
import ChatLayout from "../components/ui/ChatLayout";
import { Button } from "react-bootstrap";
import MessageInput from "../components/MessageInput";
import useMe from "../hooks/useMe";

function Chat() {
  const { me } = useMe();
  const { data } = useQuery(LATEST_MESSAGES_QUERY);

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
