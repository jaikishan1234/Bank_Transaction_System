const accountModel = require("../models/account.model");
const mongoose = require("mongoose");

async function createAccountController(req, res) {

    const user = req.user;

    const account = await accountModel.create({
        user: user._id
    })

    res.status(201).json({
        account
    })

}

async function getUserAccountsController(req, res) {

    const accounts = await accountModel.find({ user: req.user._id });

    res.status(200).json({
        accounts
    })
}

async function getAccountBalanceController(req, res) {
    try {
        const { accountId } = req.params;

        // ✅ 1. Validate ObjectId (prevents weird bugs)
        if (!mongoose.Types.ObjectId.isValid(accountId)) {
            return res.status(400).json({
                message: "Invalid account ID"
            });
        }

        // ✅ 2. Find account WITH user check (secure)
        const account = await accountModel.findOne({
            _id: accountId,
            user: req.user._id
        });

        // ✅ 3. If not found → clear reason
        if (!account) {
            return res.status(404).json({
                message: "Account not found or does not belong to user"
            });
        }

        // ✅ 4. Get balance
        const balance = await account.getBalance();

        return res.status(200).json({
            accountId: account._id,
            balance: balance
        });

    } catch (error) {
        console.error("Error fetching balance:", error);
        return res.status(500).json({
            message: "Internal server error"
        });
    }
}


module.exports = {
    createAccountController,
    getUserAccountsController,
    getAccountBalanceController
}