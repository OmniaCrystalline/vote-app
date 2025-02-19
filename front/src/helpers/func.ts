/** @format */
import { IJoke, IVote, LoginParams, SignupParams } from "./interfaces";
import { URL } from "./variables";

export const signup = async ({ name, pass, email }: SignupParams) => {
  const r = await fetch(`${URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, pass, email }),
  });
  const data = await r.json();
  return data;
};

export const login = async ({ email, pass }: LoginParams) => {
  const res = await fetch(`${URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pass, email }),
  });
  const data = await res.json();
  return data;
};

export const newJoke = async () => {
  const r = await fetch(`${URL}/joke`);
  const data = await r.json();
  return data;
};

export const deleteJoke = async (id: string) => {
  const r = await fetch(`${URL}/joke/${id}`, {
    method: "DELETE",
  });
  const data = await r.json();
  return data;
};

export const getResult = async () => {
  const r = await fetch(`${URL}/results`)
  const data = r.json()
  return data
}

export const setVotes = async (id: string, votes: IVote[] ) => {
  const r = await fetch(`${URL}/joke/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(votes),
  });
  const data = r.json()
  return data
}

export const updateJoke = async (id:string, o: Partial<IJoke>) => {
  const r = await fetch(`${URL}/joke/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(o),
  });
  const data = await r.json()
  return data
}