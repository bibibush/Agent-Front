import { requestAPI, requestStreamingAPI } from "../../share/api";
import { ResponseAPI } from "../../share/type";
import { OpenAIResponseAPIModel } from "./type";
import { OPENAI_RESPONSE_PREFIX } from "../../share/var";

export async function getOpenaiResponse(data: OpenAIResponseAPIModel) {
  try {
    const response = await requestAPI<ResponseAPI<string>>(
      `http://localhost:8000/${OPENAI_RESPONSE_PREFIX}/text`,
      {
        method: "POST",
        body: data,
      },
    );

    return response;
  } catch (error) {
    return Promise.reject(error);
  }
}

export async function* getOpenaiResponseSSE(data: OpenAIResponseAPIModel) {
  try {
    const stream = requestStreamingAPI(
      `http://localhost:8000/${OPENAI_RESPONSE_PREFIX}/sse`,
      {
        method: "POST",
        body: data,
      },
    );

    for await (const chunk of stream) {
      yield chunk;
    }
  } catch (error) {
    throw error;
  }
}
