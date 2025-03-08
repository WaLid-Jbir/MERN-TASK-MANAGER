import asyncHandler from "express-async-handler";
import crypto from "crypto";

const hashToken = asyncHandler(async (token) => {
    // create a hash token using sha256 algorithm
    return crypto.createHash("sha256").update(token.toString()).digest("hex");
});

export default hashToken;