// Create an axio to post request to get data from the graph
import axios from "axios";
export async function subgraphQuery(query) {
    try {
        console.log(`creating new query`)
        const SUBGRAPH_URL = "https://api.thegraph.com/subgraphs/name/atdinesh/learningweb3"
        const response = await axios.post(SUBGRAPH_URL, { query });

        if (response.data.errors) {
            console.error(response.data.errors);
            throw new Error(`Error making subgraph query ${response.data.errors}`);
        }
        return response.data.data;
    } catch (error) {
        console.error(error);
        throw new Error(`Could not query the subgraph ${error.message}`);
    }
}