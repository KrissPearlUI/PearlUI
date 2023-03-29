import { Transaction } from '../../models/transactions/transactionsModels';
import { RestService } from '../RestService';

export class TransactionDataService extends RestService {
    private _baseUrl = './lpsTransactionsHistory.json';

    /**
     * Gets the lp data that is in a json file in the public folder for now later will be a service
     * @return Transaction[]
     */
    public async getAllTransactions(): Promise<Transaction[]> {
        return this.fetchData(this._baseUrl).then((res: any) => {
            return res.data;
        }).catch((err: any) => {
            console.log(err);
            return err;
        });
    }

}


