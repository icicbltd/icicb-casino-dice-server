const axios = require("axios");
const rand = require("random-seed").create();
require("dotenv").config();

function getRandomInt(max) {
    return Math.floor((Math.random() * max) + 1);
}
module.exports = {
    StartSignal: async (req, res) => {
        const { userName, betAmount, token, amount, direction, setSum } = req.body;
        var betValue = parseFloat(betAmount);
        var amountValue = parseFloat(amount);
        var sum = parseInt(setSum);
        let user = [];
        user[token] = {
            userName: userName,
            betAmount: betValue,
            userToken: token,
            amount: amountValue,
            sum: sum,
            direction: direction
        }
        try {
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/bet",
                    {
                        token: user[token].userToken,
                        amount: user[token].betAmount,
                    }
                );
            } catch (err) {
                throw new Error("Bet Error!");
            }
            var raiseprice;
            var dice = [];
            for (var i = 0; i < 2; i++) {
                dice[i] = getRandomInt(6);
            }
            var sum = dice[0] + dice[1];
            if (user[token].sum == sum) {
                if (user[token].direction == "True") {
                    if (sum == 2) {
                        raiseprice = 0;
                    } else if (sum == 3) {
                        raiseprice = user[token].betAmount * 35.3;
                    } else if (sum == 4) {
                        raiseprice = user[token].betAmount * 11.8;
                    } else if (sum == 5) {
                        raiseprice = user[token].betAmount * 5.88;
                    } else if (sum == 6) {
                        raiseprice = user[token].betAmount * 3.53;
                    } else if (sum == 7) {
                        raiseprice = user[token].betAmount * 2.35;
                    } else if (sum == 8) {
                        raiseprice = user[token].betAmount * 1.68;
                    } else if (sum == 9) {
                        raiseprice = user[token].betAmount * 1.36;
                    } else if (sum == 10) {
                        raiseprice = user[token].betAmount * 1.18;
                    } else if (sum == 11) {
                        raiseprice = user[token].betAmount * 1.07;
                    } else if (sum == 12) {
                        raiseprice = user[token].betAmount * 1.01;
                    }
                } else {
                    if (sum == 2) {
                        raiseprice = user[token].betAmount * 1.01;
                    } else if (sum == 3) {
                        raiseprice = user[token].betAmount * 1.07;
                    } else if (sum == 4) {
                        raiseprice = user[token].betAmount * 1.18;
                    } else if (sum == 5) {
                        raiseprice = user[token].betAmount * 1.36;
                    } else if (sum == 6) {
                        raiseprice = user[token].betAmount * 1.68;
                    } else if (sum == 7) {
                        raiseprice = user[token].betAmount * 2.35;
                    } else if (sum == 8) {
                        raiseprice = user[token].betAmount * 3.53;
                    } else if (sum == 9) {
                        raiseprice = user[token].betAmount * 5.88;
                    } else if (sum == 10) {
                        raiseprice = user[token].betAmount * 11.8;
                    } else if (sum == 11) {
                        raiseprice = user[token].betAmount * 35.3;
                    } else if (sum == 12) {
                        raiseprice = 0;
                    }
                }
            } else {
                raiseprice = 0;
            }
            var total = user[token].amount + raiseprice - user[token].betAmount;
            var msg = "Price  : " + raiseprice.toFixed(3) + "$";
            try {
                await axios.post(
                    process.env.PLATFORM_SERVER + "api/games/winlose",
                    {
                        token: user[token].userToken,
                        amount: raiseprice,
                        winState: raiseprice != 0 ? true : false,
                    }
                )
            } catch (err) {
                throw new Error("WinLose Error!");
            }
            try {
                res.json({
                    diceArray: dice,
                    msg: msg,
                    total: total,
                    raisePrice: raiseprice,
                    serverMsg: "Success"
                })
            } catch (error) {
                throw new Error("Can't find Server!");
            };
        } catch (err) {
            res.json({
                serverMsg: err.message
            })
        }
        delete user[token];
    },
};