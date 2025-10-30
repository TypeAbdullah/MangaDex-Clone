import axios from 'axios';



export default async function fetchMangasByIds(seasonalMangasData) {
    try {
        const mangaIds = seasonalMangasData.data.relationships
            .filter(rel => rel.type === 'manga')
            .map(rel => rel.id);

            console.log(mangaIds)

        const response = await axios({
            method: 'get',
            url: `${process.env.REACT_APP_PROXY_SERVER_URL}/api/v1/manga`,
            params: {
                ids: mangaIds,
            },
        });

        return response.data;
    } catch (error) {
        console.error('Error fetching mangas by IDs:', error);
        throw error;
    }
}
