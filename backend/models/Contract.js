import mongoose, { Schema } from "mongoose";

const ContractSchema = new mongoose.Schema({
    fileName : {
        type : String,
        required : true,
    },
    fileSize : {
        type : Number,
        required : true,
    },
    rawText :  {
        type : String,
        required : true,
    },
    analysis : {
        type : Object,
        required : true
    },
    uploadedAt : {
        type : Date,
        default : Date.now,
    }

});

const Contract = mongoose.model("Contract", ContractSchema);
export default Contract;