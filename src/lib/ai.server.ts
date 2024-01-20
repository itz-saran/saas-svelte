import { HUGGINGFACE_API_KEY } from "$env/static/private";
import { HfInference } from "@huggingface/inference";
import { HuggingFaceStream, StreamingTextResponse } from "ai";

type GetAIResponseParams = {
	inputs: {
		question: string;
		context: string;
	};
};
const Hf = new HfInference(HUGGINGFACE_API_KEY);

export async function getAIResponse({ inputs }: GetAIResponseParams) {
	const response = Hf.textGenerationStream({
		model: "deepset/roberta-base-squad2",
		inputs: JSON.stringify(inputs),
	});
	const stream = HuggingFaceStream(response);
	return new StreamingTextResponse(stream);
}
