import { GoogleGenerativeAI } from "@google/generative-ai";


export const analyseContractText = async (contractText) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            throw new Error('Please set your GEMINI_API_KEY in your backend/.env file')
        };

        const genAI = new GoogleGenerativeAI(apiKey);

        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                responseMimeType: 'application/json'
            }
        });

        const prompt = `You are an expert financial analyst and contract attorney specializing in car lease and auto loan agreements.
        Analyze the following car lease/loan contract text and extract key financial parameters, identify potential hidden fees (red flags), and evaluate the contract's overall fairness.
        Return a JSON object conforming EXACTLY to the following structure:
        {
            "contractType": "Lease" or "Loan" or "Unknown",
            "interestRateOrAPR": number (percentage, e.g., 5.9) or null,
            "leaseTermMonths": number (months, e.g., 36) or null,
            "monthlyPayment": number (dollars, e.g., 420.50) or null,
            "downPayment": number (dollars, e.g., 2500.00) or null,
            "residualValue": number (dollars, e.g., 19500.00) or null,
            "mileageAllowanceYearly": number (miles, e.g., 10000) or null,
            "mileageOverageFeePerMile": number (dollars, e.g., 0.20) or null,
            "earlyTerminationFee": "string explaining early termination fees/conditions" or null,
            "purchaseOptionPrice": number (dollars, e.g., 20000.00) or null,
            "dispositionFee": number (dollars, e.g., 395.00) or null,
            "maintenanceResponsibility": "string explaining who is responsible for maintenance (lessee/dealer)" or null,
            "warrantyAndInsuranceRequirements": "string explaining warranty/insurance requirements" or null,
            "redFlags": ["list", "of", "hidden fees", "or", "unfavorable clauses", "found"],
            "fairnessScore": number (0 to 100, where 100 is highly customer-friendly and 0 is predatory),
            "fairnessExplanation": "brief detailed explanation for the score"
        }
        Only return raw JSON. Here is the contract text to analyze:
        
        ---
        ${contractText}
        ---`;

        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        return JSON.parse(responseText);
    } catch (error) {
        console.error(`Error in geminiService :`, error);
        throw new Error(`Gemini Analysis failed : ${error.message}`);
    }
}

export const chatWithCoach = async (message, history = [], contractAnalysis = null) => {
    try {
        const apiKey = process.env.GEMINI_API_KEY;
        const genAI = new GoogleGenerativeAI(apiKey);

        let systemInstruction = `
        You are an expert car buying and lease negotiation coach. Your goal is to guide the user in getting the absolute best deal on their car purchase, lease, or loan.
        Be strategic, professional, friendly, and practical. 
        - Recommend specific questions they should ask the dealer.
        - Point out terms they should negotiate (e.g., money factor/APR, document fees, cap cost reduction).
        - Help draft emails or text messages to send to dealers.
        `;

        if (contractAnalysis) {
            systemInstruction += `\n
            Here is the details of the vehical contract/offer they are currently trying to negotiate : 
            -Contract Type : ${contractAnalysis.contractType}
            -Interest Rate / APR : ${contractAnalysis.interestRateOrAPR}%
            -Monthly Payment : ${contractAnalysis.monthlyPayment}
            -DownPayment : ${contractAnalysis.downPayment}
            -Residual Value : ${contractAnalysis.residualValue}
            -Mileage Allowance : ${contractAnalysis.mileageAllowanceYearly} miles/year
            -Overage Fee : ${contractAnalysis.mileageOverageFeePerMile}/mile
            -Disposition Fee : ${contractAnalysis.dispositionFee}
            - Red Flags: ${JSON.stringify(contractAnalysis.redFlags)}
            - Fairness Score: ${contractAnalysis.fairnessScore}/100
            - Summary: ${contractAnalysis.fairnessExplanation}

            Provide advice tailored to negotiate these specific numbers with their dealer.
            `;
        }

        const model = genAI.getGenerativeModel({
            model : 'gemini-2.5-flash',
            systemInstruction : systemInstruction
        });

        const chat = model.startChat({
            history : history
        });

        const result = await chat.sendMessage(message);
        return result.response.text();
    } catch (error) {
        console.error('Error in chatWithCoach service', error);
        throw new Error(`Chatbot error : ${error.message}`);
    }
}

export default analyseContractText;