import styled from "styled-components";

export const Messages = styled.div`
  display: flex;
  flex-direction: column-reverse;
  overflow-y: scroll;
  padding: 0 20px 0 20px;
`;

export const StyledMessage = styled.div`
  p {
    background-color: #ddd;
    border-radius: 3px;
    padding: 10px 15px;
    margin-bottom: 0;
    color: #004085;
    background-color: #cce5ff;
    border-color: #b8daff;
    display: inline-block;
    flex-wrap: nowrap;
    max-width: 100%;
    word-wrap: break-word;
  }
  small {
    display: block;
  }
  margin-bottom: 15px;
`;
