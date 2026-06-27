import { decodeVinNumber } from "../services/vinServices.js";

export const checkVin = async (req, res) => {
    try {
        const { vin } = req.params;

        if (!vin) {
            return res.status(400).json({
                error: 'Please provide a Vin Number'
            });
        }
        const carInfo = await decodeVinNumber(vin);
        res.status(200).json({
            message: 'VIN decoded successfully!',
            carInfo: carInfo
        });
    } catch (error) {
        console.error('Error in vinController :', error);
        res.status(500).json({
            error: error.message || 'failed to decode VIN'
        });
    }
}