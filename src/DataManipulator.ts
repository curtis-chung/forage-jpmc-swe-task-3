import { ServerRespond } from './DataStreamer';

// Define the value type the schema must have
export interface Row {
    price_abc: number,
    price_def: number,
    ratio: number,
    timestamp: Date,
    upper_bound: number,
    lower_bound: number,
    trigger_alert: number | undefined,
}


export class DataManipulator {
    static generateRow(serverResponds: ServerRespond[]) {
        // Create boundaries to trigger alert when there is "noticeable" price movements
        const upperBound = 1 + 0.03;
        const lowerBound = 1 - 0.03;

        // Get ratio of avg price between ABC and DEF
        const stockABC = serverResponds[0];
        const stockDEF = serverResponds[1];
        const avgPriceABC = (stockABC.top_ask.price + stockABC.top_bid.price) / 2;
        const avgPriceDEF = (stockDEF.top_ask.price + stockDEF.top_bid.price) / 2;
        const avgPriceRatio = avgPriceABC / avgPriceDEF;

        return {
            price_abc: avgPriceABC,
            price_def: avgPriceDEF,
            ratio: avgPriceRatio,
            timestamp: stockABC.timestamp > stockDEF.timestamp ? stockABC.timestamp : stockDEF.timestamp,
            upper_bound: upperBound,
            lower_bound: lowerBound,
            trigger_alert: (avgPriceRatio > upperBound || avgPriceRatio < lowerBound) ? avgPriceRatio : undefined,
        };
    }
}
