export type Order = {
    type: string
    status: OrderStatus
    args?: unknown
}

export type OrderStatus = 'done' | 'in progress' | 'waiting'