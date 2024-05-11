import { Msg } from "../types/message";

export const sendMsgToExtension = async (msg: Msg) => {
  return chrome?.runtime?.sendMessage<Msg>(msg);
};
