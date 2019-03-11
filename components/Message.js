import TimeAgo from "react-timeago";
import { StyledMessage } from "./ui/Message";

export default ({ message }) => {
  return (
    <StyledMessage>
      <h6>{message.author.name}</h6>
      <p>{message.body}</p>
      <small>
        <TimeAgo date={message.created_at} />
      </small>
    </StyledMessage>
  );
};
