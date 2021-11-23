import { WsChatEventsEnum } from './../enums/ws-chat.events.enum';
export const InterMap = new Map()
  .set(WsChatEventsEnum.SEND_MESSAGE, () => {})
  .set(WsChatEventsEnum.RECEIVE_MESSAGE, () => {})
  .set(WsChatEventsEnum.EDIT_MESSAGE, () => {})
  .set(WsChatEventsEnum.DELETE_MESSAGE, () => {});
