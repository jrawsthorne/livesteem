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
import useSteemKeychain from "../hooks/useSteemKeychain";
import { Formik, Field } from "formik";

function Chat() {
  const { me } = useMe();
  const {
    steemKeychain,
    loaded: steemKeychainLoaded,
    checkForKeychain,
  } = useSteemKeychain();
  const { data, fetchMore, updateQuery } = useQuery(LATEST_MESSAGES_QUERY);

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

            // Need a better way but don't want to add user's messages twice.
            // They are added to the cache immediately after keychain response
            // so when sub triggers that post will be added again

            const newAuthorPerms = fetchMoreResult.comments.map(
              comment => `${comment.author.name}/${comment.permlink}`
            );
            const prevs = prev.messages.filter(
              message =>
                !newAuthorPerms.includes(
                  `${message.author.name}/${message.permlink}`
                )
            );
            return {
              ...prev,
              messages: [...fetchMoreResult.comments, ...prevs],
            };
          },
        });
      }
    },
  });

  function sendMessage(message) {
    // create post details - hard coded post for now

    const now = Date.now();
    const permlink = `${me.name}-${now}`;
    const parent_permlink = "first-live-chat-thread";
    const parent_author = "jrawsthorne-dev";
    const json_metadata = JSON.stringify({
      author: me.name,
      permlink,
    });
    return new Promise((resolve, reject) => {
      steemKeychain.requestPost(
        me.name,
        permlink,
        message,
        parent_permlink,
        parent_author,
        json_metadata,
        permlink,
        "",
        response => {
          if (response.success) {
            // if keychain success, update apollo cache
            updateQuery(prev => {
              const newMessage = {
                id: 0,
                permlink,
                author: me,
                // time could be off but keychain doesn't send back
                // block time and will be fixed after 3s
                created_at: new Date(Date.now()).toString(),
                body: message,
                children: 0,
                __typename: "comments",
              };
              return {
                ...prev,
                messages: [newMessage, ...prev.messages],
              };
            });
            resolve();
          } else {
            reject(new Error("Sorry, your message couldn't be sent"));
          }
        }
      );
    });
  }

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
        {me && (
          <Formik
            initialValues={{
              message: "",
            }}
            onSubmit={async (
              { message },
              { resetForm, setErrors, submitForm, setSubmitting }
            ) => {
              // double check keychain is installed
              if (!steemKeychain) {
                if (steemKeychainLoaded) {
                  setErrors({
                    message: "Please install Steem Keychain",
                  });
                  setSubmitting(false);
                } else {
                  checkForKeychain();
                  submitForm();
                }
              } else {
                try {
                  await sendMessage(message);
                  resetForm();
                } catch (e) {
                  setErrors({
                    message: e.message,
                  });
                  setSubmitting(false);
                }
              }
            }}
            render={props => (
              <form style={{ padding: 15 }} onSubmit={props.handleSubmit}>
                {props.errors.message}
                <Field me={me} component={MessageInput} name="message" />
                <Button
                  disabled={props.isSubmitting}
                  style={{ marginTop: 15 }}
                  type="submit"
                >
                  {props.isSubmitting ? "Sending" : "Send"}
                </Button>
              </form>
            )}
          />
        )}
      </ChatLayout>
    </Layout>
  );
}

export default Chat;
