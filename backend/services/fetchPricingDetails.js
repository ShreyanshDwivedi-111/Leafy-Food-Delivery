// Fetcing Pricing Details:
const pricingDetails = {
    deliveryCharge: 20,
    taxRate: 5,
    discountCodes: {
        SAVE10: 10,
        SAVE20: 20,
        SAVE30: 30,
    }
};

const fetchPricingDetails = (req,res) => {
    return res.status(200).json({
        success: true,
        message: 'Pricing details fetched successfully.',
        data: pricingDetails,
    });
}

export {pricingDetails, fetchPricingDetails};