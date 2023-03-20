import { DistributionBasic } from '../../models/distributions/distributionsModels';
import {RestService} from '../RestService';

export class DistributionsDataService extends RestService {
    private _baseUrl = './distributions.json';

    /**
     * Gets the lp data that is in a json file in the public folder for now later will be a service
     * @return LP[]
     */
    public async getAllDistributions(): Promise<DistributionBasic[]> {
        return this.fetchData(this._baseUrl).then((res:any) => {
            return res.data;
        }).catch((err:any) => {
            console.log(err);
            return err;
        });
    }

}


