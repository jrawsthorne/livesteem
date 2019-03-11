import Layout from "../components/Layout";
import { Messages } from "../components/ui/Message";
import ChatLayout from "../components/ui/ChatLayout";
import Message from "../components/Message";

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

  return (
    <Layout fluid>
      <ChatLayout>
        <Messages>
          {messages.map(message => (
            <Message key={message.id} message={message} />
          ))}
        </Messages>
      </ChatLayout>
    </Layout>
  );
}
