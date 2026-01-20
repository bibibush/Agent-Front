import { requestAPI } from "../../share/api";
import { ResponseAPI } from "../../share/type";
import { OpenAIResponseAPIModel } from "./type";

export async function getOpenaiResponse(data: OpenAIResponseAPIModel) {
  try {
    const bodyData = JSON.stringify(data);

    const response = await requestAPI<ResponseAPI<string>>(
      `http://localhost:8000/${OPENAI_RESPONSE_PREFIX}/text`,
      {
        method: "POST",
        body: bodyData,
      },
    );

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}
