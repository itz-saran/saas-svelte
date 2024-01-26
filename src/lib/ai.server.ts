import { HUGGINGFACE_API_KEY } from "$env/static/private";
import { HfInference } from "@huggingface/inference";

type GetAIResponseParams = {
	inputs: {
		question: string;
		context: string;
	};
};

const Hf = new HfInference(HUGGINGFACE_API_KEY);

export async function getAIResponse({ inputs }: GetAIResponseParams) {
	try {
		const response = await Hf.questionAnswering({
			model: "deepset/roberta-base-squad2",
			inputs,
		});
		return response;
	} catch (err) {
		console.log("AI error", err);
	}
}
