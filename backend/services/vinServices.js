export const decodeVinNumber = async (vin) => {
    try {

        // NHTSA Flat Decode API
        const url = `https://vpic.nhtsa.dot.gov/api/vehicles/DecodeVinValues/${vin}?format=json`;

        const response = await fetch(url);
        if(!response.ok) {
            throw new Error(`NHTSA API responded with status ${response.status}`);
        }

        const data = await response.json();

        const carInfo = data.Results[0];
        if(carInfo.ErrorCode !== "0") {
            throw new Error(carInfo.ErrorText || "Invalid VIN Number provided.");
        }

        return {
            make : carInfo.Make,
            model : carInfo.Model,
            year : carInfo.ModelYear,
            manufacturer : carInfo.Manufacturer,
            bodyClass : carInfo.BodyClass,
            vehicleType : carInfo.VehicleType
        };
    } catch (error) {
        console.error(`Error in vinServices : `, error);
        throw new Error(`VIN Decode failed : ${error.message}`);
    }
}