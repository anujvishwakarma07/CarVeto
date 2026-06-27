import { GoogleGenerativeAI } from "@google/generative-ai";


const analyseContractText = async (contractText) => {
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

export default analyseContractText;