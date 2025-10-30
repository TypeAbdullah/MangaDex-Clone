import axios from 'axios';
import RemoveToken from '../RateLimit';



export default async function fetchManga(mangaId) {
    try {
        await RemoveToken(1);

        const response = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_PROXY_SERVER_URL}/api/v1/manga/${mangaId}?includes[]=author&includes[]=artist&includes[]=cover_art&hasAvailableChapters=true`,
            crossDomain: true,
        });

        const responseData = response.data;

        // Check if response data is undefined
        if (!responseData || !responseData.data) {
            throw new Error('No data received from fetchManga');
        }

        return responseData.data;
    } catch (error) {
        console.error(`Error fetching manga ${mangaId}:`, error);
        throw error; // Rethrow the error to be caught by the caller
    }
}
