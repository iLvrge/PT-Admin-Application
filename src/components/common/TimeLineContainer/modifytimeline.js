import moment from 'moment';


const modifyTimeline = (result) => {
    var t0 = performance.now();
    console.log("Call Perfomance start " + t0 + " milliseconds.");

    let itemDates = [], items = [];
    (async () => {
        if(result != null && typeof result.items != 'undefined' && result.items.length > 0){
            for(let i = 0; i < result.items.length; i++) {
                let start = moment(new Date(result.items[i].start));
                let otherItems = {
                    start: start,
                    end: start.clone().add(24, 'hours'),
                    className: result.className
                }
                Object.assign(result.items[i],otherItems)
                itemDates.push(start);  
            }
            items = [...result.items];
        }
        var t1 = performance.now();
        console.log("Call Perfomance took " + (t1 - t0) + " milliseconds.");
    })();

    return {
        items,
        itemDates
    }    
};
export default modifyTimeline;