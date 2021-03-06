import { Form } from "react-bootstrap";
import styled from "styled-components";

const MessageInput = ({ className, me, form }) => (
  <Form.Control
    as="textarea"
    rows="2"
    className={className}
    placeholder={`Message as ${me.name}`}
    onChange={e => form.setValues({ message: e.target.value })}
    value={form.values.message}
  />
);

export default styled(MessageInput)`
  padding-left: 15px;
  margin-bottom: 0;
  min-height: 60px;
  max-height: 150px;
`;
