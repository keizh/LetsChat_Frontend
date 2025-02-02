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
