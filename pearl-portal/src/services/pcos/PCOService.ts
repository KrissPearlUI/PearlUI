import { PCOSummary } from '../../models/pcos/pcoModels';
import { RestService } from '../RestService';

export class PCODataService extends RestService {
    private _baseUrl = './pcosshort.json';

    /**
     * Gets the pco data that is in a json file in the public folder for now later will be a service
     * @return PCOSummary[]
     */
    public async getAllPCOs(): Promise<PCOSummary[]> {
        return this.fetchData(this._baseUrl).then((res: any) => {
            return res.data;
        }).catch((err: any) => {
            console.log(err);
            return err;
        });
    }

}

