const { inspect } = require("util")
const debug = (data) => {
    console.log(inspect(data, { depth: null }));
}

const winning_amount = (bid_amount, set_of_pack) => {
    const winning_amount = (36/set_of_pack)*bid_amount;
    return winning_amount;
}

const win_check = (user_bids, selected) => {
    let win_lots = []
    let win = false;
    let win_amount = 0;
    user_bids.single_bid.forEach(bid => {
        if(bid.key === String(selected)) {
            win = true;
            win_amount = winning_amount(bid.bid.value, 1);
        }
    });
    user_bids.pack_bid.forEach(bid => {
        if(bid.key.includes(selected)) {
            win = true;
            console.log(bid);
            win_lots.push(bid);
        }
    });

    if(win_lots.length > 0) {
        win_lots.forEach(bid => {
            win_amount += winning_amount(bid.bid.value * bid.key.length, bid.key.length);
        });
    }

    return {win, win_amount, selected};
}

const random_select = () => {
    return Math.floor(Math.random() * 37);
}

const bid_stop_start = (time) => {
    if(time < 10){
        return true;
    }
    return false;
}

const add_reduce_balance = async (userId, amount) => {
    const user = await redisClient.hGetAll(userId);
    const new_balance = parseInt(user.balance) + parseInt(amount);
    await redisClient.hSet(userId, 'balance', new_balance);
    return new_balance;
}

const bid_seperation_in_pack_or_single = (bids_object) => {
    const single_bid = [];
    const pack_bid = [];
    Object.keys(bids_object).forEach(key => {
        if(key.includes('-')){
            pack_bid.push({key: key.split("-"), bid: bid_chip_seperation(bids_object[key].icon)});
        }else if(key.includes('_DOZEN')) {
            let keys = [];
            if(key.includes('1ST_DOZEN')) {
                for(let i = 1; i <= 12; i++){
                    keys.push(i);
                }
            }else if(key.includes('2ND_DOZEN')) {
                for(let i = 13; i <= 24; i++){
                    keys.push(i);
                }
            }else if(key.includes('3RD_DOZEN')) {
                for(let i = 25; i <= 36; i++){
                    keys.push(i);
                }
            }
            pack_bid.push({key: keys, bid: bid_chip_seperation(bids_object[key].icon)});
        }else if(key.includes('_COLUMN')) {
            let keys = [];
            if(key.includes('1ST_COLUMN')) {
                for(let i = 1; i <= 36; i+=1){
                    if(i % 3 === 1) {
                        keys.push(i);
                    }
                }
            }else if(key.includes('2ND_COLUMN')) {
                for(let i = 1; i <= 36; i+=1){
                    if(i % 3 === 2) {
                        keys.push(i);
                    }
                }
            }else if(key.includes('3RD_COLUMN')) {
                for(let i = 1; i <= 36; i+=1){
                    if(i % 3 === 0) {
                        keys.push(i);
                    }
                }
            }
            pack_bid.push({key: keys, bid: bid_chip_seperation(bids_object[key].icon)});
        }else if(key.includes('EVEN')) {
            let keys = [];
            for(let i = 1; i <= 36; i+=1){
                if(i % 2 === 0) {
                    keys.push(i);
                }
            }
            pack_bid.push({key: keys, bid: bid_chip_seperation(bids_object[key].icon)});
        }else if(key.includes('ODD')) {
            let keys = [];
            for(let i = 1; i <= 36; i+=1){
                if(i % 2 === 1) {
                    keys.push(i);
                }
            }
            pack_bid.push({key: keys, bid: bid_chip_seperation(bids_object[key].icon)});
        }else if(key.includes('BLACK')) {
            let keys = [];
            for(let i = 1; i <= 36; i+=1){
                if(i % 2 === 0) {
                    keys.push(i);
                }
            }
            pack_bid.push({key: keys, bid: bid_chip_seperation(bids_object[key].icon)});
        }else if(key.includes('RED')) {
            let keys = [];
            for(let i = 1; i <= 36; i+=1){
                if(i % 2 === 1) {
                    keys.push(i);
                }
            }
            pack_bid.push({key: keys, bid: bid_chip_seperation(bids_object[key].icon)});
        }else if(key.includes('19_TO_36')) {
            let keys = [];
            for(let i = 19; i <= 36; i++){
                keys.push(i);
            }
            pack_bid.push({key: keys, bid: bid_chip_seperation(bids_object[key].icon)});
        }else if(key.includes('1_TO_18')) {
            let keys = [];
            for(let i = 1; i <= 18; i++){
                keys.push(i);
            }
            pack_bid.push({key: keys, bid: bid_chip_seperation(bids_object[key].icon)});
        }else if(key.includes('0')) {
            single_bid.push({key, bid: bid_chip_seperation(bids_object[key].icon)});
        }else {
            single_bid.push({key, bid: bid_chip_seperation(bids_object[key].icon)});
        }
    });
    return {single_bid, pack_bid};
}

const bid_chip_seperation = (bids_icon) => {
    let bid_chip = {}
    if(bids_icon.includes('5000rs_chip')){
        bid_chip = { bid_icon: bids_icon, value: 5000 }
    }else if (bids_icon.includes('1000rs_chip')) {
        bid_chip = { bid_icon: bids_icon, value: 1000 }
    }else if(bids_icon.includes('500rs_chip')){
        bid_chip = { bid_icon: bids_icon, value: 500 }
    }else if(bids_icon.includes('200rs_chip')){
        bid_chip = { bid_icon: bids_icon, value: 200 }
    }else if(bids_icon.includes('100rs_chip')){
        bid_chip = { bid_icon: bids_icon, value: 100 }
    }else if(bids_icon.includes('50rs_chip')){
        bid_chip = { bid_icon: bids_icon, value: 50 }
    }else if(bids_icon.includes('10rs_chip')){
        bid_chip = { bid_icon: bids_icon, value: 10 }
    }else if(bids_icon.includes('5rs_chip')){
        bid_chip = { bid_icon: bids_icon, value: 5 }
    }
    return bid_chip;
}

const bid_amount_calculation = (bids) => {
    let bid_amount = 0;
    if(bids.single_bid.length > 0) {
        bids.single_bid.forEach(bid => {
            bid_amount += bid.bid.value;
        });
    }
    if(bids.pack_bid.length > 0) {
        bids.pack_bid.forEach(bid => {
            bid_amount += bid.bid.value * bid.key.length;
        });
    }
    return bid_amount;
}

module.exports = {
    winning_amount,
    bid_stop_start,
    add_reduce_balance,
    bid_seperation_in_pack_or_single,
    bid_chip_seperation,
    win_check,
    random_select,
    debug,
    bid_amount_calculation
}