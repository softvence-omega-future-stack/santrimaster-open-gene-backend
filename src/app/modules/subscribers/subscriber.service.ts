import { SubscriberModel } from "./subscriber.schema"

const save_new_subscriber_into_db = async(payload: any) => {
    const result = await SubscriberModel.create(payload)
    return result
}

export const subscriber_services = {
    save_new_subscriber_into_db
}