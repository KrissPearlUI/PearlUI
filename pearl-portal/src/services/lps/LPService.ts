import {RestService} from '../RestService';
import {LP} from "../../models/lps/lpModels";

export class LPDataService extends RestService {
    private _baseUrl = './lpshort.json';

    /**
     * Gets the lp data that is in a json file in the public folder for now later will be a service
     * @return LP[]
     */
    public async getAllLPs(): Promise<LP[]> {
        return this.fetchData(this._baseUrl).then((res:any) => {
            return res.data;
        }).catch((err:any) => {
            console.log(err);
            return err;
        });
    }

}

