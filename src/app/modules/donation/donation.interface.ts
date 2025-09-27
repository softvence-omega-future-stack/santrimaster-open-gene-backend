export type TDonation = {
    donationType: 'ONE_TIME' | 'MONTHLY' | 'ANNUAL',
    amount: number,
    donarName: string,
    donarEmail: string,
    country: string,
    tribute: string,
    paymentStatus: 'PENDING' | 'SUCCESS' | 'FAILED',
}