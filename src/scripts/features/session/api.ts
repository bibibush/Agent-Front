import { requestAPI } from "../../share/api";
import { ResponseAPI } from "../../share/type";
import { HOST } from "../../share/var";
import { Session } from "./type";

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
