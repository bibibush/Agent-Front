import { requestAPI, requestStreamingAPI } from "../../share/api";
import { ResponseAPI, SSEEvent } from "../../share/type";
import { OpenAIResponseAPIModel } from "./type";
import { OPENAI_RESPONSE_PREFIX, HOST, PORT } from "../../share/var";

export async function getOpenaiResponse(data: OpenAIResponseAPIModel) {
  try {
    const response = await requestAPI<ResponseAPI<string>>(
      `https://${HOST}/${OPENAI_RESPONSE_PREFIX}/text`,
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

export async function* getOpenaiResponseSSE(
  data: OpenAIResponseAPIModel,
): AsyncGenerator<SSEEvent> {
  try {
    const stream = requestStreamingAPI(
      `https://${HOST}/${OPENAI_RESPONSE_PREFIX}/sse`,
      {
        method: "POST",
        body: data,
      },
    );

    for await (const event of stream) {
      yield event;
    }
  } catch (error) {
    throw error;
  }
}
