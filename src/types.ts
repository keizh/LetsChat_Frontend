import React from "react";

export interface AuxProps {
  children: React.ReactNode;
}

export interface friendsInterface {
  _id: string;
  name: string;
  profileURL: string;
  email: string;
  lastOnline: number;
}

export interface contactsAPIOutputInterface {
  totalPages: number;
  totalDocuments: number;
  curPage: number;
  nextPage: number;
  hasMore: boolean;
  data: friendsInterface[];
}

export interface mssgInt {
  type: "text" | "image" | "audio" | "video" | "pdf";
  payload: string;
  mssgId: string;
  uploadTime: number;
  deleteState?: boolean;
  senderId: string;
  senderName: string;
}

export interface ONE2ONEResponseInterface {
  participants: string[];
  messages: mssgInt[] | [];
  roomId: string;
  _id: string;
}

export interface ActiveChatInterface {
  chatId: string;
  chatName: string;
  roomId: string;
  lastUpdated: number;
  profileURL: string;
  lastMessageSender: string;
  lastMessageTime: number;
  USER_LAST_ACCESS_TIME: number;
}
