import { requestAPI } from "../../share/api";
import { ResponseAPI } from "../../share/type";
import { HOST } from "../../share/var";
import { Session, User } from "./type";

export async function getSessions(userId: number) {
  try {
    const response = await requestAPI<ResponseAPI<Session[]>>(
      `https://${HOST}/sessions/${userId}`,
      {
        method: "GET",
      },
    );

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function getUser() {
  try {
    const response = await requestAPI<ResponseAPI<User>>(
      `https://${HOST}/user`,
      {
        method: "GET",
      },
    );
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function deleteSession(sessionId: number) {
  try {
    const response = await requestAPI<ResponseAPI<null>>(
      `https://${HOST}/sessions/${sessionId}`,
      {
        method: "DELETE",
      },
    );
    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}
