import express, { Request, Response } from 'express';
import cors from 'cors';
import axios, { AxiosResponse } from 'axios';
import dotenv from 'dotenv';
import cron from 'node-cron';
import { PrismaClient } from '@prisma/client';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));


const CMS_API_KEY = process.env.COINMARKETCAP_API_KEY;
const CMS_API_KEY_CHARTS = process.env.COINMARKETCAP_API_KEY_CHARTS;

console.log("CoinMarketCap_API_KEYs", CMS_API_KEY, CMS_API_KEY_CHARTS);

if (!CMS_API_KEY || !CMS_API_KEY_CHARTS) {
    throw new Error('CoinMarketCap API keys are not set');
}

const prisma = new PrismaClient();

async function fetchNeoxaPrice(): Promise<void> {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
            params: {
                symbol: 'NEOX',
                convert: 'USD'
            },
            headers: {
                'X-CMC_PRO_API_KEY': CMS_API_KEY,
                'Accept': 'application/json'
            }
        });
        
        const data = response.data.data.NEOX;

        if (!data) {
            throw new Error('NEOX data not found');
        }
        

        const marketCap: number = data.self_reported_market_cap;
        const volume24h: number = data.quote.USD.volume_24h;
        const circulationSupply: number = data.self_reported_circulating_supply;
        const totalSupply: number = data.total_supply;
        const price: number = data.quote.USD.price;
        const lastUpdated = new Date(data.quote.USD.last_updated);

        console.log('NEOX price data', response.data.data.NEOX);
        console.log('NEOX price', price);
        console.log('Last updated', lastUpdated);
        
        //save the price data to the database
        if (data) {
            await prisma.neoxaPriceData.create({
                data: {
                    marketCap: marketCap,
                    volume24h: volume24h,
                    circulationSupply: circulationSupply,
                    totalSupply: totalSupply,
                    price: price,
                    timestamp: lastUpdated
                }
            })
        }
        
        //save the priceHistory data to the database
        if (price) {
            await prisma.neoxaPriceHistory.create({
                data: {
                    price: price,
                    timestamp: lastUpdated
                }
            })
        }

        

        
    } catch (error) {
        console.error('Error fetching NEOX price:', error);
        throw error;
    } finally {
        console.log('NEOX price fetch completed');
    }
};


//schedule the fetchNeoxaPrice function to run every 5mins
cron.schedule('*/5 * * * *', async () => {
    console.log('Starting NEOX price fetch...');
    await fetchNeoxaPrice();
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


