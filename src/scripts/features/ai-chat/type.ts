export interface OpenAIToolsParametersModel {
  type: string;
  propertires: Record<string, unknown>;
  required?: string[];
}

export interface OpenAIToolsModel {
  type: string;
  name: string;
  description?: string;
  parameters?: OpenAIToolsParametersModel;
}

export interface OpenAIResponseAPIModel {
  model: string;
  input: Array<Record<string, unknown>> | string;
  instructions?: string;
  stream?: boolean;
  tools?: OpenAIToolsModel[];
}
