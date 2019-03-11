import Layout from "../components/Layout";
import { Messages } from "../components/ui/Message";
import ChatLayout from "../components/ui/ChatLayout";
import Message from "../components/Message";
import MessageInput from "../components/MessageInput";
import { Button } from "react-bootstrap";

export default function Chat() {
  const messages = [
    {
      body: "Test Message",
      author: {
        name: "jrawsthorne",
      },
      created_at: "2019-03-11T20:10:00",
      id: 1,
    },
  ];

  const me = {
    name: "jrawsthorne",
  };

  return (
    <Layout fluid>
      <ChatLayout>
        <Messages>
          {messages.map(message => (
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
