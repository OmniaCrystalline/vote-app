/** @format */

export interface SignupParams {
  name: string;
  pass: string;
  email: string;
}

export interface LoginParams {
  pass: string;
  email: string;
}

export interface ModalProps {
  setmodal: (modalState: boolean) => void;
  modal: boolean;
}

export interface IJoke {
  _id: string;
  question: string;
  answer: string;
  votes: IVote[];
  availableVotes: [string];
}

export interface IVote {
  label: string;
  value: number;
  _id: string;
}

export interface User {
  name: string;
  pass: string;
  token: string;
  email: string;
}
